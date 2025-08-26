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
            //$table->json('module_prerequisites_id')->comment('Foreign key - Reference to of the module_prerequisites table');
            $table->unsignedBigInteger('module_coordinator_id')->comment('Foreign key - Reference to the employee table (primary role-lecture)');
            $table->unsignedBigInteger('lecture_id')->comment('Foreign key - Reference to the employee table (primary role - lecture)');
            $table->unsignedBigInteger('batch_status_id')->comment('Foreign key - Reference to of the batch_status table');
            $table->enum('gpa_applicability', ['GPA', 'NON_GPA', 'GPA or NON_GPA'])->comment('Whether the module contributes to GPA');
            $table->enum('offering_type', ['PROPER', 'REPEAT', 'BOTH'])
            ->comment('Type of module offering for the student: Proper, Repeat, or Both');
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
