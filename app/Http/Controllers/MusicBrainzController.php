<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;

use App\Lib\MusicBrainz;

class MusicBrainzController extends Controller {
	public function search(Request $request){
		$validatedData = $request->validate([
			'query' => 'required',
			'offset' => 'integer',
		]);
		$response = MusicBrainz::search($validatedData);
		echo $response->getBody();
		// var_dump($response);
	}
}
