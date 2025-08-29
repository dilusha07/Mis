<?php

namespace App\Http\Controllers;

use App\Models\ExamPlan;
use App\Models\Employee;
use App\Models\Department;
use App\Models\Module;
use App\Http\Requests\ExamPlanFormRequest;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ExamPlanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $examPlansQuery = ExamPlan::with(['firstExaminer', 'secondExaminer', 'department', 'module']);

            if ($request->filled('search')) {
                $search = $request->string('search');
                $examPlansQuery->whereHas('module', function($q) use ($search) {
                    $q->where('module_name', 'like', "%{$search}%")
                      ->orWhere('module_code', 'like', "%{$search}%");
                });
            }



            $totalCount = ExamPlan::count();
            $filteredCount = (clone $examPlansQuery)->count();
            $perPage = (int) ($request->perPage ?? 10);

            if ($perPage === -1) {
                $data = $examPlansQuery->latest()->get()->map(fn($ep) => [
                    'id' => $ep->id,
                    'first_examiner' => $ep->firstExaminer?->full_name,
                    'second_examiner' => $ep->secondExaminer?->full_name,
                    'department' => $ep->department?->dept_name,
                    'module' => $ep->module?->module_name,
                    'module_code' => $ep->module?->module_code,
                    'final_marks' => $ep->final_marks,
                    'mid_marks' => $ep->mid_marks,
                    'ca_marks' => $ep->ca_marks,
                    'other_marks' => $ep->other_marks,
                    'created_at' => $ep->created_at?->format('d M Y'),
                ]);

                $examPlans = [
                    'data' => $data,
                    'total' => $filteredCount,
                    'per_page' => $perPage,
                    'from' => 1,
                    'to' => $filteredCount,
                    'links' => [],
                ];
            } else {
                $examPlans = $examPlansQuery->latest()->paginate($perPage)->withQueryString();
                $examPlans->getCollection()->transform(fn($ep) => [
                    'id' => $ep->id,
                    'first_examiner' => $ep->firstExaminer?->full_name,
                    'second_examiner' => $ep->secondExaminer?->full_name,
                    'department' => $ep->department?->dept_name,
                    'module' => $ep->module?->module_name,
                    'module_code' => $ep->module?->module_code,
                    'final_marks' => $ep->final_marks,
                    'mid_marks' => $ep->mid_marks,
                    'ca_marks' => $ep->ca_marks,
                    'other_marks' => $ep->other_marks,
                    'created_at' => $ep->created_at?->format('d M Y'),
                ]);
            }

            return Inertia::render('exam-plans/index', [
                'examPlans' => $examPlans,
                'filters' => $request->only(['search', 'perPage']),
                'totalCount' => $totalCount,
                'filteredCount' => $filteredCount,
            ]);

        } catch (Exception $e) {
            Log::error('Exam plan index failed: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Unable to load exam plans. Please try again!');
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        try {
            $lecturers = Employee::where('primary_role', 'lecture')
                ->select('id', 'full_name', 'department_id')
                ->orderBy('full_name')
                ->get();

            $departments = Department::where('dept_type', 'Departments')
                ->select('id', 'dept_name')
                ->orderBy('dept_name')
                ->get();

            $modules = Module::select('id', 'module_name', 'module_code', 'department_id')
                ->orderBy('module_name')
                ->get();

            return Inertia::render('exam-plans/exam-plan-form', [
                'lecturers' => $lecturers,
                'departments' => $departments,
                'modules' => $modules,
            ]);
        } catch (Exception $e) {
            Log::error('Exam plan create form failed: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Unable to load create form. Please try again!');
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ExamPlanFormRequest $request)
    {
        try {
            $validatedData = $request->validated();

            $examPlan = ExamPlan::create($validatedData + [
                'created_by' => auth()->id(),
            ]);

            if ($examPlan) {
                Log::info('Exam plan created successfully. ID: ' . $examPlan->id . ' by User: ' . auth()->id());
                return redirect()->route('exam-plans.index')->with('success', 'Exam plan created successfully.');
            }

            Log::warning('Exam plan creation failed - no exam plan returned');
            return redirect()->back()->with('error', 'Unable to create exam plan. Please try again!');

        } catch (Exception $e) {
            Log::error('Exam plan creation failed: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Unable to create exam plan. Please try again!');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(ExamPlan $examPlan)
    {
        try {
            $examPlan->load(['firstExaminer', 'secondExaminer', 'department', 'module']);

            $lecturers = Employee::where('primary_role', 'lecture')
                ->select('id', 'full_name', 'department_id')
                ->orderBy('full_name')
                ->get();

            $departments = Department::where('dept_type', 'Departments')
                ->select('id', 'dept_name')
                ->orderBy('dept_name')
                ->get();

            $modules = Module::select('id', 'module_name', 'module_code', 'department_id')
                ->orderBy('module_name')
                ->get();

            return Inertia::render('exam-plans/exam-plan-form', [
                'examPlan' => $examPlan,
                'isView' => true,
                'lecturers' => $lecturers,
                'departments' => $departments,
                'modules' => $modules,
            ]);
        } catch (Exception $e) {
            Log::error('Exam plan show failed: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Unable to load exam plan. Please try again!');
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ExamPlan $examPlan)
    {
        try {
            $examPlan->load(['firstExaminer', 'secondExaminer', 'department', 'module']);

            $lecturers = Employee::where('primary_role', 'lecture')
                ->select('id', 'full_name', 'department_id')
                ->orderBy('full_name')
                ->get();

            $departments = Department::where('dept_type', 'Departments')
                ->select('id', 'dept_name')
                ->orderBy('dept_name')
                ->get();

            $modules = Module::select('id', 'module_name', 'module_code', 'department_id')
                ->orderBy('module_name')
                ->get();

            return Inertia::render('exam-plans/exam-plan-form', [
                'examPlan' => $examPlan,
                'isEdit' => true,
                'lecturers' => $lecturers,
                'departments' => $departments,
                'modules' => $modules,
            ]);
        } catch (Exception $e) {
            Log::error('Exam plan edit form failed: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Unable to load edit form. Please try again!');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ExamPlanFormRequest $request, ExamPlan $examPlan)
    {
        try {
            $validatedData = $request->validated();

            $examPlan->update($validatedData + [
                'edited_by' => auth()->id(),
            ]);

            Log::info('Exam plan updated successfully. ID: ' . $examPlan->id . ' by User: ' . auth()->id());
            return redirect()->route('exam-plans.index')->with('success', 'Exam plan updated successfully.');

        } catch (Exception $e) {
            Log::error('Exam plan update failed: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Unable to update exam plan. Please try again!');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ExamPlan $examPlan)
    {
        try {
            $examPlan->delete();
            Log::info('Exam plan deleted successfully. ID: ' . $examPlan->id . ' by User: ' . auth()->id());
            return redirect()->route('exam-plans.index')->with('success', 'Exam plan deleted successfully.');
        } catch (Exception $e) {
            Log::error('Exam plan deletion failed: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Unable to delete exam plan. Please try again!');
        }
    }


}
