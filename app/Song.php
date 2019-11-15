<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Song extends Model
{
	protected $keyType = 'string';
	public $incrementing = false;

    public function lyric() {
    	return $this->hasOne('App\Lyric', 'id');
    }
}
