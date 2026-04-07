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
        $folders = Folder::where('supervisor_id', Auth::id())->paginate(10);
        return Inertia::render('Folders/Index', compact('folders'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Folders/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $folder = Folder::create([
            'name' => $request->name,
            'supervisor_id' => Auth::id(),
        ]);

        $students = User::where('role', 'student')->get();

        foreach ($students as $student) {
            Notification::create([
                'user_id' => $student->id,
                'type' => 'folder_created',
                'message' => "New folder '{$folder->name}' has been created by your supervisor",
                'data' => json_encode(['folder_id' => $folder->id]),
                'is_read' => false,
            ]);
        }

        return redirect()->back()->with('success', 'Folder created successfully!');
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
        $folder->update($request->only('name'));
        return redirect()->back()->with('success', 'Folder updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Folder $folder)
    {
        $this->authorizeFolder($folder);
        $folder->delete();
        return redirect()->back()->with('success', 'Folder deleted successfully!');
    }

    private function authorizeFolder(Folder $folder)
    {
        if ($folder->supervisor_id !== Auth::id()) {
            abort(403);
        }
    }
}
