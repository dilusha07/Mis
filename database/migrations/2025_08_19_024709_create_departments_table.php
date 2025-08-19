<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('departments', function (Blueprint $table) {
            $table->increments('id')->comment('Primary key - Department record ID');
            $table->string('dept_name', 100)->unique()->comment('Department name');
            $table->string('dept_code', 100)->unique()->comment('Department code');
             $table->enum('dept_type', ['Departments', 'Administrative', 'Units & Centers'])
                  ->comment('Department type: Departments, Administrative, Units & Centers')
                    ->default('Departments');
            $table->text('dept_desc')->nullable()->comment('Description of the department');
            $table->unsignedBigInteger('created_by')->comment('User ID who created this record');
            $table->unsignedBigInteger('modified_by')->nullable()->comment('User ID who last modified this record');
            $table->timestamps();
        });

         // Insert default departments records
        DB::table('departments')->insert([
            ['dept_name' => 'The Department of Civil and Environmental Engineering', 'dept_code' => 'CEE', 'dept_type' => 'Departments', 'dept_desc' => 'The Department offers B.Sc.Eng (Hons) degree specializing in Civil and Environmental Engineering.', 'created_by' => 1, 'modified_by' => null, 'created_at' => now(), 'updated_at' => now()],
            ['dept_name' => 'The Department of Electricals and Information Engineering', 'dept_code' => 'EIE', 'dept_type' => 'Departments', 'dept_desc' => 'Department of Electricals and Information Engineering.', 'created_by' => 1, 'modified_by' => null, 'created_at' => now(), 'updated_at' => now()],
            ['dept_name' => 'Department of Mechanical and Manufacturing Engineering', 'dept_code' => 'MME', 'dept_type' => 'Departments', 'dept_desc' => 'Department of Mechanical and Manufacturing Engineering.', 'created_by' => 1, 'modified_by' => null, 'created_at' => now(), 'updated_at' => now()],
            ['dept_name' => 'Department of Marine Engineering Naval Architecture', 'dept_code' => 'MENA', 'dept_type' => 'Departments', 'dept_desc' => 'Department of Marine Engineering and Naval Architecture.', 'created_by' => 1, 'modified_by' => null, 'created_at' => now(), 'updated_at' => now()],
            ['dept_name' => 'Department of Interdisciplinary Studies', 'dept_code' => 'IS', 'dept_type' => 'Departments', 'dept_desc' => 'Department of Interdisciplinary Studies.', 'created_by' => 1, 'modified_by' => null, 'created_at' => now(), 'updated_at' => now()],
            ['dept_name' => 'Administration', 'dept_code' => 'ADM', 'dept_type' => 'Administrative', 'dept_desc' => 'Administration department.', 'created_by' => 1, 'modified_by' => null, 'created_at' => now(), 'updated_at' => now()],
            ['dept_name' => 'Examination', 'dept_code' => 'EXM', 'dept_type' => 'Administrative', 'dept_desc' => 'Examination department.', 'created_by' => 1, 'modified_by' => null, 'created_at' => now(), 'updated_at' => now()],
            ['dept_name' => 'Engineering Education Center', 'dept_code' => 'EEC', 'dept_type' => 'Units & Centres', 'dept_desc' => 'Engineering Education Center.', 'created_by' => 1, 'modified_by' => null, 'created_at' => now(), 'updated_at' => now()],
            ['dept_name' => 'Library', 'dept_code' => 'LIB', 'dept_type' => 'Units & Centres', 'dept_desc' => 'Library of the Faculty of Engineering.', 'created_by' => 1, 'modified_by' => null, 'created_at' => now(), 'updated_at' => now()],
            ['dept_name' => 'Drawing Office', 'dept_code' => 'DO', 'dept_type' => 'Units & Centres', 'dept_desc' => 'Drawing Office.', 'created_by' => 1, 'modified_by' => null, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('departments');
    }
};
