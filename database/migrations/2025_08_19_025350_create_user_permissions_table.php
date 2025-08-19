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
        Schema::create('user_permissions', function (Blueprint $table) {
            $table->bigIncrements('id')->comment('Primary key - User permission record ID');
            $table->unsignedBigInteger('user_id')->comment('Foreign key - Reference to faculty_users table');
            $table->unsignedBigInteger('permission_id')->comment('Foreign key - Reference to permissions table');
            $table->integer('source')->default(1)->comment('Permission source: 0 = Fixed/Individual, 1 = Role');
            $table->unsignedBigInteger('created_by')->comment('User ID who created this record');
            $table->unsignedBigInteger('modified_by')->nullable()->comment('User ID who last modified this record');
            $table->timestamps();

            // Unique constraint to prevent duplicate overrides
            $table->unique(['user_id', 'permission_id'], 'unique_user_permission');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_permissions');
    }
};
