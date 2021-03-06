<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Lyric extends Model
{
	protected $keyType = 'string';
    public $incrementing = false;

    protected $guarded = ['created_at', 'updated_at'];

    public function song() {
    	return $this->belongsTo('App\Song', 'id');
    }

    public function contributor() {
    	return $this->belongsTo('App\User', 'contributed_by');
    }

    public function approver() {
    	return $this->belongsTo('App\User', 'approved_by');
    }
}
