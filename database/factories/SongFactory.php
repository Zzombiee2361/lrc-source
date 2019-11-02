<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Song;
use Faker\Generator as Faker;

$factory->define(Song::class, function (Faker $faker) {
    return [
        'id' => $faker->regexify('[\w\d]{8}-[\w\d]{4}-[\w\d]{4}-[\w\d]{4}-[\w\d]{12}'),
        'name' => $faker->sentence(3),
        'artist' => $faker->name,
        'album_id' => $faker->regexify('[\w\d]{8}-[\w\d]{4}-[\w\d]{4}-[\w\d]{4}-[\w\d]{12}'),
        'album' => $faker->sentence(1),
        'view_count' => 0,
    ];
});
