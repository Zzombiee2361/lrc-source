<?php

namespace App\Http\Controllers\MusicBrainz;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class SearchController extends Controller {
    public function index(){
		$headers = [
			'Accept' => 'application/json'
		];

		$data = [
			'recording' => 'Wolves',
			'artist' => 'Selena gomez'
		];
		foreach ($data as $key => $value) {
			$dataQry[] = "$key:$value";
		}
		$dataQry = implode(' AND ', $dataQry);

		$request = Requests::get('https://musicbrainz.org/ws/2/recording?query=' . $dataQry, $headers);
		echo $request->body;
	}
}
