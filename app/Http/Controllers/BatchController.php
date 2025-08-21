<?php

namespace App\Http\Controllers;

use App\Models\Batch;
use App\Models\Curriculum;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\BatchFormRequest;
use Exception;
use Illuminate\Support\Facades\Log;

class BatchController extends Controller
{
    public function index(Request $request)
    {
        $batchesQuery = Batch::with('curriculum');

        if ($request->filled('search')) {
            $search = $request->search;
            $batchesQuery->where('batch_name', 'like', "%{$search}%")
                         ->orWhereHas('curriculum', fn($q) => $q->where('curriculum_name', 'like', "%{$search}%"));
        }

        $batches = $batchesQuery->latest()->paginate($request->perPage ?? 10)->withQueryString();

        $batches->getCollection()->transform(fn($batch) => [
            'id'             => $batch->id,
            'batch_name'     => $batch->batch_name,
            'curriculum'     => $batch->curriculum->curriculum_name,
            'start_date'     => $batch->start_date->format('d M Y'),
            'effective_date' => $batch->effective_date?->format('d M Y'),
            'created_at'     => $batch->created_at->format('d M Y'),
        ]);

        return Inertia::render('batches/index', [
            'batches' => $batches,
            'filters' => $request->only(['search', 'perPage']),
        ]);
    }

    public function create()
    {
        $curriculums = Curriculum::select('id', 'curriculum_name')->get();
        return Inertia::render('batches/batch-form', ['curriculums' => $curriculums]);
    }

    public function store(BatchFormRequest $request)
    {
        try {
            Batch::create(array_merge($request->validated(), ['created_by' => auth()->id()]));
            return redirect()->route('batches.index')->with('success', 'Batch created successfully.');
        } catch (Exception $e) {
            Log::error('Batch creation failed: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Unable to create batch.');
        }
    }

   public function show(Batch $batch)
{
    $curriculums = Curriculum::select('id', 'curriculum_name')->get();

    return Inertia::render('batches/batch-form', [
        'batch' => $batch->load('curriculum'),
        'curriculums' => $curriculums,         
        'isView' => true,
    ]);
}

    public function edit(Batch $batch)
    {
        $curriculums = Curriculum::select('id', 'curriculum_name')->get();
        return Inertia::render('batches/batch-form', ['batch' => $batch, 'curriculums' => $curriculums, 'isEdit' => true]);
    }

    public function update(BatchFormRequest $request, Batch $batch)
    {
        try {
            $batch->update(array_merge($request->validated(), ['modified_by' => auth()->id()]));
            return redirect()->route('batches.index')->with('success', 'Batch updated successfully.');
        } catch (Exception $e) {
            Log::error('Batch update failed: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Unable to update batch.');
        }
    }

    public function destroy(Batch $batch)
    {
        try {
            $batch->delete();
            return redirect()->back()->with('success', 'Batch deleted successfully.');
        } catch (Exception $e) {
            Log::error('Batch deletion failed: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Unable to delete batch.');
        }
    }
}
