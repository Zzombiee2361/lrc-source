<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Lyric;
use Faker\Generator as Faker;

$factory->define(Lyric::class, function (Faker $faker) {
    return [
        'revision' => $faker->randomDigit,
        'contributed_by' => function () {
        	return factory(App\User::class)->create()->id;
        },
        'approved_by' => function () {
        	return factory(App\User::class)->create()->id;
        },
        'lyric' => $faker->text
    ];
});
