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
        Schema::create('employee_core_works', function (Blueprint $table) {
            $table->bigIncrements('id')->comment('Primary key - Employee Core Work record ID');
            $table->unsignedBigInteger('employee_id')->comment('Foreign key - Reference to the employee table');
            $table->unsignedInteger('department_id')->comment('Foreign key - Reference to departments table');
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
        Schema::dropIfExists('employee_core_works');
    }
};
