<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Lyric;
use App\User;
use Faker\Generator as Faker;

$factory->define(Lyric::class, function (Faker $faker) {
    $user = User::all();
    $reviewer = User::where('role', 3)->get();
    return [
        'revision' => $GLOBALS['revision']++,
        'contributed_by' => $user->random()->id,
        'approved_by' => (rand(1, 3) === 1 ? null : $reviewer->random()->id),
        'lyric' => $faker->text
    ];
});
