<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HomeController extends Controller
{
	public function getNeedReview() {
		DB::enableQueryLog();

		// $subquery = DB::table('lyric_history')
		// 	->selectRaw('id_song, MAX(revision)')
		// 	->whereNull('approved_by')
		// 	->groupBy('id_song')
		// 	->toSql();

		// $needReview = DB::table('lyric_history')
		// 	->whereRaw("(id_song, revision) IN ( $subquery )")
		// 	->get();

		$needReview = DB::table('songs')
			->select(['songs.*'])
			->distinct()
			->join('lyric_history', 'songs.id', '=', 'lyric_history.id_song')
			->whereNull('approved_by')
			->get();

		$data = ($needReview->count() >= 5 ? $needReview->random(5) : $needReview);

		return response()->json([
			'message' => 'success',
			'query' => DB::getQueryLog(),
			'data' => $data
		]);
	}

	public function getRecent() {
		$recents = DB::table('lyrics')
			->join('songs', 'lyrics.id', '=', 'songs.id')
			->orderBy('lyrics.updated_at', 'desc')
			->limit(10)
			->get();
		
		return response()->json([
			'message' => 'success',
			'data' => $recents,
		]);
	}
}
