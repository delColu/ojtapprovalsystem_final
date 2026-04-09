<?php

namespace App\Http\Controllers;

use App\Mail\SubmissionStatusMail;
use App\Models\ActivityLog;
use App\Models\Department;
use App\Models\Folder;
use App\Models\Notification;
use App\Models\Submission;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class SubmissionController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'folder_id' => 'required|exists:folders,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'date' => 'nullable|date',
            'file' => 'nullable|file|max:10240',
        ]);

        $folder = Folder::query()->findOrFail($request->integer('folder_id'));
        $uploadedFile = $request->file('file');
        $filePath = $uploadedFile ? $uploadedFile->store('submissions', 'public') : null;
        $fileName = $uploadedFile ? $uploadedFile->getClientOriginalName() : null;

        $submission = Submission::create([
            'student_id' => Auth::id(),
            'folder_id' => $folder->id,
            'title' => $request->title,
            'description' => $request->description,
            'file_path' => $filePath,
            'file_name' => $fileName,
            'status' => 'pending',
            'submitted_at' => $request->date('date') ?? now(),
            'feedback' => null,
            'supervisor_feedback' => null,
            'dean_feedback' => null,
            'supervisor_id' => null,
            'dean_id' => null,
            'approved_at' => null,
            'rejected_at' => null,
            'supervisor_approved_at' => null,
            'forwarded_to_dean_at' => null,
            'dean_reviewed_at' => null,
        ]);

        Notification::create([
            'user_id' => $folder->supervisor_id,
            'title' => 'New Submission',
            'message' => "Student submitted a new report: {$request->title}",
            'type' => 'submission',
            'data' => ['submission_id' => $submission->id],
        ]);

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'submission_created',
            'status' => 'success',
            'details' => "Submitted report: {$request->title}",
            'ip_address' => $request->ip(),
        ]);

        return redirect()->back()->with('success', 'Report submitted successfully.');
    }

    public function update(Request $request, Submission $submission)
    {
        if ($submission->student_id !== Auth::id() && ! Auth::user()->isAdmin()) {
            abort(403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'file' => 'nullable|file|max:10240',
            'date' => 'nullable|date',
        ]);

        if ($request->hasFile('file')) {
            if ($submission->file_path) {
                Storage::disk('public')->delete($submission->file_path);
            }

            $uploadedFile = $request->file('file');
            $submission->file_path = $uploadedFile->store('submissions', 'public');
            $submission->file_name = $uploadedFile->getClientOriginalName();
        }

        $submission->fill([
            'title' => $request->title,
            'description' => $request->description,
            'status' => 'pending',
            'submitted_at' => $request->date('date') ?? $submission->submitted_at ?? now(),
            'feedback' => null,
            'supervisor_feedback' => null,
            'dean_feedback' => null,
            'supervisor_id' => null,
            'dean_id' => null,
            'approved_at' => null,
            'rejected_at' => null,
            'supervisor_approved_at' => null,
            'forwarded_to_dean_at' => null,
            'dean_reviewed_at' => null,
        ])->save();

        return redirect()->back()->with('success', 'Report updated successfully.');
    }

    public function destroy(Submission $submission)
    {
        $user = Auth::user();
        $canDeleteAsSupervisor = $user->isSupervisor() && $submission->folder?->supervisor_id === $user->id;
        $canDeleteAsDean = $user->isDean() && $this->deanCanAccessSubmission($user, $submission);

        if ($submission->student_id !== Auth::id() && ! $user->isAdmin() && ! $canDeleteAsSupervisor && ! $canDeleteAsDean) {
            abort(403);
        }

        if ($submission->file_path) {
            Storage::disk('public')->delete($submission->file_path);
        }

        $submission->delete();

        return redirect()->back()->with('success', 'Report deleted successfully.');
    }

    public function approve(Request $request, Submission $submission)
    {
        $request->validate(['feedback' => 'required|string']);

        $user = Auth::user();
        $submission->loadMissing(['student', 'folder', 'supervisor', 'dean']);

        if ($user->isSupervisor()) {
            abort_unless($submission->folder?->supervisor_id === $user->id, 403);

            $submission->update([
                'status' => 'approved',
                'supervisor_id' => $user->id,
                'feedback' => $request->feedback,
                'supervisor_feedback' => $request->feedback,
                'rejected_at' => null,
                'approved_at' => now(),
                'supervisor_approved_at' => now(),
            ]);

            $this->notifyStudent($submission, 'Submission Approved by Supervisor', "Your report '{$submission->title}' was approved by {$user->name}.");
            Mail::to($submission->student->email)->queue(new SubmissionStatusMail($submission->fresh(['student', 'supervisor', 'dean']), 'approved_by_supervisor'));

            ActivityLog::create([
                'user_id' => $user->id,
                'action' => 'submission_approved',
                'status' => 'success',
                'details' => "Supervisor approved submission: {$submission->title}",
                'ip_address' => $request->ip(),
            ]);

            return redirect()->back()->with('success', 'Submission approved. The student has been notified by email.');
        }

        abort_unless($user->isDean(), 403);
        abort_unless($this->deanCanAccessSubmission($user, $submission), 403);
        abort_unless($submission->status === 'forwarded', 422, 'Only forwarded submissions can be reviewed by the dean.');

        $submission->update([
            'status' => 'approved',
            'dean_id' => $user->id,
            'feedback' => $request->feedback,
            'dean_feedback' => $request->feedback,
            'approved_at' => now(),
            'dean_reviewed_at' => now(),
            'rejected_at' => null,
        ]);

        $this->notifyStudent($submission, 'Submission Approved by Dean', "Your report '{$submission->title}' was approved by Dean {$user->name}.");
        Mail::to($submission->student->email)->queue(new SubmissionStatusMail($submission->fresh(['student', 'supervisor', 'dean']), 'approved_by_dean'));

        ActivityLog::create([
            'user_id' => $user->id,
            'action' => 'submission_approved',
            'status' => 'success',
            'details' => "Dean approved submission: {$submission->title}",
            'ip_address' => $request->ip(),
        ]);

        return redirect()->back()->with('success', 'Submission approved. The student has been notified by email.');
    }

    public function reject(Request $request, Submission $submission)
    {
        $request->validate(['feedback' => 'required|string']);

        $user = Auth::user();
        $submission->loadMissing(['student', 'folder', 'supervisor', 'dean']);

        if ($user->isDean()) {
            abort_unless($this->deanCanAccessSubmission($user, $submission), 403);
        } elseif ($user->isSupervisor()) {
            abort_unless($submission->folder?->supervisor_id === $user->id, 403);
        } else {
            abort(403);
        }

        $payload = [
            'status' => 'rejected',
            'feedback' => $request->feedback,
            'rejected_at' => now(),
        ];

        if ($user->isSupervisor()) {
            $payload['supervisor_id'] = $user->id;
            $payload['supervisor_feedback'] = $request->feedback;
        }

        if ($user->isDean()) {
            $payload['dean_id'] = $user->id;
            $payload['dean_feedback'] = $request->feedback;
            $payload['dean_reviewed_at'] = now();
        }

        $submission->update($payload);

        $title = $user->isDean() ? 'Submission Rejected by Dean' : 'Submission Rejected by Supervisor';
        $this->notifyStudent($submission, $title, "Your report '{$submission->title}' was rejected. Feedback: {$request->feedback}");
        Mail::to($submission->student->email)->queue(new SubmissionStatusMail($submission->fresh(['student', 'supervisor', 'dean']), $user->isDean() ? 'rejected_by_dean' : 'rejected_by_supervisor'));

        ActivityLog::create([
            'user_id' => $user->id,
            'action' => 'submission_rejected',
            'status' => 'success',
            'details' => "Rejected submission: {$submission->title}",
            'ip_address' => $request->ip(),
        ]);

        return redirect()->back()->with('success', 'Submission rejected and email sent to the student.');
    }

    public function submitToDean(Request $request, Submission $submission)
    {
        abort_unless(Auth::user()->isStudent() && $submission->student_id === Auth::id(), 403);
        abort_unless($submission->status === 'approved' && $submission->supervisor_approved_at !== null, 422, 'Only supervisor-approved submissions can be forwarded.');

        $submission->update([
            'status' => 'forwarded',
            'forwarded_to_dean_at' => now(),
        ]);

        $deanIds = Department::query()
            ->where('id', $submission->student?->department_id)
            ->whereNotNull('dean_id')
            ->pluck('dean_id')
            ->filter()
            ->unique()
            ->values();

        if ($deanIds->isEmpty() && $this->isCastStudentSubmission($submission)) {
            $deanIds = User::query()
                ->where('role', 'dean')
                ->get()
                ->filter(function (User $dean) {
                    $department = strtolower((string) $dean->department);

                    return str_contains($department, 'arts')
                        || str_contains($department, 'sciences')
                        || str_contains($department, 'technology')
                        || $department === 'cast';
                })
                ->pluck('id')
                ->filter()
                ->unique()
                ->values();
        }

        foreach ($deanIds as $deanId) {
            Notification::create([
                'user_id' => $deanId,
                'title' => 'Submission Forwarded to Dean',
                'message' => "{$submission->student?->name} forwarded '{$submission->title}' for dean review after supervisor approval.",
                'type' => 'submission_forwarded',
                'data' => ['submission_id' => $submission->id],
                'is_read' => false,
            ]);
        }

        return redirect()->back()->with('success', 'Report sent to the dean for final review.');
    }

    public function downloadPdf(Submission $submission)
    {
        $this->authorizeSubmissionAccess($submission);
        $submission->load(['student', 'folder', 'supervisor', 'dean']);

        $pdf = Pdf::loadView('pdf.submission', compact('submission'));

        return $pdf->download("submission-{$submission->id}.pdf");
    }

    public function viewFile(Submission $submission)
    {
        $this->authorizeSubmissionAccess($submission);
        abort_unless($submission->file_path, 404);

        $disk = Storage::disk('public');
        abort_unless($disk->exists($submission->file_path), 404);

        $absolutePath = $disk->path($submission->file_path);
        $filename = $submission->file_name ?: basename($submission->file_path);
        $mimeType = $disk->mimeType($submission->file_path) ?: 'application/octet-stream';

        return response()->file($absolutePath, [
            'Content-Type' => $mimeType,
            'Content-Disposition' => 'inline; filename="'.$filename.'"',
        ]);
    }

    public function downloadFile(Submission $submission)
    {
        $this->authorizeSubmissionAccess($submission);
        abort_unless($submission->file_path, 404);

        return Storage::disk('public')->download($submission->file_path, $submission->file_name ?: basename($submission->file_path));
    }

    public function show(Submission $submission)
    {
        $submission->load(['student', 'folder', 'supervisor', 'dean']);
        $this->authorizeSubmissionAccess($submission);

        return inertia('Submissions/Show', compact('submission'));
    }

    private function authorizeSubmissionAccess(Submission $submission): void
    {
        $user = auth()->user();

        if ($user->isStudent() && $submission->student_id !== $user->id) {
            abort(403);
        }

        if ($user->isSupervisor() && $submission->folder?->supervisor_id !== $user->id) {
            abort(403);
        }

        if ($user->isDean() && ! $this->deanCanAccessSubmission($user, $submission)) {
            abort(403);
        }
    }

    private function notifyStudent(Submission $submission, string $title, string $message): void
    {
        Notification::create([
            'user_id' => $submission->student_id,
            'title' => $title,
            'message' => $message,
            'type' => 'status_update',
            'data' => ['submission_id' => $submission->id],
        ]);
    }

    private function deanCanAccessSubmission($dean, Submission $submission): bool
    {
        $departmentIds = Department::query()
            ->where('dean_id', $dean->id)
            ->pluck('id');

        if ($departmentIds->isEmpty()) {
            $department = strtolower((string) $dean->department);

            if (str_contains($department, 'arts') || str_contains($department, 'sciences') || str_contains($department, 'technology') || $department === 'cast') {
                $departmentIds = Department::query()->where('name', 'CAST')->pluck('id');
            }
        }

        return $departmentIds->contains($submission->student?->department_id);
    }

    private function isCastStudentSubmission(Submission $submission): bool
    {
        $departmentName = $submission->student?->departmentRecord?->name ?? $submission->student?->department;

        return strtoupper((string) $departmentName) === 'CAST';
    }
}
