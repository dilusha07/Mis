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
        Schema::create('employees', function (Blueprint $table) {
            $table->bigIncrements('id')->comment('Primary key - Employee record ID');
            $table->unsignedBigInteger('user_id')->unique()->comment('Foreign key - Reference to faculty_users table');
            $table->unsignedInteger('department_id')->comment('Foreign key - Reference to departments table');
            $table->unsignedInteger('category_id')->nullable()->comment('Foreign key - Reference to employee category table');
            $table->string('designation', 191)->comment('Job designation or position');
            $table->enum('primary_role', [
                'Lecture',
                'Administrative',
                'Non-Academic',
            ])->comment('Primary role of the employee');
            $table->string('personal_email')->unique()->comment('Personal email address of the employee');
            $table->string('university_email')->unique()->comment('Official university email address');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('full_name');
            $table->string('contact_number', 50)->nullable();
            $table->enum('employee_status', [
                'Inactive',
                'Active',
                'On Leave',
                'Suspended',
                'Retired'
            ])->default('Active')->comment('Employee status');
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
        Schema::dropIfExists('employees');
    }
};
