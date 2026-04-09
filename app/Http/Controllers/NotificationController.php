<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function index(Request $request): Response
    {
        $notifications = $request->user()
            ->notifications()
            ->latest()
            ->get()
            ->map(fn (Notification $notification) => [
                'id' => $notification->id,
                'title' => $notification->title,
                'message' => $notification->message,
                'type' => $notification->type,
                'is_read' => $notification->is_read,
                'created_at' => optional($notification->created_at)?->diffForHumans(),
                'data' => $notification->data,
            ])
            ->values();

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
        ]);
    }

    public function markAsRead(Request $request, Notification $notification): RedirectResponse
    {
        abort_unless($notification->user_id === $request->user()->id, 403);

        $notification->update(['is_read' => true]);

        return back();
    }

    public function markAllAsRead(Request $request): RedirectResponse
    {
        $request->user()->notifications()->where('is_read', false)->update(['is_read' => true]);

        return back();
    }

    public function destroy(Request $request, Notification $notification): RedirectResponse
    {
        abort_unless($notification->user_id === $request->user()->id, 403);

        $notification->delete();

        return back()->with('success', 'Notification deleted.');
    }
}
