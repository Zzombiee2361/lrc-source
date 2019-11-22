<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RejectedLyric extends Model
{
    protected $table = 'rejected_lyrics';
    public $timestamps = false;

    protected $guarded = ['created_at'];

    public function history() {
    	return $this->belongsTo('App\LyricHistory', 'id_history');
    }

    public function contributor() {
    	return $this->belongsTo('App\User', 'contributed_by');
    }

    public function approver() {
    	return $this->belongsTo('App\User', 'approved_by');
    }
}
