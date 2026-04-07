<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    /**
     * Display a paginated list of activity logs for general users.
     */
    public function index()
    {
        $logs = ActivityLog::with('user')
            ->latest()
            ->paginate(20);

        return inertia('ActivityLogs/Index', compact('logs'));
    }

    /**
     * Display a paginated list of activity logs for admins.
     */
    public function adminIndex(Request $request)
    {
        $logs = ActivityLog::with('user')
            ->latest()
            ->paginate(50);

        return inertia('Admin/ActivityLogs/Index', compact('logs'));
    }
}
