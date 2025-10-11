<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ModulePrerequisiteFormRequest extends FormRequest
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
            'module_id' => [
                'required',
                'exists:modules,id',
            ],
            'pre_module_ids' => [
                'required',
                'array',
            ],
            'pre_module_ids.*' => [
                'integer',
                'exists:modules,id',
                'different:module_id',
            ],
            'curriculum_id' => 'required|exists:curriculums,id',
        ];
    }

    /**
     * Custom validation messages.
     */
    public function messages(): array
    {
        return [
            'module_id.required' => 'Please select a module.',
            'module_id.exists' => 'The selected module does not exist.',
            'pre_module_ids.required' => 'Please select at least one prerequisite module.',
            'pre_module_ids.array' => 'Prerequisites must be an array of module IDs.',
            'pre_module_ids.*.exists' => 'One or more selected prerequisite modules do not exist.',
            'pre_module_ids.*.different' => 'A module cannot be a prerequisite for itself.',
            'curriculum_id.required' => 'Please select a curriculum.',
            'curriculum_id.exists' => 'The selected curriculum does not exist.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'module_id' => 'module',
            'pre_module_ids' => 'prerequisite modules',
            'curriculum_id' => 'curriculum',
        ];
    }
}
