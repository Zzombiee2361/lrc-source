<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Song;

class LyricController extends Controller {

	public function contribute(Request $request) {
		$user = Auth::user();

		
	}
}
