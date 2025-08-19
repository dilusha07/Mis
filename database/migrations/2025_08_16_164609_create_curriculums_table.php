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
        Schema::create('curriculums', function (Blueprint $table) {
            $table->bigIncrements('id')->comment('Primary key - Curriculum ID');
            $table->string('curriculum_code', 50)->comment('Unique code for the curriculum');
            $table->string('curriculum_name', 150)->comment('Name of the curriculum');
            $table->dateTime('start_date')->comment('Curriculum start date');
            $table->integer('start_batch_from')->comment('Starting batch year applicable for this curriculum');
            $table->integer('end_batch_to')->nullable()->comment('Ending batch year applicable for this curriculum');
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
        Schema::dropIfExists('curriculums');
    }
};
