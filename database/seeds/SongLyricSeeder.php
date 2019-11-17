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

            factory(App\Lyric::class)->create(['id' => $song->id])->each(function ($lyric) use ($song) {
                $GLOBALS['revision'] = 1;
                $revision_count = rand(1, 3);
                if($revision_count > 1) {
                    $song->histories()->saveMany(
                        factory(App\LyricHistory::class, $revision_count-1)->make(['id_song' => $lyric->id])
                    );
                }

                $song->histories()->save(
                    factory(App\LyricHistory::class)->make([
                        'id_song' => $lyric->id,
                        'contributed_by' => $lyric->contributed_by,
                        'approved_by' => $lyric->approved_by,
                        'lyric' => $lyric->lyric
                    ])
                );
            });
        });

        unset($GLOBALS['revision']);
    }
}
