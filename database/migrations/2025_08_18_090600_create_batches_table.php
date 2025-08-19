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
        Schema::create('batches', function (Blueprint $table) {
            $table->bigIncrements('id')->comment('Primary key - Batch record ID');
            $table->string('batch_name', 100)->comment('Batch name');
            $table->unsignedBigInteger('curriculum_id')->comment('Foreign key - Reference to curriculum table');
            $table->dateTime('start_date')->comment('Batch start date');
            $table->date('effective_date')->nullable()->comment('Effective date for the batch');
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
        Schema::dropIfExists('batches');
    }
};
