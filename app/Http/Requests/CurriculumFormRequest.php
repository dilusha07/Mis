<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CurriculumFormRequest extends FormRequest
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

            'curriculum_code'   => 'required|string|max:50|unique:curriculums,curriculum_code,' . $this->curriculum?->id,
            'curriculum_name'   => 'required|string|max:150',
            'start_date'        => 'required|date',
            'start_batch_from'  => 'required|integer|min:1',
            'end_batch_to'      => 'nullable|integer|min:1|gte:start_batch_from',
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
            'curriculum_code.required' => 'Please enter the curriculum code.',
            'curriculum_code.string'   => 'The curriculum code must be a string.',
            'curriculum_code.max'      => 'The curriculum code may not be greater than 50 characters.',
            'curriculum_code.unique'   => 'This curriculum code has already been taken.',

            'curriculum_name.required' => 'Please enter the curriculum name.',
            'curriculum_name.string'   => 'The curriculum name must be a string.',

            'start_date.required'      => 'Please select the curriculum start date.',
            'start_date.date'          => 'The start date must be a valid date.',

            'start_batch_from.required'=> 'Please enter the starting batch year.',
            'start_batch_from.integer' => 'The starting batch year must be a number.',
            'start_batch_from.min'     => 'The starting batch year must be at least 1.',
           
            'end_batch_to.integer'     => 'The ending batch year must be a number.',
            'end_batch_to.min'         => 'The ending batch year must be at least 1.',
            'end_batch_to.gte'         => 'The ending batch year must be greater than or equal to the starting batch year.',
        ];
    }
}
