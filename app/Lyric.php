<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Lyric extends Model
{
	public $timestamps = false;
    public function post() {
    	return $this->belongsTo('App\Song', 'id_song');
    }

    public function contributor() {
    	return $this->belongsTo('App\User', 'contributed_by');
    }

    public function approver() {
    	return $this->belongsTo('App\User', 'approved_by');
    }
}
