<?php

namespace App\Http\Controllers;

use App\Models\module;
use App\Http\Requests\ModuleFormRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ModuleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $modulesQuery = module::query();

        if ($request->filled('search')) {
            $search = $request->string('search');
            $modulesQuery->where(fn($q) => $q
                ->where('module_name', 'like', "%{$search}%")
                ->orWhere('module_code', 'like', "%{$search}%")
            );
        }

        $totalCount = module::count();
        $filteredCount = (clone $modulesQuery)->count();
        $perPage = (int) ($request->perPage ?? 10);

        if ($perPage === -1) {
            $data = $modulesQuery->latest()->get()->map(fn($m) => [
                'id' => $m->id,
                'module_name' => $m->module_name,
                'module_code' => $m->module_code,
                'module_details' => $m->module_details,
                'credits' => $m->credits,
                'created_at' => $m->created_at?->format('d M Y'),
            ]);

            $modules = [
                'data' => $data,
                'total' => $filteredCount,
                'per_page' => $perPage,
                'from' => 1,
                'to' => $filteredCount,
                'links' => [],
            ];
        } else {
            $modules = $modulesQuery->latest()->paginate($perPage)->withQueryString();
            $modules->getCollection()->transform(fn($m) => [
                'id' => $m->id,
                'module_name' => $m->module_name,
                'module_code' => $m->module_code,
                'module_details' => $m->module_details,
                'credits' => $m->credits,
                'created_at' => $m->created_at?->format('d M Y'),
            ]);
        }

        return Inertia::render('modules/index', [
            'modules' => $modules,
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
        return Inertia::render('modules/module-form');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ModuleFormRequest $request)
    {
        $module = module::create($request->validated() + [
            'created_by' => auth()->id(),
        ]);

        return redirect()->route('modules.index')->with(
            $module ? 'success' : 'error',
            $module ? 'Module created successfully.' : 'Unable to create module.'
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(module $module)
    {
        return Inertia::render('modules/module-form', [
            'module' => $module,
            'isView' => true,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(module $module)
    {
        return Inertia::render('modules/module-form', [
            'module' => $module,
            'isEdit' => true,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ModuleFormRequest $request, module $module)
    {
        $updated = $module->update($request->validated() + [
            'modified_by' => auth()->id(),
        ]);

        return redirect()->route('modules.index')->with(
            $updated ? 'success' : 'error',
            $updated ? 'Module updated successfully.' : 'Unable to update module.'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(module $module)
    {
        $deleted = $module->delete();
        return redirect()->back()->with(
            $deleted ? 'success' : 'error',
            $deleted ? 'Module deleted successfully.' : 'Unable to delete module.'
        );
    }
}
