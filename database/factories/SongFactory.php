<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Song;
use Faker\Generator as Faker;

$factory->define(Song::class, function (Faker $faker) {
    return [
        'name' => $faker->sentence(3),
        'artist' => $faker->name,
        'id_album' => $faker->uuid,
        'album' => $faker->sentence(1),
        'view_count' => 0,
    ];
});
