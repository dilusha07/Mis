<?php

namespace App\Http\Controllers;

use App\Models\BatchSemModule;
use App\Models\Module;
use App\Models\ModulePrerequisite;
use App\Models\Employee;
use App\Models\BatchStatus;
use App\Models\Batch;
use App\Http\Requests\BatchSemModuleFormRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BatchSemModuleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $batchSemModulesQuery = BatchSemModule::with(['module', 'modulePrerequisite', 'moduleCoordinator', 'lecture', 'batchStatus']);

        if ($request->filled('search')) {
            $search = $request->string('search');
            $batchSemModulesQuery->whereHas('module', function($q) use ($search) {
                $q->where('module_name', 'like', "%{$search}%")
                  ->orWhere('module_code', 'like', "%{$search}%");
            });
        }

        $totalCount = BatchSemModule::count();
        $filteredCount = (clone $batchSemModulesQuery)->count();
        $perPage = (int) ($request->perPage ?? 10);

        if ($perPage === -1) {
            $data = $batchSemModulesQuery->latest()->get()->map(fn($bsm) => [
                'id' => $bsm->id,
                'module_name' => $bsm->module?->module_name,
                'module_code' => $bsm->module?->module_code,
                'semester' => $bsm->semester,
                'module_type' => $bsm->module_type,
                'gpa_applicability' => $bsm->gpa_applicability,
                'module_coordinator' => $bsm->moduleCoordinator?->full_name ?? 'N/A',
                'lecture' => $bsm->lecture?->full_name ?? 'N/A',
                'created_at' => $bsm->created_at?->format('d M Y'),
            ]);

            $batchSemModules = [
                'data' => $data,
                'total' => $filteredCount,
                'per_page' => $perPage,
                'from' => 1,
                'to' => $filteredCount,
                'links' => [],
            ];
        } else {
            $batchSemModules = $batchSemModulesQuery->latest()->paginate($perPage)->withQueryString();
            $batchSemModules->getCollection()->transform(fn($bsm) => [
                'id' => $bsm->id,
                'module_name' => $bsm->module?->module_name,
                'module_code' => $bsm->module?->module_code,
                'semester' => $bsm->semester,
                'module_type' => $bsm->module_type,
                'gpa_applicability' => $bsm->gpa_applicability,
                'module_coordinator' => $bsm->moduleCoordinator?->full_name ?? 'N/A',
                'lecture' => $bsm->lecture?->full_name ?? 'N/A',
                'created_at' => $bsm->created_at?->format('d M Y'),
            ]);
        }

        return Inertia::render('batch-sem-modules/index', [
            'batchSemModules' => $batchSemModules,
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
        $batches = Batch::select('id', 'batch_name')->orderBy('batch_name')->get();
        $modules = Module::select('id', 'module_name', 'module_code', 'module_type', 'allowed_stream')->get();
        $modulePrerequisites = ModulePrerequisite::with('module')->get();
        $lecturers = Employee::where('primary_role', 'lecture')->select('id', 'full_name')->orderBy('full_name')->get();
        $batchStatusesAll = BatchStatus::select('id', 'batch_id', 'semester', 'status')->orderBy('batch_id')->get();

        return Inertia::render('batch-sem-modules/batch-sem-module-form', [
            'batches' => $batches,
            'modules' => $modules,
            'modulePrerequisites' => $modulePrerequisites,
            'lecturers' => $lecturers,
            'batchStatusesAll' => $batchStatusesAll,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(BatchSemModuleFormRequest $request)
    {
        $batchSemModule = BatchSemModule::create($request->validated() + [
            'created_by' => auth()->id(),
        ]);

        return redirect()->route('batch-sem-modules.index')->with(
            $batchSemModule ? 'success' : 'error',
            $batchSemModule ? 'Batch Semester Module created successfully.' : 'Unable to create batch semester module.'
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(BatchSemModule $batchSemModule)
    {
        $batchSemModule->load(['module', 'modulePrerequisite', 'moduleCoordinator', 'lecture', 'batchStatus']);

        $batches = Batch::select('id', 'batch_name')->orderBy('batch_name')->get();
        $modules = Module::select('id', 'module_name', 'module_code', 'module_type', 'allowed_stream')->get();
        $modulePrerequisites = ModulePrerequisite::with('module')->get();
        $lecturers = Employee::where('primary_role', 'lecture')->select('id', 'full_name')->orderBy('full_name')->get();
        $batchStatusesAll = BatchStatus::select('id', 'batch_id', 'semester', 'status')->orderBy('batch_id')->get();

        return Inertia::render('batch-sem-modules/batch-sem-module-form', [
            'batchSemModule' => $batchSemModule,
            'batches' => $batches,
            'modules' => $modules,
            'modulePrerequisites' => $modulePrerequisites,
            'lecturers' => $lecturers,
            'batchStatusesAll' => $batchStatusesAll,
            'isView' => true,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BatchSemModule $batchSemModule)
    {
        $batchSemModule->load(['module', 'modulePrerequisite', 'moduleCoordinator', 'lecture', 'batchStatus']);

        $batches = Batch::select('id', 'batch_name')->orderBy('batch_name')->get();
        $modules = Module::select('id', 'module_name', 'module_code', 'module_type', 'allowed_stream')->get();
        $modulePrerequisites = ModulePrerequisite::with('module')->get();
        $lecturers = Employee::where('primary_role', 'lecture')->select('id', 'full_name')->orderBy('full_name')->get();
        $batchStatusesAll = BatchStatus::select('id', 'batch_id', 'semester', 'status')->orderBy('batch_id')->get();

        return Inertia::render('batch-sem-modules/batch-sem-module-form', [
            'batchSemModule' => $batchSemModule,
            'batches' => $batches,
            'modules' => $modules,
            'modulePrerequisites' => $modulePrerequisites,
            'lecturers' => $lecturers,
            'batchStatusesAll' => $batchStatusesAll,
            'isEdit' => true,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(BatchSemModuleFormRequest $request, BatchSemModule $batchSemModule)
    {
        $updated = $batchSemModule->update($request->validated() + [
            'modified_by' => auth()->id(),
        ]);

        return redirect()->route('batch-sem-modules.index')->with(
            $updated ? 'success' : 'error',
            $updated ? 'Batch Semester Module updated successfully.' : 'Unable to update batch semester module.'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BatchSemModule $batchSemModule)
    {
        $deleted = $batchSemModule->delete();
        return redirect()->back()->with(
            $deleted ? 'success' : 'error',
            $deleted ? 'Batch Semester Module deleted successfully.' : 'Unable to delete batch semester module.'
        );
    }
}
