<?php

namespace App\Http\Controllers;

use App\Models\Curriculum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Exception;
use App\Http\Requests\CurriculumFormRequest;

class CurriculumController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $curriculumsQuery = Curriculum::query();

        # Capturing the total count before applying filters
        $totalCount = $curriculumsQuery->count();

        if ($request->filled('search')) {
            $search = $request->search;

            $curriculumsQuery->where(fn($query) =>
                $query->where('curriculum_code', 'like', "%{$search}%")
                    ->orWhere('curriculum_name', 'like', "%{$search}%")
                    //->orWhere('start_date', 'like', "%{$search}%")
                   // ->orWhere('start_batch_from', 'like', "%{$search}%")
                    //->orWhere('end_batch_to', 'like', "%{$search}%")
            );
        }

        # Filtered Count
        $filteredCount = $curriculumsQuery->count();

        $perPage = (int) ($request->perPage ?? 10);

        # Fetch All Records
        if ($perPage === -1) {
            $allCurriculums = $curriculumsQuery->latest()->get()->map(fn($curriculum) => [
                'id'                => $curriculum->id,
                'curriculum_code'   => $curriculum->curriculum_code,
                'curriculum_name'   => $curriculum->curriculum_name,
                'start_date'        => $curriculum->start_date->format('d M Y'),
                'start_batch_from'  => $curriculum->start_batch_from,
                'end_batch_to'      => $curriculum->end_batch_to,
                'created_at'        => $curriculum->created_at->format('d M Y'),
            ]);

            $curriculums = [
                'data'     => $allCurriculums,
                'total'    => $filteredCount,
                'per_page' => $perPage,
                'from'     => 1,
                'to'       => $filteredCount,
                'links'    => [],
            ];
        } else {
            $curriculums = $curriculumsQuery->latest()->paginate($perPage)->withQueryString();
            $curriculums->getCollection()->transform(fn($curriculum) => [
                'id'                => $curriculum->id,
                'curriculum_code'   => $curriculum->curriculum_code,
                'curriculum_name'   => $curriculum->curriculum_name,
                'start_date'        => $curriculum->start_date->format('d M Y'),
                'start_batch_from'  => $curriculum->start_batch_from,
                'end_batch_to'      => $curriculum->end_batch_to,
                'created_at'        => $curriculum->created_at->format('d M Y'),
            ]);
        }

        return Inertia::render('curriculums/index', [
            'curriculums'   => $curriculums,
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
        return Inertia::render('curriculums/curriculum-form');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CurriculumFormRequest $request)
    {
         try {
            $curriculum = Curriculum::create([
                'curriculum_code'  => $request->curriculum_code,
                'curriculum_name'  => $request->curriculum_name,
                'start_date'       => $request->start_date,
                'start_batch_from' => $request->start_batch_from,
                'end_batch_to'     => $request->end_batch_to,
                'created_by'       => auth()->id(),
            ]);

            if ($curriculum) {
                return redirect()->route('curriculums.index')->with('success', 'Curriculum created successfully.');
            }

            return redirect()->back()->with('error', 'Unable to create curriculum. Please try again!');

        } catch (Exception $e) {
            Log::error('Curriculum creation failed: ' . $e->getMessage());
            return redirect()->back()->with('error', 'An error occurred while creating curriculum.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Curriculum $curriculum)
    {
         return Inertia::render('curriculums/curriculum-form', [
            'curriculum' => [
            'id'                => $curriculum->id,
            'curriculum_code'   => $curriculum->curriculum_code,
            'curriculum_name'   => $curriculum->curriculum_name,
            'start_date'        => $curriculum->start_date?->format('Y-m-d'), 
            'start_batch_from'  => $curriculum->start_batch_from,
            'end_batch_to'      => $curriculum->end_batch_to,
        ],
        'isView' => true,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Curriculum $curriculum)
    {
         return Inertia::render('curriculums/curriculum-form', [
            'curriculum' => [
            'id'                => $curriculum->id,
            'curriculum_code'   => $curriculum->curriculum_code,
            'curriculum_name'   => $curriculum->curriculum_name,
            'start_date'        => $curriculum->start_date?->format('Y-m-d'), 
            'start_batch_from'  => $curriculum->start_batch_from,
            'end_batch_to'      => $curriculum->end_batch_to,
        ],
        'isEdit' => true,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CurriculumFormRequest $request, Curriculum $curriculum)
    {
        try {
            $curriculum->update([
                'curriculum_code'  => $request->curriculum_code,
                'curriculum_name'  => $request->curriculum_name,
                'start_date'       => $request->start_date,
                'start_batch_from' => $request->start_batch_from,
                'end_batch_to'     => $request->end_batch_to,
                'modified_by'      => auth()->id(),
            ]);

            return redirect()->route('curriculums.index')->with('success', 'Curriculum updated successfully.');

        } catch (Exception $e) {
            Log::error('Curriculum update failed: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Unable to update curriculum. Please try again!');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Curriculum $curriculum)
    {
          try {
            $curriculum->delete();
            return redirect()->back()->with('success', 'Curriculum deleted successfully.');

        } catch (Exception $e) {
            Log::error('Curriculum deletion failed: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Unable to delete curriculum. Please try again!');
        }
    }
}
