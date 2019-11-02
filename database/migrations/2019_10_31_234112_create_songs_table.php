<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSongsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('songs', function (Blueprint $table) {
            $table->char('id', 36)->comment('Recording MBID')->primary();
            $table->string('name');
            $table->string('artist');
            $table->char('album_id', 36)->comment('Releases MBID');
            $table->string('album');
            $table->unsignedBigInteger('id_lyric');
            $table->unsignedInteger('view_count');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('songs');
    }
}
