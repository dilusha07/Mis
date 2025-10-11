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
        Schema::create('stu_module_registers', function (Blueprint $table) {
            $table->bigIncrements('id')->comment('Primary key - student Module registration record ID');
            $table->string('student_id')->unique()->comment('Foreign key - Referring to student table');
            $table->unsignedBigInteger('batch_sem_module_id')->comment('Foreign key - Reference to batch_sem_module table');
            $table->unsignedBigInteger('module_id')->comment('Foreign key - Reference to modules table');
            $table->enum('module_reg_type', ['proper', 'repeat'])->comment('Module registration type');
            $table->enum('reg_status', ['pending', 'active'])->comment('Registration status');
            $table->unsignedTinyInteger('attempts')->comment('Number of attempts get for this module');
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
        Schema::dropIfExists('stu_module_registers');
    }
};
