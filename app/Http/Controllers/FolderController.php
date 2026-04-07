<?php

namespace App\Http\Controllers;

use App\Models\Folder;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class FolderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        abort_unless(Auth::user()?->isSupervisor(), 403);

        $folders = Folder::where('supervisor_id', Auth::id())
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
        ]);

        $students = User::where('role', 'student')->get();

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

        return redirect()->route('supervisor.dashboard')->with('success', 'Folder created successfully!');
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

        $folder->update($validated);

        return redirect()->route('supervisor.dashboard')->with('success', 'Folder updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Folder $folder)
    {
        $this->authorizeFolder($folder);
        $folder->delete();
        return redirect()->route('supervisor.dashboard')->with('success', 'Folder deleted successfully!');
    }

    private function authorizeFolder(Folder $folder)
    {
        if ($folder->supervisor_id !== Auth::id()) {
            abort(403);
        }
    }
}
