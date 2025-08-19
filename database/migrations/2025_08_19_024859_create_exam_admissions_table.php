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
        Schema::create('exam_admissions', function (Blueprint $table) {
            $table->bigIncrements('id')->comment('Primary key - Exam admission record ID');
            $table->unsignedBigInteger('batch_sem_module_id')->comment('Foreign key - Reference to batch_sem_modules table');
            $table->dateTime('exam_date')->comment('Date of the exam');
            $table->dateTime('start_time')->comment('Exam start time');
            $table->dateTime('end_time')->comment('Exam end time');
            $table->string('venue')->comment('Exam venue / hall');
            $table->string('student_group')->comment('Student group linked with the venue');
            $table->unsignedBigInteger('created_by')->comment('User ID who created this record');
            $table->unsignedBigInteger('modified_by')->comment('User ID who last modified this record');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exam_admissions');
    }
};
