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
            $table->unsignedBigInteger('module_id')->index()->comment('Foreign key - Reference to module table');
            $table->unsignedBigInteger('pre_module_id')->index()->comment('Foreign key - Reference to prerequisite_module table');
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
