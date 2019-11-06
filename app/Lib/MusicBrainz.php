<?php

namespace App\Lib;

use GuzzleHttp\Client;

class MusicBrainz {
	public function fetch($url) {
		$client = new Client([
			'base_uri' => 'https://musicbrainz.org/ws/2/'
		]);

		$headers = [
			'Accept' => 'application/json',
			'User-Agent' => 'lrc-source/0.0.1 ( daffamumtaz2001@gmail.com )'
		];

		try {
			$result = $client->get($url, [
				'headers' => $headers
			]);
		} catch (\Exception $exc) {
			if($exc->hasResponse()) {
				$result = $exc->getResponse();
			} else {
				$result = $exc;
			}
		}
		return $result;
	}

	public static function search($parameters, $type = 'recording') {
		$params = [];
		foreach ($parameters as $key => $value) {
			$params[] = "$key=$value";
		}
		$params = implode('&', $params);

		return (new self)->fetch($type . '?' . $params);
	}

	public static function get($mbid, $query = [], $type = 'recording') {
		foreach ($query as $key => $value) {
			$qry[] = "$key=$value";
		}
		$qry = implode('&', $qry);
		return (new self)->fetch("$type/$mbid?$qry");
	}
}
