<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Song extends Model
{
	protected $keyType = 'string';
	public $incrementing = false;

    public function lyrics() {
    	return $this->hasMany('App\Lyric', 'id_song');
    }
}
