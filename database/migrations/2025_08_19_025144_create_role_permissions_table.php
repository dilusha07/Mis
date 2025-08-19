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
        Schema::create('role_permissions', function (Blueprint $table) {
            $table->bigIncrements('id')->comment('Primary key - Role permission record ID');
            $table->unsignedBigInteger('role_id')->index()->comment('Foreign key - Reference to role table');
            $table->unsignedBigInteger('permission_id')->index()->comment('Foreign key - Reference to permissions table');
            $table->unsignedBigInteger('created_by')->comment('User ID who created this record');
            $table->unsignedBigInteger('modified_by')->nullable()->comment('User ID who last modified this record');
            $table->timestamps();

            // Unique constraint to prevent duplicate role-permission pair
            $table->unique(['role_id', 'permission_id'], 'unique_role_permission');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('role_permissions');
    }
};
