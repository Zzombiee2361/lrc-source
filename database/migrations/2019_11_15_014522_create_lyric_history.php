<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLyricHistory extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('lyric_history', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->char('id_song', 36);
            $table->unsignedSmallInteger('revision');
            $table->unsignedBigInteger('contributed_by');
            $table->unsignedBigInteger('approved_by')->nullable();
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
        Schema::dropIfExists('lyric_history');
    }
}
