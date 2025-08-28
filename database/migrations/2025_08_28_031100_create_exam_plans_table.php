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
        Schema::create('exam_plans', function (Blueprint $table) {
            $table->id();
                $table->unsignedBigInteger('first_examiner_id');
                $table->unsignedBigInteger('second_examiner_id');
                $table->unsignedBigInteger('department_id');
                $table->unsignedBigInteger('module_id');
                $table->json('final_marks')->nullable();
                $table->json('mid_marks')->nullable();
                $table->json('ca_marks')->nullable();
                $table->json('other_marks')->nullable();
                $table->unsignedBigInteger('created_by');
                $table->unsignedBigInteger('edited_by')->nullable();
                $table->timestamps();

                $table->foreign('first_examiner_id')->references('id')->on('employees')->onDelete('cascade');
                $table->foreign('second_examiner_id')->references('id')->on('employees')->onDelete('cascade');
                $table->foreign('department_id')->references('id')->on('departments')->onDelete('cascade');
                $table->foreign('module_id')->references('id')->on('modules')->onDelete('cascade');
                $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
                $table->foreign('edited_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exam_plans');
    }
};
