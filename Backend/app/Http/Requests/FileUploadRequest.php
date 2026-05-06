<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;

class FileUploadRequest extends FormRequest
{
    public function authorize() { return true; }
    public function rules() {
        return [
            'file' => 'required|file|max:51200',
            'type' => 'required|in:SocialData,Webview,Code,Binary',
            'project_id' => 'nullable|exists:projects,id',
        ];
    }
}
