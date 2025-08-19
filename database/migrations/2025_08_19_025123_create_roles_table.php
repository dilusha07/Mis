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
        Schema::create('roles', function (Blueprint $table) {
            $table->bigIncrements('id')->comment('Primary key - Role record ID');
            $table->string('role_name', 100);
            $table->text('role_desc')->nullable()->comment('Description of the role');
            $table->unsignedBigInteger('created_by')->comment('User ID who created this record');
            $table->unsignedBigInteger('modified_by')->nullable()->comment('User ID who last modified this record');
            $table->timestamps();
        });

        // Insert default role records
        DB::table('roles')->insert([
            ['id' => 1,  'role_name' => 'root', 'role_desc' => 'Super user for the System', 'created_by' => 1, 'created_at' => now(), 'modified_by' => null, 'updated_at' => null],
            ['id' => 2,  'role_name' => 'admin', 'role_desc' => 'Administrator', 'created_by' => 1, 'created_at' => now(), 'modified_by' => null, 'updated_at' => null],
            ['id' => 3, 'role_name' => 'foeng_student_2024_2025', 'role_desc' => 'Students of FoENG for Academic year 2024/2025', 'created_by' => 1, 'created_at' => now(), 'modified_by' => null, 'updated_at' => null],
            ['id' => 4, 'role_name' => 'foeng_student_2023_2024', 'role_desc' => 'Students of FoENG for Academic year 2023/2024', 'created_by' => 1, 'created_at' => now(), 'modified_by' => null, 'updated_at' => null],
            ['id' => 5,  'role_name' => 'dean', 'role_desc' => 'Dean of the Faculty', 'created_by' => 1, 'created_at' => now(), 'modified_by' => null, 'updated_at' => null],
            ['id' => 6,  'role_name' => 'dept_head', 'role_desc' => 'Head of the department', 'created_by' => 1, 'created_at' => now(), 'modified_by' => null, 'updated_at' => null],
            ['id' => 7,  'role_name' => 'senior_lecturer', 'role_desc' => 'Senior Lecturer', 'created_by' => 1, 'created_at' => now(), 'modified_by' => null, 'updated_at' => null],
            ['id' => 8,  'role_name' => 'lecturer', 'role_desc' => 'Lecturer', 'created_by' => 1, 'created_at' => now(), 'modified_by' => null, 'updated_at' => null],
            ['id' => 9,  'role_name' => 'prob_lecturer', 'role_desc' => 'Lecturer Probationary', 'created_by' => 1, 'created_at' => now(), 'modified_by' => null, 'updated_at' => null],
            ['id' => 10,  'role_name' => 'instructor', 'role_desc' => 'Instructor', 'created_by' => 1, 'created_at' => now(), 'modified_by' => null, 'updated_at' => null],
            ['id' => 11,  'role_name' => 'system_analyst', 'role_desc' => 'Programmer cum Systems Analyst', 'created_by' => 1, 'created_at' => now(), 'modified_by' => null, 'updated_at' => null],
            ['id' => 12, 'role_name' => 'deputy_registrar', 'role_desc' => 'Deputy Registrar', 'created_by' => 1, 'created_at' => now(), 'modified_by' => null, 'updated_at' => null],
            ['id' => 13, 'role_name' => 'management_assistant', 'role_desc' => 'Management Assistant', 'created_by' => 1, 'created_at' => now(), 'modified_by' => null, 'updated_at' => null],
            ['id' => 14, 'role_name' => 'system_user', 'role_desc' => 'Users with selected admin privilages', 'created_by' => 1, 'created_at' => now(), 'modified_by' => null, 'updated_at' => null],
            ['id' => 15, 'role_name' => 'tech_officer', 'role_desc' => 'Technical Officer', 'created_by' => 1, 'created_at' => now(), 'modified_by' => null, 'updated_at' => null],
            ['id' => 16, 'role_name' => 'work_aide', 'role_desc' => 'Work Aide', 'created_by' => 1, 'created_at' => now(), 'modified_by' => null, 'updated_at' => null],
            ['id' => 17, 'role_name' => 'data_operator', 'role_desc' => 'Data Entry Operator', 'created_by' => 1, 'created_at' => now(), 'modified_by' => null, 'updated_at' => null],
            ['id' => 18, 'role_name' => 'project_assistant', 'role_desc' => 'Project Administrative Assistant', 'created_by' => 1, 'created_at' => now(), 'modified_by' => null, 'updated_at' => null],
            ['id' => 19, 'role_name' => 'lab_attendant', 'role_desc' => 'Lab Attendant', 'created_by' => 1, 'created_at' => now(), 'modified_by' => null, 'updated_at' => null],
            ['id' => 20, 'role_name' => 'itcommember', 'role_desc' => 'Member for the IT Committee from each department', 'created_by' => 1, 'created_at' => now(), 'modified_by' => null, 'updated_at' => null],
            ['id' => 21, 'role_name' => 'dr', 'role_desc' => 'Deputy Registar', 'created_by' => 1, 'created_at' => now(), 'modified_by' => null, 'updated_at' => null],
            ['id' => 22, 'role_name' => 'management_assistant_courseunit', 'role_desc' => 'Management Assistant for Course Unit', 'created_by' => 1, 'created_at' => now(), 'modified_by' => null, 'updated_at' => null],
            ['id' => 23, 'role_name' => 'senior_assistant_registrar', 'role_desc' => 'Senior Assistant Registrar', 'created_by' => 1, 'created_at' => now(), 'modified_by' => null, 'updated_at' => null],
            ['id' => 24, 'role_name' => 'management_assistant_exam', 'role_desc' => 'Management assistant for examination works and marking', 'created_by' => 1, 'created_at' => now(), 'modified_by' => null, 'updated_at' => null],
            ['id' => 25, 'role_name' => 'demo', 'role_desc' => 'Temporary Demostrator', 'created_by' => 1, 'created_at' => now(), 'modified_by' => null, 'updated_at' => null],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('roles');
    }
};
