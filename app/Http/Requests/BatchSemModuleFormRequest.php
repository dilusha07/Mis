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
            'prerequisites' => 'nullable|array',
            'prerequisites.*' => 'nullable|integer|exists:modules,id',
            'module_coordinator_id' => 'required|exists:employees,id',
            'lecture_id' => 'required|exists:employees,id',
            'batch_status_id' => 'required|exists:batch_statuses,id',
            'gpa_applicability' => 'required|in:GPA,NON_GPA,GPA or NON_GPA',
            'offering_type' => 'required|in:PROPER,REPEAT,BOTH',
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
            'prerequisites.array' => 'The prerequisites must be an array.',
            'prerequisites.*.integer' => 'Each prerequisite must be a valid module ID.',
            'prerequisites.*.exists' => 'One or more selected prerequisite modules do not exist.',
            'module_coordinator_id.required' => 'Please select a module coordinator.',
            'module_coordinator_id.exists' => 'The selected module coordinator is invalid.',
            'lecture_id.required' => 'Please select a lecture.',
            'lecture_id.exists' => 'The selected lecture is invalid.',
            'batch_status_id.required' => 'Please select a batch status.',
            'batch_status_id.exists' => 'The selected batch status is invalid.',
            'gpa_applicability.required' => 'Please select GPA applicability.',
            'gpa_applicability.in' => 'The selected GPA applicability is invalid.',
            'offering_type.required' => 'Please select offering type.',
            'offering_type.in' => 'The selected offering type is invalid.',
        ];
    }
}
