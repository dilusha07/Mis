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
        Schema::create('academic_advisors', function (Blueprint $table) {
            $table->bigIncrements('id')->comment('Assignment id');
            $table->string('student_id')->unique()->comment('Foreign key - Reference to student id');
            $table->unsignedBigInteger('advisor_id')->comment('Foreign key - Reference to employee table');
            $table->unsignedBigInteger('created_by')->comment('User ID who created this record');
            $table->unsignedBigInteger('modified_by')->nullable()->comment('User ID who last modified this record');
            // $table->timestamp('assigned_date')->comment('Advisor assigned date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('academic_advisors');
    }
};
