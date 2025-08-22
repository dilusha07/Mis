<?php

namespace App\Http\Controllers;

use App\Models\ModulePrerequisite;
use App\Models\Module;
use App\Models\Curriculum;
use App\Http\Requests\ModulePrerequisiteFormRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ModulePrerequisiteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $prerequisitesQuery = ModulePrerequisite::with(['module', 'prerequisiteModule', 'curriculum']);

        if ($request->filled('search')) {
            $search = $request->string('search');
            $prerequisitesQuery->whereHas('module', function($q) use ($search) {
                $q->where('module_name', 'like', "%{$search}%")
                  ->orWhere('module_code', 'like', "%{$search}%");
            })->orWhereHas('prerequisiteModule', function($q) use ($search) {
                $q->where('module_name', 'like', "%{$search}%")
                  ->orWhere('module_code', 'like', "%{$search}%");
            });
        }

        $totalCount = ModulePrerequisite::count();
        $filteredCount = (clone $prerequisitesQuery)->count();
        $perPage = (int) ($request->perPage ?? 10);

        if ($perPage === -1) {
            $data = $prerequisitesQuery->latest()->get()->map(fn($p) => [
                'id' => $p->id,
                'module_name' => $p->module->module_name,
                'module_code' => $p->module->module_code,
                'pre_module_name' => $p->prerequisiteModule->module_name,
                'pre_module_code' => $p->prerequisiteModule->module_code,
                'curriculum_name' => $p->curriculum->curriculum_name,
                'created_at' => $p->created_at?->format('d M Y'),
            ]);

            $prerequisites = [
                'data' => $data,
                'total' => $filteredCount,
                'per_page' => $perPage,
                'from' => 1,
                'to' => $filteredCount,
                'links' => [],
            ];
        } else {
            $prerequisites = $prerequisitesQuery->latest()->paginate($perPage)->withQueryString();
            $prerequisites->getCollection()->transform(fn($p) => [
                'id' => $p->id,
                'module_name' => $p->module->module_name,
                'module_code' => $p->module->module_code,
                'pre_module_name' => $p->prerequisiteModule->module_name,
                'pre_module_code' => $p->prerequisiteModule->module_code,
                'curriculum_name' => $p->curriculum->curriculum_name,
                'created_at' => $p->created_at?->format('d M Y'),
            ]);
        }

        return Inertia::render('prerequisites/index', [
            'prerequisites' => $prerequisites,
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
        $modules = Module::select('id', 'module_name', 'module_code')->get();
        $curriculums = Curriculum::select('id', 'curriculum_name')->get();

        return Inertia::render('prerequisites/prerequisite-form', [
            'modules' => $modules,
            'curriculums' => $curriculums,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ModulePrerequisiteFormRequest $request)
    {
        $prerequisite = ModulePrerequisite::create($request->validated() + [
            'created_by' => auth()->id(),
        ]);

        return redirect()->route('prerequisites.index')->with(
            $prerequisite ? 'success' : 'error',
            $prerequisite ? 'Prerequisite created successfully.' : 'Unable to create prerequisite.'
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(ModulePrerequisite $prerequisite)
    {
        $prerequisite->load(['module', 'prerequisiteModule', 'curriculum']);
        
        return Inertia::render('prerequisites/prerequisite-form', [
            'prerequisite' => $prerequisite,
            'isView' => true,
            'modules' => Module::select('id', 'module_name', 'module_code')->get(),
            'curriculums' => Curriculum::select('id', 'curriculum_name')->get(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ModulePrerequisite $prerequisite)
    {
        $prerequisite->load(['module', 'prerequisiteModule', 'curriculum']);
        
        return Inertia::render('prerequisites/prerequisite-form', [
            'prerequisite' => $prerequisite,
            'isEdit' => true,
            'modules' => Module::select('id', 'module_name', 'module_code')->get(),
            'curriculums' => Curriculum::select('id', 'curriculum_name')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ModulePrerequisiteFormRequest $request, ModulePrerequisite $prerequisite)
    {
        $updated = $prerequisite->update($request->validated() + [
            'modified_by' => auth()->id(),
        ]);

        return redirect()->route('prerequisites.index')->with(
            $updated ? 'success' : 'error',
            $updated ? 'Prerequisite updated successfully.' : 'Unable to update prerequisite.'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ModulePrerequisite $prerequisite)
    {
        $deleted = $prerequisite->delete();
        return redirect()->back()->with(
            $deleted ? 'success' : 'error',
            $deleted ? 'Prerequisite deleted successfully.' : 'Unable to delete prerequisite.'
        );
    }
}
