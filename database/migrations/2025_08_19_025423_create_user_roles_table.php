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
        Schema::create('user_roles', function (Blueprint $table) {
            $table->bigIncrements('id')->comment('Primary key - User role assignment ID');
            $table->unsignedBigInteger('role_id')->comment('Foreign key - Reference to role table');
            $table->unsignedBigInteger('user_id')->comment('Foreign key - Reference to faculty_users table');
            $table->unsignedBigInteger('created_by')->comment('User ID who created this record');
            $table->unsignedBigInteger('modified_by')->nullable()->comment('User ID who last modified this record');
            $table->timestamps();

            // Unique constraint to prevent assigning same role twice to same user
            $table->unique(['user_id', 'role_id'], 'unique_user_role');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_roles');
    }
};
