<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AcademicYearFormRequest extends FormRequest
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
        'academic_year' => 'required|string|max:191|unique:academic_years,academic_year,' ,
        'year_begin'    => 'required|date',
        'year_end'      => 'required|date|after:year_begin',
        'status'        => 'required|in:0,1,2',
        'curriculum_id' => 'required|exists:curriculums,id',
    ];
    }

    /**
     * Custom error messages for validation.
     *
     * @return array
     */
    public function messages(): array
    {
         return [
            'academic_year.required' => 'Please enter the academic year (e.g., 2024-2025).',
            'academic_year.unique'   => 'This academic year already exists.',

            'year_begin.required'    => 'Please select the starting date.',
            'year_end.required'      => 'Please select the ending date.',
            'year_end.after'         => 'The ending date must be after the starting date.',

            'status.required'        => 'Please select the status.',
            'curriculum_id.required' => 'Please select a curriculum.',
        ];
    }
}
