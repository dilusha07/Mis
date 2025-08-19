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
            'academic_year_code' => 'required|string|max:50|unique:academic_years,academic_year_code,' . $this->academicYear?->id,
            'academic_year_name' => 'required|string|max:150',
            'start_date'         => 'required|date',
            'end_date'           => 'required|date|after_or_equal:start_date',
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
            'academic_year_code.required' => 'Please enter the academic year code.',
            'academic_year_code.string'   => 'The academic year code must be a string.',
            'academic_year_code.max'      => 'The academic year code may not exceed 50 characters.',
            'academic_year_code.unique'   => 'This academic year code has already been taken.',

            'academic_year_name.required' => 'Please enter the academic year name.',
            'academic_year_name.string'   => 'The academic year name must be a string.',

            'start_date.required'         => 'Please select the start date.',
            'start_date.date'             => 'The start date must be a valid date.',

            'end_date.required'           => 'Please select the end date.',
            'end_date.date'               => 'The end date must be a valid date.',
            'end_date.after_or_equal'     => 'The end date must be after or equal to the start date.',
        ];
    }
}
