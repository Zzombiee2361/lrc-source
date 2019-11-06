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
			'role' => '1',
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

		$user = Auth::user();

		$scopes = [
			[],
			['contribute'],
			['contribute', 'approve'],
			['contribute', 'approve'],
		];

		$tokenResult = $user->createToken('Personal Access Token', $scopes[$user->role]);

		return response()->json([
			'access_token' => $tokenResult->accessToken,
			'token_type' => 'Bearer',
			'expires_at' => now()->addDays(15)->toDateTimeString(),
			'user' => $user
		]);
	}

	public function logout() {
		$userTokens = Auth::user()->tokens;
		foreach ($userTokens as $token) {
			$token->revoke();
		}

		return response()->json([
			'message' => 'Successfully logged out'
		]);
	}

	public function user() {
		$user = Auth::user();
		return response()->json($user);
	}
}
