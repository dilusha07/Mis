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
        Schema::create('modules', function (Blueprint $table) {
            $table->bigIncrements('id')->comment('Primary key - Module record ID');
            $table->string('module_name');
            $table->string('module_code')->unique();
            $table->json('module_details')->nullable();
            $table->integer('credits')->comment('Number of credits');
            $table->enum('semester', [
                'Semester 0', 'Semester 1', 'Semester 2', 'Semester 3',
                'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7',
                'Semester 8', 'Semester 9'
            ])->comment('Semester in which the module is offered');
            $table->enum('module_type', ['Core', 'General Elective', 'Technical Elective', 'Common Core'])->comment('Type of module');
            $table->json('allowed_stream')->comment('Programs or groups the module is allowed for');
            $table->unsignedBigInteger('curriculum_id')->comment('Foreign key - Reference to curriculum table');
            $table->unsignedInteger('department_id')->comment('Foreign key - Reference to departments table');
            $table->unsignedBigInteger('created_by')->comment('User ID who created this module');
            $table->unsignedBigInteger('modified_by')->nullable()->comment('User ID who last modified this module');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('modules');
    }
};
