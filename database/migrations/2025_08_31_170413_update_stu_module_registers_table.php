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
            // Remove unwanted columns
            $table->dropColumn(['attempts', 'module_reg_type']);

            // Change datatype of reg_status
            $table->enum('reg_status', ['pending', 'registered'])->comment('Registration status')->change();

            // unique constraint to avoid duplicate registration for the same module
            $table->unique(['student_id', 'module_id']);
        });
    


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stu_module_registers', function (Blueprint $table) {
             // Rollback: add columns back
            $table->unsignedTinyInteger('attempts')->comment('Number of attempts get for this module');
            $table->enum('module_reg_type', ['proper', 'repeat'])->comment('Module registration type');

            // rollback reg_status to unsignedBigInteger
            $table->unsignedBigInteger('reg_status')->comment('Registration status')->change();
    
        });
    }
};
