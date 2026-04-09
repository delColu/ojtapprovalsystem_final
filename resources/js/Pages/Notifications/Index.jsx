import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function Notifications({ notifications = [] }) {
    const getNotificationHref = (notification) => {
        switch (notification.type) {
            case 'folder_created':
            case 'folder_updated':
            case 'folder_reopened':
                return route('submit-reports');
            case 'folder_deleted':
            case 'folder_closed':
                return '/folders';
            case 'submission':
                return route('supervisor.submissions');
            case 'submission_forwarded':
                return route('dean.submissions.index');
            case 'status_update':
                return '/my-reports';
            default:
                return route('notifications.index');
        }
    };

    const openNotification = (notification) => {
        router.post(route('notifications.read', notification.id), {}, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => router.visit(getNotificationHref(notification)),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Notifications" />

            <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
                <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
                            <p className="mt-1 text-sm text-gray-500">Recent activity across your account.</p>
                        </div>
                        <button onClick={() => router.post(route('notifications.mark-all-read'))} className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700">
                            Mark all as read
                        </button>
                    </div>

                    <div className="mt-6 space-y-3">
                        {notifications.length === 0 ? (
                            <div className="rounded-2xl bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">No notifications yet.</div>
                        ) : notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`block w-full rounded-2xl border p-4 text-left ${notification.is_read ? 'border-gray-200 bg-white' : 'border-blue-200 bg-blue-50'}`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <button
                                        type="button"
                                        onClick={() => openNotification(notification)}
                                        className="flex-1 text-left"
                                    >
                                        <p className="font-semibold text-gray-900">{notification.title}</p>
                                        <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                                        <p className="mt-2 text-xs text-gray-400">{notification.created_at}</p>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => router.delete(route('notifications.destroy', notification.id))}
                                        className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                                        title="Delete notification"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
