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
        Schema::table('batch_statuses', function (Blueprint $table) {
            // JSON column to track semester history
            if (!Schema::hasColumn('batch_statuses', 'semester_order')) {
                $table->json('semester_order')
                    ->nullable()
                    ->comment('History of semester changes with changed_by and changed_at');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('batch_statuses', function (Blueprint $table) {
            if (Schema::hasColumn('batch_statuses', 'semester_order')) {
                $table->dropColumn('semester_order');
            }
        });
    }
};
