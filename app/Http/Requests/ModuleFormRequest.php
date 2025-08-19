<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ModuleFormRequest extends FormRequest
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
            'module_name'    => 'required|string|max:255',
            'module_code'    => 'required|string|max:100',
            'module_details' => 'nullable|string',
            'credits'        => 'required|integer|min:0',
        ];
    }

    /**
     * Custom validation messages.
     */
    public function messages(): array
    {
        return [
            'module_name.required' => 'Please enter the module name.',
            'module_code.required' => 'Please enter the module code.',
            'credits.required'     => 'Please enter the number of credits.',
            'credits.integer'      => 'Credits must be an integer.',
            'credits.min'          => 'Credits cannot be negative.',
        ];
    }
}


