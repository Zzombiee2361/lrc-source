<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use cogpowered\FineDiff;
use App\Song;
use App\Lyric;
use App\LyricHistory;
use App\RejectedLyric;
use App\Lib\MusicBrainz;

class LyricController extends Controller {

	/**
	 * Create song
	 * @param string $id_song MusicBrainz recording MBID
	 * @param string $id_album MusicBrainz release MBID
	 * @return \Illuminate\Http\JsonResponse|bool
	 */
	private function createSong($id_song, $id_album) {

		/**
		 * Process MusicBrainz response
		 * @param $response \GuzzleHttp\Psr7\Response MusicBrainz response
		 * @return array|\Illuminate\Http\JsonResponse
		 */
		function processResponse($response) {
			if($response->getStatusCode() !== 200) {
				$msg = (
					$response instanceof \GuzzleHttp\Psr7\Response
					? json_decode($response->getBody(), true)
					: ['message' => $response->getReasonPhrase()]
				);
				return [
					'success' => false,
					'data' => response()->json($msg, $response->getStatusCode())
				];
			}
			return [
				'success' => true,
				'data' => json_decode($response->getBody(), true)
			];
		}

		// get song data
		$response = MusicBrainz::get($id_song, ['inc' => 'artist-credits+releases']);
		$recording = processResponse($response);
		if($recording['success']) $recording = $recording['data'];
		else return $recording['data'];

		// get album data
		$release = array_search($id_album, array_column($recording['releases'], 'id'));
		if($release === false) {
			return response()->json([
				'message' => 'Invalid album'
			], 422);
		}
		$album = $recording['releases'][$release];

		// combine artist name
		$listArtist = ($album['artist-credit'] ? $album['artist-credit'] : $recording['artist-credit']);
		$artist = '';
		foreach ($listArtist as $a) {
			$artist .= $a['name'] . ($a['joinphrase'] ? $a['joinphrase'] : '');
		}

		// save song
		$song = new Song;
		$song->id = $recording['id'];
		$song->name = $recording['title'];
		$song->artist = $artist;
		$song->id_album = $id_album;
		$song->album = $album['title'];
		$song->view_count = 0;
		$song->save();
		return true;
	}

	private function getOpcodes($string_one, $string_two) {
		$granularity = new FineDiff\Granularity\Word;
		$diff = new FineDiff\Diff($granularity);
		return $diff->getOpcodes($string_one, $string_two);
	}

	public function contribute(Request $request) {
		$user = Auth::user();
		$request->validate([
			'id_song' => 'required|uuid',
			'id_album' => 'required|uuid',
			'lyric' => 'required|string'
		]);

		$id = $request->input('id_song');
		$album = $request->input('id_album');

		$song = Song::where([
			['id', $id],
			['id_album', $album]
		])->get();
		if($song->isEmpty()) {
			$create = $this->createSong($id, $album);
			if($create !== true) {
				return $create;
			}
		}

		$revision = 0;
		if(LyricHistory::where('id_song', $id)->first()) {
			$revision = LyricHistory::where('id_song', $id)->max('revision');
		}
		$lyricHistory = new LyricHistory;
		$lyricHistory->id_song = $id;
		$lyricHistory->revision = $revision+1;
		$lyricHistory->contributed_by = $user->id;
		$lyricHistory->lyric = $request->input('lyric');
		$lyricHistory->save();

		return response()->json([
			'message' => 'Lyric contributed, waiting moderator approval'
		]);
	}

	public function approve(Request $request) {
		$user = Auth::user();
		$request->validate([
			'id' => 'required|int',
		]);
		$id_history = $request->input('id');

		DB::beginTransaction();
		try {
			$history = LyricHistory::find($id_history);
			if($history->approved_by !== null) throw new \Exception("Already Approved", 400);

			// approve selected history
			$history->approved_by = $user->id;
			$history->approved_at = now();
			$history->save();
			$id_song = $history->id_song;
			$newest_revision = $history->revision;

			// get previous revision that's not approved
			$not_approved = LyricHistory::where([
				'id_song' => $id_song,
				['revision', '<', $newest_revision]
			])
			->whereNull('approved_by')
			->orderBy('revision', 'desc')
			->get();

			// loop through and approve
			$prevLyric = $history->lyric;
			$lastRevision = $history->revision;
			foreach ($not_approved as $item) {
				$currentLyric = $item->lyric;
				$item->approved_by = $user->id;
				$item->approved_at = now();
				$opcode = (string) $this->getOpcodes($prevLyric, $currentLyric);
				$item->lyric = $opcode;
				$item->save();

				$prevLyric = $currentLyric;
				$lastRevision = $item->revision;
			}

			// convert previous lyric to opcode, if there's any
			if($lastRevision > 1) {
				$prevHistory = LyricHistory::where([
					'id_song' => $history->id_song,
					'revision' => $lastRevision - 1
				])
				->orderBy('revision', 'desc')
				->first();

				$opcode = $this->getOpcodes($history->lyric, $prevHistory->lyric);
				$prevHistory->lyric = $opcode;
				$prevHistory->save();
			}

			Lyric::updateOrCreate(
				['id' => $id_song],
				[
					'contributed_by' => $history->contributed_by,
					'approved_by' => $history->approved_by,
					'lyric' => $history->lyric,
				]
			);

			DB::commit();
			return response()->json([
				'message' => 'Lyric approved',
			]);
		} catch (\Throwable $exc) {
			$code = intval($exc->getCode());
			$code = !!$code ? $code : 500;
			DB::rollBack();
			return response()->json([
				'message' => $exc->getMessage()
			], $code);
		}
	}

