<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Requests;

class MusicBrainzController extends Controller {
	public function search(Request $request){
		$validatedData = $request->validate([
			'query' => 'required',
			'offset' => 'integer',
		]);
		foreach ($validatedData as $key => $value) {
			$params[] = "$key=$value";
		}
		$params = implode('&', $params);

		$headers = [
			'Accept' => 'application/json',
			'User-Agent' => 'lrc-source/0.0.1 ( daffamumtaz2001@gmail.com )'
		];

		$request = Requests::get('https://musicbrainz.org/ws/2/recording?' . $params, $headers);
		echo $request->body;
	}
}
