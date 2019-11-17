<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class LyricHistory extends Model
{
    protected $table = 'lyric_history';
    public $timestamps = false;

    protected $guarded = ['created_at'];

    public function song() {
    	return $this->belongsTo('App\Song', 'id_song');
    }

    public function contributor() {
    	return $this->belongsTo('App\User', 'contributed_by');
    }

    public function approver() {
    	return $this->belongsTo('App\User', 'approved_by');
    }
}
