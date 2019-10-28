<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserRolesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
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
}
