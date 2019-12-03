<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRelationships extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreign('role_id')->references('id')->on('user_roles');
        });
        Schema::table('lyrics', function (Blueprint $table) {
        	$table->foreign('id')->references('id')->on('songs');
        	$table->foreign('contributed_by')->references('id')->on('users');
        	$table->foreign('approved_by')->references('id')->on('users');
        });
        Schema::table('lyric_history', function (Blueprint $table) {
        	$table->foreign('id_song')->references('id')->on('songs');
        	$table->foreign('contributed_by')->references('id')->on('users');
        	$table->foreign('approved_by')->references('id')->on('users');
        });
        Schema::table('rejected_lyrics', function (Blueprint $table) {
        	$table->foreign('id_history')->references('id')->on('lyric_history');
        	$table->foreign('contributed_by')->references('id')->on('users');
        	$table->foreign('rejected_by')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['role_id']);
        });
        Schema::table('lyrics', function (Blueprint $table) {
            $table->dropForeign(['id']);
            $table->dropForeign(['contributed_by']);
            $table->dropForeign(['approved_by']);
        });
        Schema::table('lyric_history', function (Blueprint $table) {
            $table->dropForeign(['id_song']);
            $table->dropForeign(['contributed_by']);
            $table->dropForeign(['approved_by']);
        });
        Schema::table('rejected_lyrics', function (Blueprint $table) {
            $table->dropForeign(['id_history']);
            $table->dropForeign(['contributed_by']);
            $table->dropForeign(['rejected_by']);
        });
    }
}
