<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Song extends Model
{
    public function lyrics() {
    	return $this->hasMany('App\Lyric', 'id_song');
    }
}
