<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use App\User;

class AuthController extends Controller
{
	public function register(Request $request) {
		$request->validate([
			'name' => 'required|string',
			'email' => 'required|string|email|unique:users',
			'password' => 'required|string|confirmed'
		]);

		$user = new User([
			'name' => $request->name,
			'email' => $request->email,
			'password' => bcrypt($request->password),
			'role_id' => '1',
		]);

		$user->save();

		return response()->json([
			'message' => 'Successfully created user!'
		], 201);
	}
	
	public function login(Request $request) {
		$request->validate([
			'email' => 'required|string|email',
			'password' => 'required|string',
		]);

		$credentials = request(['email', 'password']);

		if(!Auth::attempt($credentials)) {
			return response()->json([
				'message' => 'Wrong username or password'
			], 401);
		}

		return response()->json([
			'message' => 'Login success',
			'user' => Auth::user(),
		]);
	}

	public function logout() {
		// workaround found on https://github.com/laravel/sanctum/issues/87
		Auth::guard('web')->logout();

		return response()->json([
			'message' => 'Successfully logged out'
		]);
	}

	public function user() {
		$user = Auth::user();
		return response()->json([
			'message' => 'success',
			'user' => $user,
		]);
	}
}
