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
        Schema::create('students', function (Blueprint $table) {
            $table->bigIncrements('id')->comment('Primary key - Student record ID');
            $table->string('student_id')->unique()->comment('Student Number');
            $table->unsignedBigInteger('user_id')->comment('Foreign key referencing faculty_users(user_id)');
            $table->string('personal_email')->unique()->comment('Student personal email address');
            $table->string('university_email')->unique()->comment('Student university email address');
            $table->unsignedBigInteger('batch_id')->comment('Foreign key referencing batch(id)');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('full_name');
            $table->unsignedBigInteger('advisor_id')->comment('Foreign key referencing academic_advisor(id)');
            $table->enum('student_status', [
                'Inactive',
                'Active',
                'Graduated',
                'Suspended',
                'Elevated',
                'Withdrawn',
                'Terminated'
            ])->default('Active')->comment('Student status');
            $table->unsignedBigInteger('created_by')->comment('User ID who created this record');
            $table->unsignedBigInteger('modified_by')->nullable()->comment('User ID who last modified this record');
            $table->timestamps();
            $table->softDeletes()->comment('Soft delete timestamp');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
