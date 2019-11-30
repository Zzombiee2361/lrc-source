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
		$NUMBER_OF_LYRICS = 50;
        
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        App\LyricHistory::truncate();
        App\RejectedLyric::truncate();
        App\Lyric::truncate();
        App\Song::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        factory(App\Song::class, $NUMBER_OF_LYRICS)->create()->each(function($song) {
			factory(App\Lyric::class)->create(['id' => $song->id]);

			$MAX_REVISION = 10;
			$GLOBALS['revision'] = 1;
			$revision_count = rand(1, $MAX_REVISION);
			$accepted = rand(1, $MAX_REVISION);
			$lyric = $song->lyric;

			if($accepted > 1) {
				$song->histories()->saveMany(
					factory(App\LyricHistory::class, $accepted-1)->make(['id_song' => $song->id])
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

			if($accepted < $revision_count) {
				$song->histories()->saveMany(
					factory(App\LyricHistory::class, $revision_count - $accepted)->make(['id_song' => $lyric->id, 'approved_by' => null])
				);
			}
        });

        unset($GLOBALS['revision']);
    }
}
