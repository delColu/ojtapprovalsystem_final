<?php

namespace App\Http\Controllers;

use App\Models\Submission;
use App\Models\Folder;
use App\Models\User;
use App\Models\Notification;
use App\Models\ActivityLog;
use App\Mail\SubmissionStatusMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;

class SubmissionController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'folder_id'   => 'required|exists:folders,id',
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'file'        => 'nullable|file|max:10240',
            'date'        => 'required|date',
        ]);

        $filePath = $request->hasFile('file') ? $request->file('file')->store('submissions', 'public') : null;

        $submission = Submission::create([
            'student_id'  => Auth::id(),
            'folder_id'   => $request->folder_id,
            'title'       => $request->title,
            'description' => $request->description,
            'file_path'   => $filePath,
            'status'      => 'pending',
            'submitted_at'=> now(),
        ]);

        $folder = Folder::find($request->folder_id);

        Notification::create([
            'user_id' => $folder->supervisor_id,
            'title'   => 'New Submission',
            'message' => "Student submitted a new report: {$request->title}",
            'type'    => 'submission',
            'data'    => ['submission_id' => $submission->id],
        ]);

        ActivityLog::create([
            'user_id'    => Auth::id(),
            'action'     => 'submission_created',
            'status'     => 'success',
            'details'    => "Submitted report: {$request->title}",
            'ip_address' => $request->ip(),
        ]);

        return redirect()->route('dashboard')->with('success', 'Report submitted successfully!');
    }

    public function update(Request $request, Submission $submission)
    {
        if ($submission->student_id !== Auth::id() && !Auth::user()->isAdmin()) {
            abort(403);
        }

        $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $submission->update([
            'title'       => $request->title,
            'description' => $request->description,
            'status'      => 'pending',
        ]);

        return redirect()->back()->with('success', 'Report updated successfully!');
    }

    public function destroy(Submission $submission)
    {
        if ($submission->student_id !== Auth::id() && !Auth::user()->isAdmin()) {
            abort(403);
        }

        if ($submission->file_path) {
            Storage::disk('public')->delete($submission->file_path);
        }

        $submission->delete();

        return redirect()->back()->with('success', 'Report deleted successfully!');
    }

    public function approve(Request $request, Submission $submission)
    {
        $user = Auth::user();

        if ($user->isSupervisor() && $submission->folder->supervisor_id === $user->id) {
            $submission->update([
                'status'        => 'approved',
                'supervisor_id' => $user->id,
                'approved_at'   => now(),
                'feedback'      => $request->feedback,
            ]);

            Mail::to($submission->student->email)->send(new SubmissionStatusMail($submission, 'approved'));
        } elseif ($user->isDean()) {
            $submission->update([
                'status' => 'forwarded',
                'dean_id'=> $user->id,
            ]);
        } else {
            abort(403);
        }

        Notification::create([
            'user_id' => $submission->student_id,
            'title'   => 'Submission ' . ucfirst($submission->status),
            'message' => "Your report '{$submission->title}' has been {$submission->status}",
            'type'    => 'status_update',
            'data'    => ['submission_id' => $submission->id],
        ]);

        ActivityLog::create([
            'user_id'    => $user->id,
            'action'     => 'submission_approved',
            'status'     => 'success',
            'details'    => "Approved submission: {$submission->title}",
            'ip_address' => $request->ip(),
        ]);

        return redirect()->back()->with('success', 'Submission approved successfully!');
    }

    public function reject(Request $request, Submission $submission)
    {
        $request->validate(['feedback' => 'required|string']);

        $submission->update([
            'status'      => 'rejected',
            'rejected_at' => now(),
            'feedback'    => $request->feedback,
        ]);

        Mail::to($submission->student->email)->send(new SubmissionStatusMail($submission, 'rejected'));

        Notification::create([
            'user_id' => $submission->student_id,
            'title'   => 'Submission Rejected',
            'message' => "Your report '{$submission->title}' was rejected. Feedback: {$request->feedback}",
            'type'    => 'status_update',
            'data'    => ['submission_id' => $submission->id],
        ]);

        ActivityLog::create([
            'user_id'    => Auth::id(),
            'action'     => 'submission_rejected',
            'status'     => 'success',
            'details'    => "Rejected submission: {$submission->title}",
            'ip_address' => $request->ip(),
        ]);

        return redirect()->back()->with('success', 'Submission rejected with feedback.');
    }

    public function downloadPdf(Submission $submission)
    {
        $pdf = Pdf::loadView('pdf.submission', compact('submission'));
        return $pdf->download("submission-{$submission->id}.pdf");
    }

    public function show(Submission $submission)
    {
        $submission->load(['student', 'folder', 'supervisor', 'dean']);

        if (auth()->user()->isStudent() && $submission->student_id !== auth()->id()) {
            abort(403);
        }

        return inertia('Submissions/Show', compact('submission'));
    }
}
