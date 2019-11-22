<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRejectedLyrics extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rejected_lyrics', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('id_history')->comment('Parent history');
            $table->unsignedBigInteger('contributed_by');
            $table->unsignedBigInteger('rejected_by');
            $table->text('lyric');
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rejected_lyrics');
    }
}
