<?php

namespace App\Http\Controllers;

use App\Models\module;
use App\Http\Requests\ModuleFormRequest;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ModuleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
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

        } catch (Exception $e) {
            Log::error('Module index failed: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Unable to load modules. Please try again!');
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        try {
            return Inertia::render('modules/module-form');
        } catch (Exception $e) {
            Log::error('Module create form failed: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Unable to load create form. Please try again!');
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ModuleFormRequest $request)
    {
        try {
            $module = module::create($request->validated() + [
                'created_by' => auth()->id(),
            ]);

            if ($module) {
                Log::info('Module created successfully. ID: ' . $module->id . ' by User: ' . auth()->id());
                return redirect()->route('modules.index')->with('success', 'Module created successfully.');
            }

            Log::warning('Module creation failed - no module returned');
            return redirect()->back()->with('error', 'Unable to create module. Please try again!');

        } catch (Exception $e) {
            Log::error('Module creation failed: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Unable to create module. Please try again!');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(module $module)
    {
        try {
            return Inertia::render('modules/module-form', [
                'module' => $module,
                'isView' => true,
            ]);
        } catch (Exception $e) {
            Log::error('Module show failed. ID: ' . $module->id . ' Error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Unable to display module. Please try again!');
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(module $module)
    {
        try {
            return Inertia::render('modules/module-form', [
                'module' => $module,
                'isEdit' => true,
            ]);
        } catch (Exception $e) {
            Log::error('Module edit form failed. ID: ' . $module->id . ' Error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Unable to load edit form. Please try again!');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ModuleFormRequest $request, module $module)
    {
        try {
            if ($module) {
                $updated = $module->update($request->validated() + [
                    'modified_by' => auth()->id(),
                ]);

                if ($updated) {
                    Log::info('Module updated successfully. ID: ' . $module->id . ' by User: ' . auth()->id());
                    return redirect()->route('modules.index')->with('success', 'Module updated successfully.');
                }

                Log::warning('Module update failed - no changes made. ID: ' . $module->id);
                return redirect()->back()->with('error', 'Unable to update module. Please try again!');
            }

            Log::warning('Module update failed - module not found');
            return redirect()->back()->with('error', 'Module not found. Please try again!');

        } catch (Exception $e) {
            Log::error('Module update failed. ID: ' . $module->id . ' Error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Unable to update module. Please try again!');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(module $module)
    {
        try {
            if ($module) {
                $moduleId = $module->id;
                $deleted = $module->delete();

                if ($deleted) {
                    Log::info('Module deleted successfully. ID: ' . $moduleId . ' by User: ' . auth()->id());
                    return redirect()->back()->with('success', 'Module deleted successfully.');
                }

                Log::warning('Module deletion failed - no module deleted. ID: ' . $moduleId);
                return redirect()->back()->with('error', 'Unable to delete module. Please try again!');
            }

            Log::warning('Module deletion failed - module not found');
            return redirect()->back()->with('error', 'Module not found. Please try again!');

        } catch (Exception $e) {
            Log::error('Module deletion failed. ID: ' . $module->id . ' Error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Unable to delete module. Please try again!');
        }
    }
}
