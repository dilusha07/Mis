<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BatchSemModuleFormRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'module_id' => 'required|exists:modules,id',
            'module_prerequisites_id' => 'nullable|exists:module_prerequisites,id',
            'module_coordinator_id' => 'required|exists:employees,id',
            'lecture_id' => 'required|exists:employees,id',
            'batch_status_id' => 'required|exists:batch_statuses,id',
            'semester' => 'required|in:Semester 0,Semester 1,Semester 2,Semester 3,Semester 4,Semester 5,Semester 6,Semester 7,Semester 8,Semester 9',
            'module_type' => 'required|in:Core,General Elective,Technical Elective,Common Core',
            'gpa_applicability' => 'required|in:GPA,NON_GPA,GPA or NON_GPA',
            'allowed_for' => 'required|string|max:255',
        ];
    }

    /**
     * Custom validation messages.
     */
    public function messages(): array
    {
        return [
            'module_id.required' => 'Please select a module.',
            'module_id.exists' => 'The selected module is invalid.',
            'module_prerequisites_id.exists' => 'The selected module prerequisite is invalid.',
            'module_coordinator_id.required' => 'Please select a module coordinator.',
            'module_coordinator_id.exists' => 'The selected module coordinator is invalid.',
            'lecture_id.required' => 'Please select a lecture.',
            'lecture_id.exists' => 'The selected lecture is invalid.',
            'batch_status_id.required' => 'Please select a batch status.',
            'batch_status_id.exists' => 'The selected batch status is invalid.',
            'semester.required' => 'Please select a semester.',
            'semester.in' => 'The selected semester is invalid.',
            'module_type.required' => 'Please select a module type.',
            'module_type.in' => 'The selected module type is invalid.',
            'gpa_applicability.required' => 'Please select GPA applicability.',
            'gpa_applicability.in' => 'The selected GPA applicability is invalid.',
            'allowed_for.required' => 'Please enter the allowed programs or groups.',
            'allowed_for.max' => 'Allowed for field cannot exceed 255 characters.',
        ];
    }
}
