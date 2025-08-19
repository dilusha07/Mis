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
         {
        // roles
        Schema::table('roles', function (Blueprint $table) {
            $table->foreign('created_by')->references('user_id')->on('faculty_users');
            $table->foreign('modified_by')->references('user_id')->on('faculty_users');
        });

        // employee_categories
        Schema::table('employee_categories', function (Blueprint $table) {
            $table->foreign('created_by')->references('user_id')->on('faculty_users');
        });

        // students
        Schema::table('students', function (Blueprint $table) {
            $table->foreign('batch_id')->references('id')->on('batches');
            $table->foreign('user_id')->references('user_id')->on('faculty_users');
            $table->foreign('advisor_id')->references('user_id')->on('employees');
            $table->foreign('created_by')->references('user_id')->on('faculty_users');
            $table->foreign('modified_by')->references('user_id')->on('faculty_users');
        });

        // student_details
        Schema::table('student_details', function (Blueprint $table) {
            $table->foreign('student_id')->references('student_id')->on('students');
            $table->foreign('created_by')->references('user_id')->on('faculty_users');
            $table->foreign('modified_by')->references('user_id')->on('faculty_users');
        });

        // employee
        Schema::table('employees', function (Blueprint $table) {
            $table->foreign('user_id')->references('user_id')->on('faculty_users');
            $table->foreign('department_id')->references('id')->on('departments');
            $table->foreign('category_id')->references('id')->on('employee_categories');
            $table->foreign('created_by')->references('user_id')->on('faculty_users');
            $table->foreign('modified_by')->references('user_id')->on('faculty_users');
        });

        //  batch_status
        Schema::table('batch_statuses', function (Blueprint $table) {
            $table->foreign('batch_id')->references('id')->on('batches');
            $table->foreign('acc_year_id')->references('id')->on('academic_years');
            $table->foreign('created_by')->references('user_id')->on('faculty_users');
            $table->foreign('modified_by')->references('user_id')->on('faculty_users');
        });

        //  batch_sem_modules
        Schema::table('batch_sem_modules', function (Blueprint $table) {
            $table->foreign('module_coordinator_id')->references('user_id')->on('employees');
            $table->foreign('lecture_id')->references('user_id')->on('employees');
            $table->foreign('module_id')->references('id')->on('module');
            $table->foreign('module_prerequisites_id')->references('id')->on('module_prerequisites');
            $table->foreign('batch_status_id')->references('id')->on('batch_statuses');
            $table->foreign('created_by')->references('user_id')->on('faculty_users');
            $table->foreign('modified_by')->references('user_id')->on('faculty_users');
        });

        //  permissions
        Schema::table('permissions', function (Blueprint $table) {
            $table->foreign('created_by')->references('user_id')->on('faculty_users');
            $table->foreign('modified_by')->references('user_id')->on('faculty_users');
        });

        //  role_permissions
        Schema::table('role_permissions', function (Blueprint $table) {
            $table->foreign('role_id')->references('id')->on('role');
            $table->foreign('permission_id')->references('id')->on('permissions');
            $table->foreign('created_by')->references('user_id')->on('faculty_users');
            $table->foreign('modified_by')->references('user_id')->on('faculty_users');
        });

        //  academic_advisor
        Schema::table('academic_advisors', function (Blueprint $table) {
            $table->foreign('student_id')->references('student_id')->on('students');
            $table->foreign('advisor_id')->references('user_id')->on('employees');
            $table->foreign('created_by')->references('user_id')->on('faculty_users');
            $table->foreign('modified_by')->references('user_id')->on('faculty_users');
        });

        //  student_statuses
        Schema::table('student_statuses', function (Blueprint $table) {
            $table->foreign('student_id')->references('student_id')->on('students');
            $table->foreign('batch_id')->references('id')->on('batch');
            $table->foreign('acc_year_id')->references('id')->on('academic_years');
            $table->foreign('created_by')->references('user_id')->on('faculty_users');
            $table->foreign('modified_by')->references('user_id')->on('faculty_users');
        });

        //  user_permissions
        Schema::table('user_permissions', function (Blueprint $table) {
            $table->foreign('user_id')->references('user_id')->on('faculty_users');
            $table->foreign('permission_id')->references('id')->on('permissions');
            $table->foreign('created_by')->references('user_id')->on('faculty_users');
            $table->foreign('modified_by')->references('user_id')->on('faculty_users');
        });

        //  user_roles
        Schema::table('user_roles', function (Blueprint $table) {
            $table->foreign('role_id')->references('id')->on('role');
            $table->foreign('user_id')->references('user_id')->on('faculty_users');
            $table->foreign('created_by')->references('user_id')->on('faculty_users');
            $table->foreign('modified_by')->references('user_id')->on('faculty_users');
        });

        //  module
        Schema::table('modules', function (Blueprint $table) {
            $table->foreign('created_by')->references('user_id')->on('faculty_users');
            $table->foreign('modified_by')->references('user_id')->on('faculty_users');
        });

        //  departments
        Schema::table('departments', function (Blueprint $table) {
            $table->foreign('created_by')->references('user_id')->on('faculty_users');
            $table->foreign('modified_by')->references('user_id')->on('faculty_users');
        });

        //  batch
        Schema::table('batches', function (Blueprint $table) {
            $table->foreign('curriculum_id')->references('id')->on('curriculums');
            $table->foreign('created_by')->references('user_id')->on('faculty_users');
            $table->foreign('modified_by')->references('user_id')->on('faculty_users');
        });

        //  curriculum
        Schema::table('curriculums', function (Blueprint $table) {
            $table->foreign('created_by')->references('user_id')->on('faculty_users');
            $table->foreign('modified_by')->references('user_id')->on('faculty_users');
        });

        //  academic_year
        Schema::table('academic_years', function (Blueprint $table) {
            $table->foreign('curriculum_id')->references('id')->on('curriculums');
            $table->foreign('created_by')->references('user_id')->on('faculty_users');
            $table->foreign('modified_by')->references('user_id')->on('faculty_users');
        });

        //  stu_module_register
        Schema::table('stu_module_registers', function (Blueprint $table) {
            $table->foreign('student_id')->references('student_id')->on('students');
            $table->foreign('batch_sem_module_id')->references('id')->on('batch_sem_modules');
            $table->foreign('module_id')->references('id')->on('modules');
            $table->foreign('created_by')->references('user_id')->on('faculty_users');
            $table->foreign('modified_by')->references('user_id')->on('faculty_users');
        });

        //  module_prerequisites
        Schema::table('module_prerequisites', function (Blueprint $table) {
            $table->foreign('module_id')->references('id')->on('modules');
            $table->foreign('pre_module_id')->references('id')->on('modules');
            $table->foreign('curriculum_id')->references('id')->on('curriculums');
            $table->foreign('created_by')->references('user_id')->on('faculty_users');
            $table->foreign('modified_by')->references('user_id')->on('faculty_users');
        });

        //  exam_admission
        Schema::table('exam_admissions', function (Blueprint $table) {
            $table->foreign('batch_sem_module_id')->references('id')->on('batch_sem_modules');
            $table->foreign('created_by')->references('user_id')->on('faculty_users');
            $table->foreign('modified_by')->references('user_id')->on('faculty_users');
        });

        // employee_corework
        Schema::table('employee_core_works', function (Blueprint $table) {
            $table->foreign('employee_id')->references('id')->on('employees');
            $table->foreign('department_id')->references('id')->on('departments');
            $table->foreign('created_by')->references('user_id')->on('faculty_users');
            $table->foreign('modified_by')->references('user_id')->on('faculty_users');
        });
    }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {

        Schema::table('employee_core_works', function (Blueprint $table) {
            $table->dropForeign(['employee_id']);
            $table->dropForeign(['department_id']);
            $table->dropForeign(['created_by']);
            $table->dropForeign(['modified_by']);
        });

        Schema::table('exam_admissions', function (Blueprint $table) {
            $table->dropForeign(['batch_sem_module_id']);
            $table->dropForeign(['created_by']);
            $table->dropForeign(['modified_by']);
        });

        Schema::table('module_prerequisites', function (Blueprint $table) {
            $table->dropForeign(['module_id']);
            $table->dropForeign(['pre_module_id']);
            $table->dropForeign(['curriculum_id']);
            $table->dropForeign(['created_by']);
            $table->dropForeign(['modified_by']);
        });

        Schema::table('stu_module_registers', function (Blueprint $table) {
            $table->dropForeign(['student_id']);
            $table->dropForeign(['batch_sem_module_id']);
            $table->dropForeign(['module_id']);
            $table->dropForeign(['created_by']);
            $table->dropForeign(['modified_by']);
        });

        Schema::table('academic_years', function (Blueprint $table) {
            $table->dropForeign(['curriculum_id']);
            $table->dropForeign(['created_by']);
            $table->dropForeign(['modified_by']);
        });

        Schema::table('curriculums', function (Blueprint $table) {
            $table->dropForeign(['created_by']);
            $table->dropForeign(['modified_by']);
        });

        Schema::table('batches', function (Blueprint $table) {
            $table->dropForeign(['curriculum_id']);
            $table->dropForeign(['created_by']);
            $table->dropForeign(['modified_by']);
        });

        Schema::table('departments', function (Blueprint $table) {
            $table->dropForeign(['created_by']);
            $table->dropForeign(['modified_by']);
        });

        Schema::table('modules', function (Blueprint $table) {
            $table->dropForeign(['created_by']);
            $table->dropForeign(['modified_by']);
        });

        Schema::table('user_roles', function (Blueprint $table) {
            $table->dropForeign(['role_id']);
            $table->dropForeign(['user_id']);
            $table->dropForeign(['created_by']);
            $table->dropForeign(['modified_by']);
        });

        Schema::table('user_permissions', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['permission_id']);
            $table->dropForeign(['created_by']);
            $table->dropForeign(['modified_by']);
        });

        Schema::table('batch_statuses', function (Blueprint $table) {
            $table->dropForeign(['student_id']);
            $table->dropForeign(['batch_id']);
            $table->dropForeign(['acc_year_id']);
            $table->dropForeign(['created_by']);
            $table->dropForeign(['modified_by']);
        });

        Schema::table('academic_advisors', function (Blueprint $table) {
            $table->dropForeign(['student_id']);
            $table->dropForeign(['advisor_id']);
            $table->dropForeign(['created_by']);
            $table->dropForeign(['modified_by']);
        });

        Schema::table('role_permissions', function (Blueprint $table) {
            $table->dropForeign(['role_id']);
            $table->dropForeign(['permission_id']);
            $table->dropForeign(['created_by']);
            $table->dropForeign(['modified_by']);
        });

        Schema::table('permissions', function (Blueprint $table) {
            $table->dropForeign(['created_by']);
            $table->dropForeign(['modified_by']);
        });

        Schema::table('batch_sem_modules', function (Blueprint $table) {
            $table->dropForeign(['module_coordinator_id']);
            $table->dropForeign(['lecture_id']);
            $table->dropForeign(['module_id']);
            $table->dropForeign(['module_prerequisites_id']);
            $table->dropForeign(['batch_status_id']);
            $table->dropForeign(['created_by']);
            $table->dropForeign(['modified_by']);
        });

        Schema::table('batch_statuses', function (Blueprint $table) {
            $table->dropForeign(['batch_id']);
            $table->dropForeign(['acc_year_id']);
            $table->dropForeign(['created_by']);
            $table->dropForeign(['modified_by']);
        });

        // employee
        Schema::table('employees', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['department_id']);
            $table->dropForeign(['category_id']);
            $table->dropForeign(['created_by']);
            $table->dropForeign(['modified_by']);
        });

        // student_details
        Schema::table('student_details', function (Blueprint $table) {
            $table->dropForeign(['student_id']);
            $table->dropForeign(['created_by']);
            $table->dropForeign(['modified_by']);
        });

        // students
        Schema::table('students', function (Blueprint $table) {
            $table->dropForeign(['batch_id']);
            $table->dropForeign(['user_id']);
            $table->dropForeign(['advisor_id']);
            $table->dropForeign(['created_by']);
            $table->dropForeign(['modified_by']);
        });

        Schema::table('employee_categories', function (Blueprint $table) {
            $table->dropForeign(['created_by']);
        });

        Schema::table('roles', function (Blueprint $table) {
            $table->dropForeign(['created_by']);
            $table->dropForeign(['modified_by']);
        });
    }
};
