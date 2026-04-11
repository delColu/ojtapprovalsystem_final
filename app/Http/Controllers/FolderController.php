<?php

namespace App\Http\Controllers;

use App\Models\Folder;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;

class FolderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        abort_unless($user?->isSupervisor() || $user?->isStudent(), 403);

        if ($user->isStudent()) {
            $folders = Folder::query()
                ->whereHas('supervisor', function ($query) use ($user) {
                    $query->where('department_id', $user->department_id)
                          ->where('company_id', $user->company_id);
                })
                ->where(function ($query) {
                    $query->whereNull('due_date')
                        ->orWhereDate('due_date', '>=', today());
                })
                ->orWhere(function ($query) {
                    $query->whereNotNull('due_date')
                        ->whereDate('due_date', '<', today())
                        ->where('is_reopened', true);
                })
                ->with(['supervisor'])
                ->latest()
                ->get()
                ->map(function (Folder $folder) {
                    return [
                        'id' => $folder->id,
                        'name' => $folder->name,
                        'description' => $folder->description,
                        'due_date' => optional($folder->due_date)?->format('Y-m-d'),
                        'supervisor_name' => $folder->supervisor?->name ?? 'Unknown',
                        'is_reopened' => $folder->is_reopened,
                    ];
                })
                ->values();

            return Inertia::render('Student/Folders', compact('folders'));
        }

        $folders = Folder::where('supervisor_id', $user->id)
            ->withCount('submissions')
            ->latest()
            ->paginate(10);

        return Inertia::render('Folders/Index', compact('folders'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        abort_unless(Auth::user()?->isSupervisor(), 403);
        return Inertia::render('Folders/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        abort_unless(Auth::user()?->isSupervisor(), 403);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'due_date' => ['nullable', 'date'],
        ]);

        $folder = Folder::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'due_date' => $validated['due_date'] ?? null,
            'supervisor_id' => Auth::id(),
            'is_reopened' => false,
            'reopened_at' => null,
        ]);

$students = User::where('role', 'student')
                ->where('department_id', $folder->supervisor->department_id)
                ->where('company_id', $folder->supervisor->company_id)
                ->get();

        foreach ($students as $student) {
            Notification::create([
                'user_id' => $student->id,
                'title' => 'New Folder Available',
                'type' => 'folder_created',
                'message' => "New folder '{$folder->name}' has been created by your supervisor",
                'data' => ['folder_id' => $folder->id],
                'is_read' => false,
            ]);
        }

        return redirect()->route('supervisor.tasks')->with('success', 'Folder created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Folder $folder)
    {
        $this->authorizeFolder($folder);
        return Inertia::render('Folders/Show', compact('folder'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Folder $folder)
    {
        $this->authorizeFolder($folder);
        return Inertia::render('Folders/Edit', compact('folder'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Folder $folder)
    {
        $this->authorizeFolder($folder);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'due_date' => ['nullable', 'date'],
        ]);

        $originalName = $folder->name;
        $oldDueDate = optional($folder->due_date)?->format('Y-m-d');
        $newDueDate = $validated['due_date'] ?? null;

        $payload = $validated;

        // Once a reopened folder gets a new deadline, it goes back to normal deadline-based closing.
        if ($folder->is_reopened && $newDueDate !== $oldDueDate && $newDueDate !== null) {
            $parsedDueDate = Carbon::parse($newDueDate);

            if ($parsedDueDate->greaterThanOrEqualTo(today())) {
                $payload['is_reopened'] = false;
                $payload['reopened_at'] = null;
            }
        }

        $folder->update($payload);

$students = User::where('role', 'student')
                ->where('department_id', $folder->supervisor->department_id)
                ->where('company_id', $folder->supervisor->company_id)
                ->get();

        foreach ($students as $student) {
            Notification::create([
                'user_id' => $student->id,
                'title' => 'Folder Updated',
                'type' => 'folder_updated',
                'message' => "Folder '{$originalName}' was updated by your supervisor.",
                'data' => [
                    'folder_id' => $folder->id,
                    'folder_name' => $folder->name,
                ],
                'is_read' => false,
            ]);
        }

        return redirect()->route('supervisor.tasks')->with('success', 'Folder updated successfully!');
    }

    public function toggleReopen(Folder $folder)
    {
        $this->authorizeFolder($folder);

        abort_if(! $folder->due_date || ! $folder->due_date->lt(today()), 422, 'Only closed folders can be reopened.');

        $folder->update([
            'is_reopened' => true,
            'reopened_at' => now(),
        ]);

$students = User::where('role', 'student')
                ->where('department_id', $folder->supervisor->department_id)
                ->where('company_id', $folder->supervisor->company_id)
                ->get();
        $title = 'Folder Reopened';
        $message = "Folder '{$folder->name}' was reopened by your supervisor and is available for submission again.";

        foreach ($students as $student) {
            Notification::create([
                'user_id' => $student->id,
                'title' => $title,
                'type' => 'folder_reopened',
                'message' => $message,
                'data' => [
                    'folder_id' => $folder->id,
                    'folder_name' => $folder->name,
                ],
                'is_read' => false,
            ]);
        }

        return redirect()->route('supervisor.tasks')->with('success', 'Folder reopened successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Folder $folder)
    {
        $this->authorizeFolder($folder);

        $folderName = $folder->name;
        $folderId = $folder->id;

$students = User::where('role', 'student')
                ->where('department_id', $folder->supervisor->department_id)
                ->where('company_id', $folder->supervisor->company_id)
                ->get();

        foreach ($students as $student) {
            Notification::create([
                'user_id' => $student->id,
                'title' => 'Folder Deleted',
                'type' => 'folder_deleted',
                'message' => "Folder '{$folderName}' was deleted by your supervisor.",
                'data' => [
                    'folder_id' => $folderId,
                    'folder_name' => $folderName,
                ],
                'is_read' => false,
            ]);
        }

        $folder->delete();

        return redirect()->route('supervisor.tasks')->with('success', 'Folder deleted successfully!');
    }

    private function authorizeFolder(Folder $folder)
    {
        $user = Auth::user();

        if ($user->isSupervisor()) {
            if ($folder->supervisor_id !== $user->id) {
                abort(403);
            }
        } elseif ($user->isStudent()) {
            if (! $folder->supervisor()->where('department_id', $user->department_id)
                                    ->where('company_id', $user->company_id)
                                    ->exists()) {
                abort(403);
            }
        } else {
            abort(403);
        }
    }
}
