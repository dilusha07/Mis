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
