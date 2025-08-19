<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CurriculumController;
use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\ModuleController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('curriculums', CurriculumController::class);
    Route::resource('modules', ModuleController::class);

    Route::resource('academic-years', AcademicYearController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
