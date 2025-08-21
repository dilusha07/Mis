<?php

namespace App\Http\Controllers;

use App\Models\BatchSemModule;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BatchSemModuleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('module-plans/index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(BatchSemModule $batchSemModule)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BatchSemModule $batchSemModule)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, BatchSemModule $batchSemModule)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BatchSemModule $batchSemModule)
    {
        //
    }
}
