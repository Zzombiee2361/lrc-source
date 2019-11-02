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
            $table->foreign('role')->references('id')->on('user_roles');
        });
        // Schema::table('songs', function (Blueprint $table) {
        // 	$table->foreign('id_lyric')->references('id')->on('lyrics');
        // });
        Schema::table('lyrics', function (Blueprint $table) {
        	$table->foreign('id_song')->references('id')->on('songs');
        	$table->foreign('contributed_by')->references('id')->on('users');
        	$table->foreign('approved_by')->references('id')->on('users');
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
            $table->dropForeign(['role']);
        });
        // Schema::table('songs', function (Blueprint $table) {
        //     $table->dropForeign(['id_lyric']);
        // });
        Schema::table('lyrics', function (Blueprint $table) {
            $table->dropForeign(['id_song']);
            $table->dropForeign(['contributed_by']);
            $table->dropForeign(['approved_by']);
        });
    }
}
