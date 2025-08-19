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
        Schema::create('batch_sem_modules', function (Blueprint $table) {
            $table->bigIncrements('id')->comment('Primary key - Batch semester module record ID');
            $table->unsignedBigInteger('module_id')->comment('Foreign key - Reference to of the module table');
            $table->unsignedBigInteger('module_prerequisites_id')->comment('Foreign key - Reference to of the module_prerequisites table');
            $table->unsignedBigInteger('module_coordinator_id')->comment('Foreign key - Reference to the employee table (primary role-lecture)');
            $table->unsignedBigInteger('lecture_id')->comment('Foreign key - Reference to the employee table (primary role - lecture)');
            $table->unsignedBigInteger('batch_status_id')->comment('Foreign key - Reference to of the batch_status table');
            $table->enum('semester', [
                'Semester 0', 'Semester 1', 'Semester 2', 'Semester 3',
                'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7',
                'Semester 8', 'Semester 9'
            ])->comment('Semester in which the module is offered');
            $table->enum('module_type', ['Core', 'General Elective', 'Technical Elective', 'Common Core'])->comment('Type of module');
            $table->enum('gpa_applicability', ['GPA', 'NON_GPA', 'GPA or NON_GPA'])->comment('Whether the module contributes to GPA');
            $table->string('allowed_for')->comment('Programs or groups the module is allowed for');
            $table->unsignedBigInteger('created_by')->comment('User ID who created this record');
            $table->unsignedBigInteger('modified_by')->nullable()->comment('User ID who last modified this record');
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('batch_sem_modules');
    }
};
