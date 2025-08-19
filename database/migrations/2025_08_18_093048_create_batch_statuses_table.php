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
        Schema::create('batch_statuses', function (Blueprint $table) {
            $table->bigIncrements('id')->comment('Primary key - Batch status record ID');
            $table->unsignedBigInteger('batch_id')->comment('Foreign key - Reference to of the batch table');
            $table->enum('degree_year', [
                '1st Year', '2nd Year', '3rd Year', '4th Year'
            ])->comment('Current degree year of the batch');
            $table->enum('semester', [
                'Semester 0', 'Semester 1', 'Semester 2', 'Semester 3', 'Semester 4',
                'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8', 'Semester 9'
            ])->comment('Current semester of the batch');
            $table->unsignedInteger('semester_order')->comment('Order of semesters in the batch');
            $table->unsignedBigInteger('acc_year_id')->comment('Foreign key - reference to Academic year table');
            $table->tinyInteger('status')->default(1)->comment('0 = Finished, 1 = Active');
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
        Schema::dropIfExists('batch_statuses');
    }
};
