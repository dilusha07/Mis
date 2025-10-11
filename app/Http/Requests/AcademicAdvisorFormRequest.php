<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AcademicAdvisorFormRequest extends FormRequest
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
            'student_id' => 'required|string|exists:students,id',
            'advisor_id' => 'required|integer|exists:employees,id',
        ];
    }

    /**
     * Custom validation messages.
     */
    public function messages(): array
    {
        return [
            'student_id.required' => 'Please select a student.',
            'student_id.exists' => 'The selected student does not exist.',
            'advisor_id.required' => 'Please select an academic advisor.',
            'advisor_id.exists' => 'The selected academic advisor does not exist.',
        ];
    }
}
