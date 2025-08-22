<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BatchStatusFormRequest extends FormRequest
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
            'batch_id'        => 'required|exists:batches,id',
            'degree_year'     => 'required|in:1st Year,2nd Year,3rd Year,4th Year',
            'semester'        => 'required|in:Semester 0,Semester 1,Semester 2,Semester 3,Semester 4,Semester 5,Semester 6,Semester 7,Semester 8,Semester 9',
            'acc_year_id'     => 'required|exists:academic_years,id',
            'status'          => 'required|in:0,1',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */

    public function messages(): array
    {
         return [
            'batch_id.required'       => 'Please select a batch.',
            'batch_id.exists'         => 'Selected batch does not exist.',

            'degree_year.required'    => 'Please select the degree year.',
            'degree_year.in'          => 'Invalid degree year.',

            'semester.required'       => 'Please select a semester.',
            'semester.in'             => 'Invalid semester.',

            'acc_year_id.required'    => 'Please select an academic year.',
            'acc_year_id.exists'      => 'Selected academic year does not exist.',

            'status.required'         => 'Please select the status.',
            'status.in'               => 'Invalid status value.',
        ];
    }
}