	public function getRevision(Request $request) {
		$request->validate([
			'id_song'		=> 'required|uuid',
			'revision'		=> 'int',
			'from' 			=> 'int',
			'to' 			=> 'int',
			'approve_only'	=> 'in:true,false',
			'html'			=> 'in:true,false',
		]);

		$id_song = $request->input('id_song');
		$revision = $request->input('revision');
		if($revision === null) {
			$revFrom = $request->input('from', 1);
			$revTo = $request->input('to');
		}
		$approve_only = $request->input('approve_only', 'true');
		$approve_only = ($approve_only === 'true' ? true : false);
		$html = $request->input('html', 'false');
		$html = ($html === 'true' ? true : false);

		$histories = DB::table('lyric_history')
			->select([
				'lyric_history.*',
				'contributor.name as contributor_name',
				'approver.name as approver_name'
			])
			->leftJoin(
				'users as contributor',
				'contributor.id', '=', 'lyric_history.contributed_by'
			)
			->leftJoin(
				'users as approver',
				'approver.id', '=', 'lyric_history.approved_by'
			)
			->where('id_song', '=', $id_song);
		if($revision === null) {
			$histories->where('revision', '>=', $revFrom);
			if($revTo !== null) {
				$histories->where('revision', '<=', $revTo);
			}
		} else {
			$histories->where('revision', '>=', $revision);
		}

		if($approve_only) {
			$histories->whereNotNull('approved_by');
		}

		$histories->orderBy('revision', 'desc');
		$histories = $histories->get();

		if($histories->isEmpty()) {
			return response()->json([
				'message' => 'No revision found'
			], 404);
		}

		if($html) {
			$render = new FineDiff\Render\Html;
		} else {
			$render = new FineDiff\Render\Text;
		}
		$lastLyric = '';
		$lastHistory = null;
		foreach ($histories as $history) {
			if($lastHistory === null || $lastHistory->approved_by === null) {
				$lastLyric = $history->lyric;
			} else {
				$lastLyric = $render->process($lastLyric, $history->lyric);
			}
			$lastHistory = $history;
			$history->lyric = $lastLyric;
		}
		$lastHistory->lyric = $lastLyric;
		$data = ($revision === null ? $histories : $lastHistory);

		return response()->json([
			'message' => 'success',
			'data' => $data,
		]);
	}

	public function reject(Request $request) {
		$user = Auth::user();
		$request->validate([
			'id' => 'required|int'
		]);

		$rejected = LyricHistory::find($request->input('id'));
		if(!$rejected) {
			return response()->json([
				'message' => 'No lyric found'
			], 404);
		}

		$id_song = $rejected->id_song;
		$revision = $rejected->revision;

		$rejected = LyricHistory::where([
			'id_song' => $id_song,
			['revision', '>=', $revision]
		])->orderBy('revision')->get();

		$lyric = LyricHistory::where('id_song', $id_song)
			->whereNotNull('approved_by')
			->orderBy('revision', 'desc')
			->first();

		DB::beginTransaction();
		try {
			foreach ($rejected as $item) {
				$reject = new RejectedLyric;
				$reject->id_history = $lyric->id;
				$reject->contributed_by = $item->contributed_by;
				$reject->rejected_by = $user->id;
				$reject->lyric = $this->getOpcodes($lyric->lyric, $item->lyric);
				$reject->save();
				$item->delete();
			}

			DB::commit();
			return response()->json([
				'message' => 'Lyric rejected',
			]);
		} catch (\Throwable $exc) {
			$code = intval($exc->getCode());
			$code = !!$code ? $code : 500;
			DB::rollBack();
			return response()->json([
				'message' => $exc->getMessage()
			], $code);
		}
	}

	public function testFunc(Request $request) {
		$mode = $request->input('mode');
		$string1 = $request->input('string1');
		$string2 = $request->input('string2');

		$result = [];
		if($mode === 'get opcode') {
			$result['opcode'] = (string) $this->getOpcodes($string1, $string2);
		} else if($mode === 'process opcode') {
			$render = new FineDiff\Render\Text;
			$result['text'] = $render->process($string1, $string2);
		}

		return response()->json($result);
	}
}
