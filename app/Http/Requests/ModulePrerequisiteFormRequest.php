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
        $prerequisiteId = $this->route('prerequisite')?->id;
        
        return [
            'module_id' => [
                'required',
                'exists:modules,id',
                Rule::unique('module_prerequisites')->where(function ($query) {
                    return $query->where('pre_module_id', $this->pre_module_id)
                                ->where('curriculum_id', $this->curriculum_id);
                })->ignore($prerequisiteId),
            ],
            'pre_module_id' => [
                'required',
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
            'module_id.unique' => 'This prerequisite relationship already exists.',
            'pre_module_id.required' => 'Please select a prerequisite module.',
            'pre_module_id.exists' => 'The selected prerequisite module does not exist.',
            'pre_module_id.different' => 'A module cannot be a prerequisite for itself.',
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
            'pre_module_id' => 'prerequisite module',
            'curriculum_id' => 'curriculum',
        ];
    }
}
