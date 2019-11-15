<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class LyricHistory extends Model
{
    protected $table = 'lyric_history';

    public function lyric() {
    	return $this->belongsTo('App\Lyric', 'id_lyric');
    }

    public function contributor() {
    	return $this->belongsTo('App\User', 'contributed_by');
    }

    public function approver() {
    	return $this->belongsTo('App\User', 'approved_by');
    }
}
