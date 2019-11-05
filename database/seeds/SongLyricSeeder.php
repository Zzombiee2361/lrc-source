<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SongLyricSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        App\Lyric::truncate();
        App\Song::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        factory(App\Song::class, 10)->create()->each(function($song) {
            $GLOBALS['revision'] = 1;
        	$song->lyrics()->saveMany(
                factory(App\Lyric::class, rand(1, 3))->make(['id_song' => $song->id])
            );
        });
        unset($GLOBALS['revision']);
    }
}
