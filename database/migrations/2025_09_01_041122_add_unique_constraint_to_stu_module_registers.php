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
        Schema::table('stu_module_registers', function (Blueprint $table) {
             // Add unique constraint
            $table->unique(['student_id', 'module_id'], 'stu_module_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stu_module_registers', function (Blueprint $table) {
            //
        });
    }
};
