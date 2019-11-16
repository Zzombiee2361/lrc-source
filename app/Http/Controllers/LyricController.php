<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

	public function contribute(Request $request) {
		$user = Auth::user();
		$request->validate([
			'id_song' => 'required|uuid',
			'id_album' => 'required|uuid',
			'lyric' => 'required|string'
		]);

		$song = Song::where([
			['id', $request->input('id_song')],
			['id_album', $request->input('id_album')]
		]);
		if(!$song) {
			$create = $this->createSong($request->input(['id_song']), $request->input(['id_album']));
			if($create !== true) {
				return $create;
			}
		}

		$lyric = new Lyric;
		$lyric->id_song = $request->input('id_song');
		$lyric->contributed_by = $user->id;
		$lyric->lyric = $request->input('lyric');
		$lyric->save();

		return response()->json([
			'message' => 'Lyric contributed, waiting moderator approval'
		]);
	}

	public function approve(Request $request) {
		$user = Auth::user();
		$request->validate([
			'id' => 'required',
		]);
		$id = $request->input('id');

		$lyric = Lyric::find($id);
		if(!$lyric) {
			return response()->json([
				'message' => 'Lyric not found'
			], 404);
		}

		$lyric->approved_by = $user->id;
		$lyric->save();

		$revision = 0;
		if(LyricHistory::where('id_lyric', $id)->first()) {
			$revision = LyricHistory::where('id_lyric', $id)->max('revision');
		}
		$lyricHistory = new LyricHistory;
		$lyricHistory->id_lyric = $id;
		$lyricHistory->revision = $revision+1;
		$lyricHistory->contributed_by = $lyric->contributed_by;
		$lyricHistory->approved_by = $user->id;
		$lyricHistory->lyric = $lyric->lyric;
		$lyricHistory->save();

		return response()->json([
			'message' => 'Lyric approved',
			'lyric' => $lyric,
			'history' => $lyricHistory,
		]);
	}
}
