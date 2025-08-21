<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BatchFormRequest extends FormRequest
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
         
            'batch_name'    => 'required|string|max:100|unique:batches,batch_name,',
            'curriculum_id' => 'required|exists:curriculums,id',
            'start_date'    => 'required|date',
            'effective_date'=> 'nullable|date|after_or_equal:start_date',
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
            'batch_name.required'     => 'Please enter the batch name.',
            'batch_name.string'       => 'Batch name must be a string.',
            'batch_name.max'          => 'Batch name may not be greater than 100 characters.',
            'batch_name.unique'       => 'This batch name has already been taken.',
            
            'curriculum_id.required'  => 'Please select a curriculum.',
            'curriculum_id.exists'    => 'Selected curriculum does not exist.',

            'start_date.required'     => 'Please select the batch start date.',
            'start_date.date'         => 'Start date must be a valid date.',

            'effective_date.date'     => 'Effective date must be a valid date.',
            'effective_date.after_or_equal' => 'Effective date cannot be before the start date.',
        ];
    }
}
