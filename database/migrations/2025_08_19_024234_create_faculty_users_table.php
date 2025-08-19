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
        Schema::create('faculty_users', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->unique()->comment('RUMIS user_id');
            $table->string('user_name')->unique()->comment('RUMIS user_name');
            $table->string('user_email')->unique()->comment('RUMIS user email address');
            $table->enum('user_type', ['Student', 'Employee'])->comment('User type');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('full_name');
            $table->string('gender');
            $table->string('contact_number');
            $table->string('title', 50)->nullable()->comment('Title of the user: Mr., Ms., Miss, Dr.');
            $table->string('NIC')->unique()->comment('National Identity Card number');
            $table->enum('active_status', ['Inactive', 'Active', 'On Leave'])->default('Active')->comment('Active status');
            $table->unsignedBigInteger('created_by')->comment('User ID who created this record');
            $table->unsignedBigInteger('modified_by')->nullable()->comment('User ID who last modified this record');
            $table->timestamps();
            $table->softDeletes()->comment('Soft delete timestamp');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('faculty_users');
    }
};
