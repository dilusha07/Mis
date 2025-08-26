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
        Schema::create('module_prerequisites', function (Blueprint $table) {
            $table->bigIncrements('id')->comment('Primary key - Module prerequisite record ID');
            $table->unsignedBigInteger('module_id')->index()->comment('Foreign key - Reference to modules table');
            // Store prerequisite module IDs as a JSON array 
            $table->json('pre_module_ids')->nullable()->comment('List of prerequisite module IDs for this module');
            $table->unsignedBigInteger('curriculum_id')->comment('Foreign key - Reference to curriculum table');
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
        Schema::dropIfExists('module_prerequisites');
    }
};
