<?php

namespace App\Http\Controllers;

use App\Models\AcademicAdvisor;
use App\Models\Student;
use App\Models\Employee;
use App\Http\Requests\AcademicAdvisorFormRequest;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AcademicAdvisorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $academicAdvisorsQuery = AcademicAdvisor::with(['student', 'advisor']);

            if ($request->filled('search')) {
                $search = $request->string('search');
                $academicAdvisorsQuery->whereHas('student', function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('student_id', 'like', "%{$search}%");
                })->orWhereHas('advisor', function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
            }

            $totalCount = AcademicAdvisor::count();
            $filteredCount = (clone $academicAdvisorsQuery)->count();
            $perPage = (int) ($request->perPage ?? 10);

            if ($perPage === -1) {
                $data = $academicAdvisorsQuery->latest()->get()->map(fn($aa) => [
                    'id' => $aa->id,
                    'student_name' => $aa->student?->name ?? 'N/A',
                    'student_id' => $aa->student?->student_id ?? 'N/A',
                    'advisor_name' => $aa->advisor?->name ?? 'N/A',
                    'created_at' => $aa->created_at?->format('d M Y'),
                ]);

                $academicAdvisors = [
                    'data' => $data,
                    'total' => $filteredCount,
                    'per_page' => $perPage,
                    'from' => 1,
                    'to' => $filteredCount,
                    'links' => [],
                ];
            } else {
                $academicAdvisors = $academicAdvisorsQuery->latest()->paginate($perPage)->withQueryString();
                $academicAdvisors->getCollection()->transform(fn($aa) => [
                    'id' => $aa->id,
                    'student_name' => $aa->student?->name ?? 'N/A',
                    'student_id' => $aa->student?->student_id ?? 'N/A',
                    'advisor_name' => $aa->advisor?->name ?? 'N/A',
                    'created_at' => $aa->created_at?->format('d M Y'),
                ]);
            }

            return Inertia::render('academic-advisors/index', [
                'academicAdvisors' => $academicAdvisors,
                'filters' => $request->only(['search', 'perPage']),
                'totalCount' => $totalCount,
                'filteredCount' => $filteredCount,
            ]);

        } catch (Exception $e) {
            Log::error('Academic Advisor index failed: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Unable to load academic advisors. Please try again!');
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        try {
            // Simple test first - just get basic data
            $students = Student::all();
            $advisors = Employee::all();

            // Debug logging
            Log::info('Students count: ' . $students->count());
            Log::info('Advisors count: ' . $advisors->count());

            // Transform data for the form
            $studentsData = $students->map(function($student) {
                return [
                    'id' => $student->id,
                    'name' => $student->first_name . ' ' . $student->last_name,
                    'student_id' => $student->student_id
                ];
            });

            $advisorsData = $advisors->map(function($employee) {
                return [
                    'id' => $employee->id,
                    'name' => $employee->full_name ?: ($employee->first_name . ' ' . $employee->last_name)
                ];
            });

            // Check if we have data
            if ($students->isEmpty()) {
                Log::warning('No students found in database');
            }
            if ($advisors->isEmpty()) {
                Log::warning('No employees found in database');
            }

            return Inertia::render('academic-advisors/academic-advisor-form', [
                'students' => $studentsData,
                'advisors' => $advisorsData,
            ]);
        } catch (Exception $e) {
            Log::error('Academic Advisor create form failed: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return redirect()->back()->with('error', 'Unable to load create form. Please try again!');
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(AcademicAdvisorFormRequest $request)
    {
        try {
            $academicAdvisor = AcademicAdvisor::create($request->validated() + [
                'created_by' => auth()->id(),
            ]);

            if ($academicAdvisor) {
                Log::info('Academic Advisor created successfully. ID: ' . $academicAdvisor->id . ' by User: ' . auth()->id());
                return redirect()->route('academic-advisors.index')->with('success', 'Academic Advisor assigned successfully.');
            }

            Log::warning('Academic Advisor creation failed - no record returned');
            return redirect()->back()->with('error', 'Unable to assign academic advisor. Please try again!');

        } catch (Exception $e) {
            Log::error('Academic Advisor creation failed: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Unable to assign academic advisor. Please try again!');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(AcademicAdvisor $academicAdvisor)
    {
        try {
            // Get students with proper name concatenation
            $students = Student::select('id', 'first_name', 'last_name', 'student_id')
                ->get()
                ->map(function($student) {
                    return [
                        'id' => $student->id,
                        'name' => $student->first_name . ' ' . $student->last_name,
                        'student_id' => $student->student_id
                    ];
                });

            // Get employees with proper name concatenation
            $advisors = Employee::select('id', 'first_name', 'last_name', 'full_name')
                ->get()
                ->map(function($employee) {
                    return [
                        'id' => $employee->id,
                        'name' => $employee->full_name ?: ($employee->first_name . ' ' . $employee->last_name)
                    ];
                });

            return Inertia::render('academic-advisors/academic-advisor-form', [
                'academicAdvisor' => $academicAdvisor,
                'students' => $students,
                'advisors' => $advisors,
                'isView' => true,
            ]);
        } catch (Exception $e) {
            Log::error('Academic Advisor show failed. ID: ' . $academicAdvisor->id . ' Error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Unable to display academic advisor. Please try again!');
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AcademicAdvisor $academicAdvisor)
    {
        try {
            // Get students with proper name concatenation
            $students = Student::select('id', 'first_name', 'last_name', 'student_id')
                ->get()
                ->map(function($student) {
                    return [
                        'id' => $student->id,
                        'name' => $student->first_name . ' ' . $student->last_name,
                        'student_id' => $student->student_id
                    ];
                });

            // Get employees with proper name concatenation
            $advisors = Employee::select('id', 'first_name', 'last_name', 'full_name')
                ->get()
                ->map(function($employee) {
                    return [
                        'id' => $employee->id,
                        'name' => $employee->full_name ?: ($employee->first_name . ' ' . $employee->last_name)
                    ];
                });

            return Inertia::render('academic-advisors/academic-advisor-form', [
                'academicAdvisor' => $academicAdvisor,
                'students' => $students,
                'advisors' => $advisors,
                'isEdit' => true,
            ]);
        } catch (Exception $e) {
            Log::error('Academic Advisor edit form failed. ID: ' . $academicAdvisor->id . ' Error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Unable to load edit form. Please try again!');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(AcademicAdvisorFormRequest $request, AcademicAdvisor $academicAdvisor)
    {
        try {
            if ($academicAdvisor) {
                $updated = $academicAdvisor->update($request->validated() + [
                    'modified_by' => auth()->id(),
                ]);

                if ($updated) {
                    Log::info('Academic Advisor updated successfully. ID: ' . $academicAdvisor->id . ' by User: ' . auth()->id());
                    return redirect()->route('academic-advisors.index')->with('success', 'Academic Advisor updated successfully.');
                }

                Log::warning('Academic Advisor update failed - no changes made. ID: ' . $academicAdvisor->id);
                return redirect()->back()->with('error', 'Unable to update academic advisor. Please try again!');
            }

            Log::warning('Academic Advisor update failed - record not found');
            return redirect()->back()->with('error', 'Academic Advisor not found. Please try again!');

        } catch (Exception $e) {
            Log::error('Academic Advisor update failed. ID: ' . $academicAdvisor->id . ' Error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Unable to update academic advisor. Please try again!');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AcademicAdvisor $academicAdvisor)
    {
        try {
            if ($academicAdvisor) {
                $academicAdvisorId = $academicAdvisor->id;
                $deleted = $academicAdvisor->delete();

                if ($deleted) {
                    Log::info('Academic Advisor deleted successfully. ID: ' . $academicAdvisorId . ' by User: ' . auth()->id());
                    return redirect()->back()->with('success', 'Academic Advisor removed successfully.');
                }

                Log::warning('Academic Advisor deletion failed - no record deleted. ID: ' . $academicAdvisorId);
                return redirect()->back()->with('error', 'Unable to remove academic advisor. Please try again!');
            }

            Log::warning('Academic Advisor deletion failed - record not found');
            return redirect()->back()->with('error', 'Academic Advisor not found. Please try again!');

        } catch (Exception $e) {
            Log::error('Academic Advisor deletion failed. ID: ' . $academicAdvisor->id . ' Error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Unable to remove academic advisor. Please try again!');
        }
    }
}
