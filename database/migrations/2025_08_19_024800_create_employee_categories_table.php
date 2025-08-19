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
        Schema::create('employee_categories', function (Blueprint $table) {
            $table->increments('id')->comment('Primary key - Employee category record ID');
            $table->string('category', 191)->unique()->comment('name of the employee category');
            $table->unsignedBigInteger('created_by')->comment('User ID who created this record');
            $table->timestamps();
        });

         // Insert default data
        DB::table('employee_categories')->insert([
            ['id' => 1, 'category' => 'Academic', 'created_by' => 1, 'created_at' => now(), 'updated_at' => null],
            ['id' => 2, 'category' => 'Academic Support', 'created_by' => 1, 'created_at' => now(), 'updated_at' => null],
            ['id' => 3, 'category' => 'Non Academic', 'created_by' => 1, 'created_at' => now(), 'updated_at' => null],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_categories');
    }
};
