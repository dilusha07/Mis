<?php

namespace App\Http\Controllers;

use App\Http\Requests\AcademicYearFormRequest;
use App\Models\AcademicYear;
use App\Models\Curriculum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Exception;

class AcademicYearController extends Controller
{
    public function index(Request $request)
    {
        $academicYearsQuery = AcademicYear::with('curriculum');

        $totalCount = $academicYearsQuery->count();

        if ($request->filled('search')) {
            $search = $request->search;
            $academicYearsQuery->where('academic_year', 'like', "%{$search}%");
        }

        $filteredCount = $academicYearsQuery->count();
        $perPage = (int) ($request->perPage ?? 10);

        if ($perPage === -1) {
            $academicYears = [
                'data' => $academicYearsQuery->latest()->get()->map(fn($year) => $this->format($year)),
                'total' => $filteredCount,
                'per_page' => $perPage,
                'from' => 1,
                'to' => $filteredCount,
                'links' => [],
            ];
        } else {
            $academicYears = $academicYearsQuery->latest()->paginate($perPage)->withQueryString();
            $academicYears->getCollection()->transform(fn($year) => $this->format($year));
        }

        return Inertia::render('academic-years/index', [
            'academicYears' => $academicYears,
            'filters' => $request->only(['search', 'perPage']),
            'totalCount' => $totalCount,
            'filteredCount' => $filteredCount,
        ]);
    }

    public function create()
    {
        return Inertia::render('academic-years/academic-year-form', [
            'curriculums' => Curriculum::all(['id', 'curriculum_name']),
        ]);
    }

    public function store(AcademicYearFormRequest $request)
    {
        try {
            AcademicYear::create([
                'academic_year' => $request->academic_year,
                'year_begin'    => $request->year_begin,
                'year_end'      => $request->year_end,
                'status'        => $request->status,
                'curriculum_id' => $request->curriculum_id,
                'created_by'    => auth()->id(),
            ]);

            return redirect()->route('academic-years.index')->with('success', 'Academic year created successfully.');
        } catch (Exception $e) {
            Log::error('Academic year creation failed: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Unable to create academic year.');
        }
    }

    public function show(AcademicYear $academicYear)
    {
        return Inertia::render('academic-years/academic-year-form', [
            'academicYear' => $academicYear->load('curriculum'),
            'isView' => true,
        ]);
    }

    public function edit(AcademicYear $academicYear)
    {
        return Inertia::render('academic-years/academic-year-form', [
            'academicYear' => $academicYear,
            'curriculums'  => Curriculum::all(['id', 'curriculum_name']),
            'isEdit' => true,
        ]);
    }

    public function update(AcademicYearFormRequest $request, AcademicYear $academicYear)
    {
        try {
            $academicYear->update([
                'academic_year' => $request->academic_year,
                'year_begin'    => $request->year_begin,
                'year_end'      => $request->year_end,
                'status'        => $request->status,
                'curriculum_id' => $request->curriculum_id,
                'modified_by'   => auth()->id(),
            ]);

            return redirect()->route('academic-years.index')->with('success', 'Academic year updated successfully.');
        } catch (Exception $e) {
            Log::error('Academic year update failed: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Unable to update academic year.');
        }
    }

    public function destroy(AcademicYear $academicYear)
    {
        try {
            $academicYear->delete();
            return redirect()->back()->with('success', 'Academic year deleted successfully.');
        } catch (Exception $e) {
            Log::error('Academic year deletion failed: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Unable to delete academic year.');
        }
    }

    private function format($year)
    {
        return [
            'id'            => $year->id,
            'academic_year' => $year->academic_year,
            'year_begin'    => $year->year_begin->format('d M Y'),
            'year_end'      => $year->year_end->format('d M Y'),
            'status'        => $year->status,
            'curriculum'    => $year->curriculum?->curriculum_name,
            'created_at'    => $year->created_at->format('d M Y'),
        ];
    }
}
