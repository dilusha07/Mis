<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ExamPlanFormRequest extends FormRequest
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
            'first_examiner_id' => 'required|exists:employees,id',
            'second_examiner_id' => 'required|exists:employees,id|different:first_examiner_id',
            'department_id' => 'required|exists:departments,id',
            'module_id' => 'required|exists:modules,id',
            'final_marks' => 'nullable|array',
            'final_marks.*.name' => 'nullable|string|max:255',
            'final_marks.*.marks' => 'nullable|numeric|min:0|max:100',
            'mid_marks' => 'nullable|array',
            'mid_marks.*.name' => 'nullable|string|max:255',
            'mid_marks.*.marks' => 'nullable|numeric|min:0|max:100',
            'ca_marks' => 'nullable|array',
            'ca_marks.*.name' => 'nullable|string|max:255',
            'ca_marks.*.marks' => 'nullable|numeric|min:0|max:100',
            'other_marks' => 'nullable|array',
            'other_marks.*.name' => 'nullable|string|max:255',
            'other_marks.*.marks' => 'nullable|numeric|min:0|max:100',
        ];
    }

    /**
     * Custom validation messages.
     */
    public function messages(): array
    {
        return [
            'first_examiner_id.required' => 'Please select the first examiner.',
            'first_examiner_id.exists' => 'The selected first examiner is invalid.',
            'second_examiner_id.required' => 'Please select the second examiner.',
            'second_examiner_id.exists' => 'The selected second examiner is invalid.',
            'second_examiner_id.different' => 'The second examiner must be different from the first examiner.',
            'department_id.required' => 'Please select a department.',
            'department_id.exists' => 'The selected department is invalid.',
            'module_id.required' => 'Please select a module.',
            'module_id.exists' => 'The selected module is invalid.',
        ];
    }
}
