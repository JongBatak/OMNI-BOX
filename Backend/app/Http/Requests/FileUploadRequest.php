<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;

class FileUploadRequest extends FormRequest
{
    public function authorize() { return true; }
    public function rules() {
        return [
            'file' => 'required|file|max:1048576',
            'type' => 'required|string',
            'project_id' => 'nullable|exists:projects,id',
        ];
    }
}
