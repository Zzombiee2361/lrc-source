<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Lyric;
use App\LyricHistory;
use App\User;
use Faker\Generator as Faker;

$factory->define(Lyric::class, function (Faker $faker) {
    $user = User::all();
    $reviewer = User::where('role_id', 3)->get();
    return [
        'id' => $faker->uuid,
        'contributed_by' => $user->random()->id,
        'approved_by' => $reviewer->random()->id,
        'lyric' => $faker->text
    ];
});

$factory->define(LyricHistory::class, function (Faker $faker) {
    $user = User::all();
    $reviewer = User::where('role_id', 3)->get();
    return [
        'revision' => $GLOBALS['revision']++,
        'contributed_by' => $user->random()->id,
        'approved_by' => $reviewer->random()->id,
        'lyric' => $faker->text
    ];
});
