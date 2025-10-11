<?php

namespace App\Http\Controllers;

use App\Models\ExamAdmission;
use App\Models\BatchSemModule;
use App\Http\Requests\ExamAdmissionFormRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExamAdmissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Use a more direct approach with joins to ensure we get the data
        $examAdmissionsQuery = ExamAdmission::join('batch_sem_modules', 'exam_admissions.batch_sem_module_id', '=', 'batch_sem_modules.id')
            ->join('modules', 'batch_sem_modules.module_id', '=', 'modules.id')
            ->join('batch_statuses', 'batch_sem_modules.batch_status_id', '=', 'batch_statuses.id')
            ->select(
                'exam_admissions.*',
                'modules.module_name',
                'modules.module_code',
                'batch_statuses.semester'
            );

        if ($request->filled('search')) {
            $search = $request->string('search');
            $examAdmissionsQuery->where(function($q) use ($search) {
                $q->where('modules.module_name', 'like', "%{$search}%")
                  ->orWhere('modules.module_code', 'like', "%{$search}%")
                  ->orWhere('exam_admissions.venue', 'like', "%{$search}%")
                  ->orWhere('exam_admissions.student_group', 'like', "%{$search}%");
            });
        }

        $totalCount = ExamAdmission::count();
        $filteredCount = (clone $examAdmissionsQuery)->count();
        $perPage = (int) ($request->perPage ?? 10);

        if ($perPage === -1) {
            $data = $examAdmissionsQuery->latest()->get()->map(fn($ea) => [
                'id' => $ea->id,
                'module_name' => $ea->module_name ?? 'N/A',
                'module_code' => $ea->module_code ?? 'N/A',
                'semester' => $ea->semester ?? 'N/A',
                'exam_date' => $ea->exam_date?->format('d M Y'),
                'start_time' => $ea->start_time?->format('H:i'),
                'end_time' => $ea->end_time?->format('H:i'),
                'venue' => $ea->venue,
                'student_group' => $ea->student_group,
                'created_at' => $ea->created_at?->format('d M Y'),
            ]);

            $examAdmissions = [
                'data' => $data,
                'total' => $filteredCount,
                'per_page' => $perPage,
                'from' => 1,
                'to' => $filteredCount,
                'links' => [],
            ];
        } else {
            $examAdmissions = $examAdmissionsQuery->latest()->paginate($perPage)->withQueryString();
            $examAdmissions->getCollection()->transform(fn($ea) => [
                'id' => $ea->id,
                'module_name' => $ea->module_name ?? 'N/A',
                'module_code' => $ea->module_code ?? 'N/A',
                'semester' => $ea->semester ?? 'N/A',
                'exam_date' => $ea->exam_date?->format('d M Y'),
                'start_time' => $ea->start_time?->format('H:i'),
                'end_time' => $ea->end_time?->format('H:i'),
                'venue' => $ea->venue,
                'student_group' => $ea->student_group,
                'created_at' => $ea->created_at?->format('d M Y'),
            ]);
        }

        return Inertia::render('exam-admissions/index', [
            'examAdmissions' => $examAdmissions,
            'filters' => $request->only(['search', 'perPage']),
            'totalCount' => $totalCount,
            'filteredCount' => $filteredCount,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $batchSemModules = BatchSemModule::with(['module', 'batchStatus'])
            ->select('id', 'module_id', 'batch_status_id')
            ->get();

        return Inertia::render('exam-admissions/exam-admission-form', [
            'batchSemModules' => $batchSemModules,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ExamAdmissionFormRequest $request)
    {
        $examAdmission = ExamAdmission::create($request->validated() + [
            'created_by' => auth()->id(),
            'modified_by' => auth()->id(), // Required field for new records
        ]);

        return redirect()->route('exam-admissions.index')->with(
            $examAdmission ? 'success' : 'error',
            $examAdmission ? 'Exam admission created successfully.' : 'Unable to create exam admission.'
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(ExamAdmission $examAdmission)
    {
        $examAdmission->load(['batchSemModule.module', 'batchSemModule.batchStatus']);

        // Format fields for form inputs
        $examAdmissionData = [
            'id' => $examAdmission->id,
            'batch_sem_module_id' => $examAdmission->batch_sem_module_id,
            'exam_date' => $examAdmission->exam_date?->format('Y-m-d'),
            'start_time' => $examAdmission->start_time?->format('H:i'),
            'end_time' => $examAdmission->end_time?->format('H:i'),
            'venue' => $examAdmission->venue,
            'student_group' => $examAdmission->student_group,
            'created_at' => $examAdmission->created_at?->toISOString(),
            'updated_at' => $examAdmission->updated_at?->toISOString(),
            'batchSemModule' => [
                'id' => $examAdmission->batchSemModule?->id,
                'module' => [
                    'module_name' => $examAdmission->batchSemModule?->module?->module_name,
                    'module_code' => $examAdmission->batchSemModule?->module?->module_code,
                ],
                'batchStatus' => [
                    'status' => $examAdmission->batchSemModule?->batchStatus?->status,
                ],
            ],
        ];

        $batchSemModules = BatchSemModule::with(['module', 'batchStatus'])
            ->select('id', 'module_id', 'batch_status_id')
            ->get();

        return Inertia::render('exam-admissions/exam-admission-form', [
            'examAdmission' => $examAdmissionData,
            'batchSemModules' => $batchSemModules,
            'isView' => true,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ExamAdmission $examAdmission)
    {
        $examAdmission->load(['batchSemModule.module', 'batchSemModule.batchStatus']);

        // Format fields for form inputs
        $examAdmissionData = [
            'id' => $examAdmission->id,
            'batch_sem_module_id' => $examAdmission->batch_sem_module_id,
            'exam_date' => $examAdmission->exam_date?->format('Y-m-d'),
            'start_time' => $examAdmission->start_time?->format('H:i'),
            'end_time' => $examAdmission->end_time?->format('H:i'),
            'venue' => $examAdmission->venue,
            'student_group' => $examAdmission->student_group,
            'created_at' => $examAdmission->created_at?->toISOString(),
            'updated_at' => $examAdmission->updated_at?->toISOString(),
            'batchSemModule' => [
                'id' => $examAdmission->batchSemModule?->id,
                'module' => [
                    'module_name' => $examAdmission->batchSemModule?->module?->module_name,
                    'module_code' => $examAdmission->batchSemModule?->module?->module_code,
                ],
                'batchStatus' => [
                    'status' => $examAdmission->batchSemModule?->batchStatus?->status,
                ],
            ],
        ];

        $batchSemModules = BatchSemModule::with(['module', 'batchStatus'])
            ->select('id', 'module_id', 'batch_status_id')
            ->get();

        return Inertia::render('exam-admissions/exam-admission-form', [
            'examAdmission' => $examAdmissionData,
            'batchSemModules' => $batchSemModules,
            'isEdit' => true,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ExamAdmissionFormRequest $request, ExamAdmission $examAdmission)
    {
        $updated = $examAdmission->update($request->validated() + [
            'modified_by' => auth()->id(),
        ]);

        return redirect()->route('exam-admissions.index')->with(
            $updated ? 'success' : 'error',
            $updated ? 'Exam admission updated successfully.' : 'Unable to update exam admission.'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ExamAdmission $examAdmission)
    {
        $deleted = $examAdmission->delete();

        return redirect()->route('exam-admissions.index')->with(
            $deleted ? 'success' : 'error',
            $deleted ? 'Exam admission deleted successfully.' : 'Unable to delete exam admission.'
        );
    }
}
