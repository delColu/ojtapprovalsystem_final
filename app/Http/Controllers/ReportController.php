<?php

namespace App\Http\Controllers;

use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function myReports()
    {
        $user = Auth::user();

        $reports = Submission::where('student_id', $user->id)
            ->with('folder')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($submission) {
                return [
                    'id' => $submission->id,
                    'title' => $submission->title,
                    'description' => $submission->description,
                    'status' => $submission->status,
                    'folder_name' => $submission->folder->name ?? 'No Folder',
                    'submitted_at' => $submission->created_at->format('Y-m-d H:i'),
                    'file_path' => $submission->file_path,
                    'feedback' => $submission->feedback,
                ];
            });

        $stats = [
            'total' => $reports->count(),
            'pending' => $reports->where('status', 'pending')->count(),
            'approved' => $reports->where('status', 'approved')->count(),
            'rejected' => $reports->where('status', 'rejected')->count(),
        ];

        return Inertia::render('Student/MyReports', [
            'reports' => $reports,
            'stats' => $stats
        ]);
    }
}
