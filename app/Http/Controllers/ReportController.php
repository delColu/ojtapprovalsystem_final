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
            ->with(['folder', 'supervisor', 'dean'])
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
                    'file_name' => $submission->file_name ?: ($submission->file_path ? basename($submission->file_path) : null),
                    'feedback' => $submission->feedback,
                    'supervisor_feedback' => $submission->supervisor_feedback,
                    'dean_feedback' => $submission->dean_feedback,
                    'supervisor_name' => $submission->supervisor?->name,
                    'dean_name' => $submission->dean?->name,
                    'supervisor_approved_at' => optional($submission->supervisor_approved_at)->format('Y-m-d H:i'),
                    'forwarded_to_dean_at' => optional($submission->forwarded_to_dean_at)->format('Y-m-d H:i'),
                    'dean_reviewed_at' => optional($submission->dean_reviewed_at)->format('Y-m-d H:i'),
                    'can_edit' => in_array($submission->status, ['pending', 'rejected'], true),
                    'can_submit_to_dean' => $submission->status === 'approved' && $submission->forwarded_to_dean_at === null,
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
