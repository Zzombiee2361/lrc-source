<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;

class MusicBrainzController extends Controller {
	private $client;
	public function __construct() {
		$this->client = new Client([
			'base_uri' => 'https://musicbrainz.org/ws/2/'
		]);
	}

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

		$response = $this->client->get('recording?' . $params, [
			'headers' => $headers
		]);
		echo $response->getBody();
	}
}
