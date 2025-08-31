<?php

namespace App\Http\Controllers;

use App\Models\StuModuleRegister;
use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\BatchSemModule;
use App\Models\StudentStatus;
use App\Models\BatchStatus;
use App\Models\Batch;
use Inertia\Inertia;

class StuModuleRegisterController extends Controller
{

    /**
     * Register a student for a module.
     */
    public function register(Request $request)
    { 
        $request->validate([
            'student_id'=>'required',
            'module_id'=>'required',
        ]);

        $studentId = $request->input('student_id');
        $moduleId = $request->input('module_id');

        //Find the batch_sem_module_id based on student's batch and module_id
        $student = Student::where('student_id', $studentId)->firstOrFail();
        $batchId = $student->status->batch_id;
        $batchSemModule = BatchSemModule::where('batch_status_id', $batchId)
                            ->where('module_id', $moduleId)
                            ->first();
        if (!$batchSemModule) {
            return back()->with('error', 'Batch-semester-module not found.');
        }

        // Check if the student has already registered for the module
        $existingRegistration = StuModuleRegister::where('student_id', $studentId)
                                    ->where('module_id', $moduleId)
                                    ->exists();
        if ($existingRegistration) {
            return back()->with('error', 'Student has already registered for this module.');
    }

    StuModuleRegister::create([
        'student_id' => $studentId,
        'batch_sem_module_id' => $batchSemModule->id,
        'module_id' => $moduleId,        
        'reg_status' => 'registered',         
        'created_by' => auth()->id() ?? 1,
        'modified_by' => auth()->id() ?? 1,
    ]);
    return back()->with('success', 'Module registered successfully.');
 }


    /**
     * Display a listing of the resource and search by student number .
     */
    public function index(Request $request)
    {
        $studentNo = $request->input('search');
        $modules = [];
        $studentDetails = null;
        if ($studentNo) {
            $student = Student::where('student_id', $studentNo)->first();
            if ($student) {
                //Use hasOne relationship to get student status
                $status = $student->status;
                if($status) {
                    $batchId = $status->batch_id;
                    $semester = $status->semester;
                    //Get batch name
                    $batch = Batch::find($batchId);
                    $studentDetails = [
                        'name' => $student->name,
                        'student_id' => $student->student_id,
                        'batch_id' => $batchId,
                        'batch_name' => $batch ? $batch->batch_name : '',
                        'semester' => $semester,
                    ];
                    //Find batch_status_id for the batch and semester
                    $batchStatus = BatchStatus::where('batch_id', $batchId)
                                    ->where('semester', $semester)
                                    ->orderByDesc('created_at')->first();
                    if ($batchStatus) {
                        $batchSemModules = BatchSemModule::where('batch_status_id', $batchStatus->id)
                                            ->with('module')
                                            ->get();
                        $registered = StuModuleRegister::where('student_id', $studentNo)
                                            ->pluck('module_id')
                                            ->toArray();
                        $modules = $batchSemModules->filter(function($bsm) {
                            return $bsm->module !== null;
                        })->map(function($bsm) use ($registered) {
                            return [
                                'id' => $bsm->module->id,
                                'module_code' => $bsm->module->module_code,
                                'module_name' => $bsm->module->module_name,
                                'credits' => $bsm->module->credits,
                                'status' => in_array($bsm->module->id, $registered) ? 'Registered' : 'Not Registered',
                            ];
                        });
                } 
            }
             else {
                    return back()->with('error', 'No status found for the student.');
                }
            }
        }
        return Inertia::render('stu-module-registers/index', [
           'modules' => $modules,
            'filters' => [ 'search' => $studentNo ],
            'student' => $studentDetails,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(StuModuleRegister $stuModuleRegister)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(StuModuleRegister $stuModuleRegister)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, StuModuleRegister $stuModuleRegister)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StuModuleRegister $stuModuleRegister)
    {
        //
    }
}

