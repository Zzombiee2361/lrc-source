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
        factory(App\Lyric::class, 10)->create()->each(function ($lyric) {
            $lyric->song()->save(
                factory(App\Song::class)->make(['id' => $lyric->id])
            );
            $GLOBALS['revision'] = 1;
            $lyric->histories()->saveMany(
                factory(App\LyricHistory::class, rand(1, 3))->make(['id_lyric' => $lyric->id])
            );
            $lyric->histories()->save(
                factory(App\LyricHistory::class)->make([
                    'id_lyric' => $lyric->id,
                    'contributed_by' => $lyric->contributed_by,
                    'approved_by' => $lyric->approved_by,
                    'lyric' => $lyric->lyric
                ])
            );
        });
        // factory(App\Song::class, 10)->create()->each(function($song) {
        //     $GLOBALS['revision'] = 1;
        // 	$song->lyrics()->saveMany(
        //         factory(App\Lyric::class, rand(1, 3))->make(['id_song' => $song->id])
        //     );
        // });
        unset($GLOBALS['revision']);
    }
}
