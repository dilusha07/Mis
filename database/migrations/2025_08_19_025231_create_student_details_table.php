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
        Schema::create('student_details', function (Blueprint $table) {
            $table->bigIncrements('id')->comment('Primary key - Student details record ID');
            $table->string('student_id')->unique();
            $table->date('birthday')->comment('Date of birth');
            $table->text('parents_details')->nullable()->comment('Details about parents/guardians');
            $table->text('address')->nullable()->comment('Home address of the student');
            $table->enum('marital_status', ['Single', 'Married', 'Divorced'])->nullable()->comment('Marital status');
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
        Schema::dropIfExists('student_details');
    }
};
