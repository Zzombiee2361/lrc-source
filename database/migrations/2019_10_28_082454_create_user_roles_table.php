<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUserRolesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_roles', function (Blueprint $table) {
            $table->tinyIncrements('id');
            $table->string('name');
        });

        $roles = [
            'Unverified',
            'Normal',
            'Reviewer',
            'Admin'
        ];

        foreach ($roles as $role) {
            $data[] = [
                'name' => $role
            ];
        }
        DB::table('user_roles')->insert($data);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_roles');
    }
}
