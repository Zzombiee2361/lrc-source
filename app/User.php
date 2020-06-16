<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'role'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function lyric_contributions() {
        return $this->hasMany('App\Lyric', 'contributed_by');
    }

    public function lyric_approvals() {
        return $this->hasMany('App\Lyric', 'approved_by');
    }

    public function lyrics_contributions() {
        return $this->hasMany('App\LyricHistory', 'contributed_by');
    }

    public function lyrics_approvals() {
        return $this->hasMany('App\LyricHistory', 'approved_by');
    }

    public function rejected_lyrics_contributions() {
        return $this->hasMany('App\RejectedLyric', 'contributed_by');
    }

    public function rejected_lyrics_approvals() {
        return $this->hasMany('App\RejectedLyric', 'approved_by');
    }
}
