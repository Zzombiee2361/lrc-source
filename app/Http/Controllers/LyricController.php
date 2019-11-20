<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use cogpowered\FineDiff;
use App\Song;
use App\Lyric;
use App\LyricHistory;
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
		if(!$release) {
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

	// TODO: test this code
	public function approve(Request $request) {
		$user = Auth::user();
		$request->validate([
			'id' => 'required',
		]);
		$id_history = $request->input('id');

		DB::beginTransaction();
		try {
			$history = LyricHistory::find($id_history);
			if($history->approved_by !== null) throw new \Exception("Already Approved", 400);

			// approve selected history
			$history->approved_by = $user->id;
			$history->save();
			$id_song = $history->id_song;
			$newest_revision = $history->revision;

			// get previous revision that's not approved
			$not_approved = LyricHistory::where([
				'id_song' => $id_song,
				'revision <' => $newest_revision
			])
			->whereNull('approved_by')
			->orderBy('revision', 'desc')
			->get();

			// loop through and approve
			$prevItem = $history;
			foreach ($not_approved as $item) {
				$item->approved_by = $user->id;
				$opcode = $this->getOpcodes($item->lyric, $prevItem->lyric);
				$item->lyric = $opcode;
				$item->save();
				$prevItem = $item;
			}

			// convert previous lyric to opcode, if there's any
			if($prevItem->revision > 1) {
				$prevHistory = LyricHistory::where([
					'id_song' => $history->id_song
				])
				->whereNotNull('approved_by')
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
			DB::rollBack();
			return response()->json([
				'message' => $exc->getMessage(),
			], $exc->getCode() ? $exc->getCode() : 500);
		}
	}
}
