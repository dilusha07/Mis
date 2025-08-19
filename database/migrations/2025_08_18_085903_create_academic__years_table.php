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
        Schema::create('academic_years', function (Blueprint $table) {
            $table->bigIncrements('id')->comment('Primary Key - Academic year record ID');
            $table->string('academic_year', 191)->comment('Academic year name');
            $table->dateTime('year_begin')->comment('Starting date of academic year');
            $table->dateTime('year_end')->comment('Ending date of academic year');
            $table->integer('status')->default(1)->comment('0 = Inactive, 1 = Active, 2 = Old');
            $table->unsignedBigInteger('curriculum_id')->comment('Foreign Key - Reference to curriculum table');
            $table->unsignedBigInteger('created_by')->comment('UserID who created this record');
            $table->unsignedBigInteger('modified_by')->nullable()->comment('User ID who last modified this record');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('academic__years');
    }
};
