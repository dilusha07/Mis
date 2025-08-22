<?php

namespace App\Http\Controllers;

use App\Models\BatchStatus;
use App\Models\Batch;
use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Exception;
use App\Http\Requests\BatchStatusFormRequest;

class BatchStatusController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = BatchStatus::with(['batch', 'academicYear']);
        $totalCount = $query->count();

        // Filter search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('batch', fn($q) => $q->where('batch_name', 'like', "%{$search}%"))
                  ->orWhere('degree_year', 'like', "%{$search}%")
                  ->orWhere('semester', 'like', "%{$search}%")
                  ->orWhereHas('academicYear', fn($q) => $q->where('academic_year', 'like', "%{$search}%"));
        }

        $filteredCount = $query->count();
        $perPage = (int) ($request->perPage ?? 10);

        if ($perPage === -1) {
            $allStatuses = $query->latest()->get()->map(fn($status) => [
                'id'            => $status->id,
                'batch'         => $status->batch?->batch_name,
                'academic_year' => $status->academicYear?->academic_year,
                'degree_year'   => $status->degree_year,
                'semester'      => $status->semester,
                'status'        => $status->status_text,
                'created_at'    => $status->created_at->format('d M Y'),
            ]);

            $batchStatuses = [
                'data'     => $allStatuses,
                'total'    => $filteredCount,
                'per_page' => $perPage,
                'from'     => 1,
                'to'       => $filteredCount,
                'links'    => [],
            ];
        } else {
            $batchStatuses = $query->latest()->paginate($perPage)->withQueryString();
            $batchStatuses->getCollection()->transform(fn($status) => [
                'id'            => $status->id,
                'batch'         => $status->batch?->batch_name,
                'academic_year' => $status->academicYear?->academic_year,
                'degree_year'   => $status->degree_year,
                'semester'      => $status->semester,
                'status'        => $status->status_text,
                'created_at'    => $status->created_at->format('d M Y'),
            ]);
        }

        return Inertia::render('batch-statuses/index', [
            'batchStatuses' => $batchStatuses,
            'filters'       => $request->only(['search', 'perPage']),
            'totalCount'    => $totalCount,
            'filteredCount' => $filteredCount,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('batch-statuses/batch-status-form', [
            'batches'       => Batch::all(['id', 'batch_name']),
            'academicYears' => AcademicYear::all(['id', 'academic_year']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(BatchStatusFormRequest $request)
    {
        try {
            // Initialize semester_order as an array with current semester
            $semester_order = [
                [
                    'semester'   => $request->semester,
                    'changed_by' => auth()->id(),
                    'changed_at' => now(),
                ]
            ];

            BatchStatus::create(array_merge(
                $request->validated(),
                [
                    'created_by'      => auth()->id(),
                    'semester_order'  => json_encode($semester_order),
                ]
            ));

            return redirect()->route('batch-statuses.index')->with('success', 'Batch status created successfully.');
        } catch (Exception $e) {
            Log::error('Batch status creation failed: ' . $e->getMessage());
            return redirect()->back()->with('error', 'An error occurred while creating batch status.');
        }
    }

    /**
     * Show the form for viewing the resource.
     */
    public function show(BatchStatus $batchStatus)
    {
        return Inertia::render('batch-statuses/batch-status-form', [
            'batchStatus' => $batchStatus->load(['batch', 'academicYear']),
            'batches'       => Batch::all(['id', 'batch_name']),
            'academicYears' => AcademicYear::all(['id', 'academic_year']),
            'isView'      => true,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BatchStatus $batchStatus)
    {
        return Inertia::render('batch-statuses/batch-status-form', [
            'batchStatus'   => $batchStatus->load(['batch', 'academicYear']),
            'batches'       => Batch::all(['id', 'batch_name']),
            'academicYears' => AcademicYear::all(['id', 'academic_year']),
            'isEdit'        => true,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(BatchStatusFormRequest $request, BatchStatus $batchStatus)
    {
        try {
            $data = $request->validated();
            $data['modified_by'] = auth()->id();

            // Decode existing semester_order
            $semesterHistory = json_decode($batchStatus->semester_order ?? '[]', true);

            // Add new entry if semester changed
            if ($batchStatus->semester !== $data['semester']) {
                $semesterHistory[] = [
                    'semester'   => $data['semester'],
                    'changed_by' => auth()->id(),
                    'changed_at' => now(),
                ];
            }

            $data['semester_order'] = json_encode($semesterHistory);

            $batchStatus->update($data);

            return redirect()->route('batch-statuses.index')->with('success', 'Batch status updated successfully.');
        } catch (Exception $e) {
            Log::error('Batch status update failed: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Unable to update batch status. Please try again!');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BatchStatus $batchStatus)
    {
        try {
            $batchStatus->delete();
            return redirect()->back()->with('success', 'Batch status deleted successfully.');
        } catch (Exception $e) {
            Log::error('Batch status deletion failed: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Unable to delete batch status. Please try again!');
        }
    }
}
