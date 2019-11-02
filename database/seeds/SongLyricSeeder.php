<?php

use Illuminate\Database\Seeder;

class SongLyricSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(App\Song::class, 10)->create()->each(function($song) {
        	$lyrics = factory(App\Lyric::class, 5)->make();
        	$song->lyrics()->saveMany($lyrics);
        });
    }
}
