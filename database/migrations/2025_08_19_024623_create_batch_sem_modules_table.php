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


            
            // Core relations
            $table->unsignedBigInteger('module_id')->comment('FK: modules.id');
            $table->unsignedBigInteger('module_prerequisites_id')->nullable()->comment('FK: module_prerequisites.id');
            $table->unsignedBigInteger('module_coordinator_id')->comment('FK: employees.id (primary_role: lecture)');
            $table->unsignedBigInteger('lecture_id')->comment('FK: employees.id (primary_role: lecture)');
            $table->unsignedBigInteger('batch_status_id')->comment('FK: batch_statuses.id');

            // Derived/display fields kept for quick access
            $table->enum('semester', [
                'Semester 0','Semester 1','Semester 2','Semester 3','Semester 4',
                'Semester 5','Semester 6','Semester 7','Semester 8','Semester 9'
            ])->comment('Semester, auto-filled from selected batch status');
            $table->enum('module_type', ['Core', 'General Elective', 'Technical Elective', 'Common Core'])->comment('Type of module');
            $table->string('allowed_for', 255)->comment('Programs/streams allowed (from module.allowed_stream)');

            // Other attributes
            $table->enum('gpa_applicability', ['GPA', 'NON_GPA', 'GPA or NON_GPA'])->comment('Whether the module contributes to GPA');
            $table->enum('offering_type', ['PROPER', 'REPEAT', 'BOTH'])->comment('Type of offering: Proper, Repeat, or Both');

            // Audit
            $table->unsignedBigInteger('created_by')->comment('User ID who created this record');
            $table->unsignedBigInteger('modified_by')->nullable()->comment('User ID who last modified this record');
            $table->timestamps();

            // Indexes
            $table->index('module_id');
            $table->index('module_prerequisites_id');
            $table->index('module_coordinator_id');
            $table->index('lecture_id');
            $table->index('batch_status_id');

            // Foreign keys
            $table->foreign('module_id')->references('id')->on('modules')->onUpdate('cascade');
            $table->foreign('module_prerequisites_id')->references('id')->on('module_prerequisites')->onUpdate('cascade');
            $table->foreign('module_coordinator_id')->references('id')->on('employees')->onUpdate('cascade');
            $table->foreign('lecture_id')->references('id')->on('employees')->onUpdate('cascade');
            $table->foreign('batch_status_id')->references('id')->on('batch_statuses')->onUpdate('cascade');
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
