<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ExamAdmissionFormRequest extends FormRequest
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
            'batch_sem_module_id' => 'required|exists:batch_sem_modules,id',
            'exam_date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'venue' => 'required|string|max:255',
            'student_group' => 'required|string|max:255',
        ];
    }

    /**
     * Custom validation messages.
     */
    public function messages(): array
    {
        return [
            'batch_sem_module_id.required' => 'Please select a batch semester module.',
            'batch_sem_module_id.exists' => 'The selected batch semester module is invalid.',
            'exam_date.required' => 'Please select the exam date.',
            'exam_date.date' => 'Please enter a valid exam date.',
            'start_time.required' => 'Please select the start time.',
            'start_time.date_format' => 'Please enter a valid start time.',
            'end_time.required' => 'Please select the end time.',
            'end_time.date_format' => 'Please enter a valid end time.',
            'end_time.after' => 'End time must be after start time.',
            'venue.required' => 'Please enter the exam venue.',
            'student_group.required' => 'Please enter the student group.',
        ];
    }
}
