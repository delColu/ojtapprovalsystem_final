import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import StatusBadge from './Partials/StatusBadge';

// Enhanced StatCard with icons and hover effects
function StatCard({ title, value, icon: Icon, trend, trendLabel }) {
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-300">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">{value?.toLocaleString() ?? 0}</p>
                    {trend !== undefined && (
                        <div className="mt-2 flex items-center gap-1">
                            <span className={`text-xs font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {trend >= 0 ? `+${trend}%` : `${trend}%`}
                            </span>
                            {trendLabel && <span className="text-xs text-gray-400">{trendLabel}</span>}
                        </div>
                    )}
                </div>
                {Icon && (
                    <div className="rounded-xl bg-gray-50 p-2 text-gray-400 transition-colors group-hover:bg-blue-50 group-hover:text-blue-500">
                        <Icon className="h-5 w-5" />
                    </div>
                )}
            </div>
        </div>
    );
}

// Icons (simplified SVG components)
const Icons = {
    Tasks: () => (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
    ),
    Interns: () => (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    ),
    Submissions: () => (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    ),
    Reports: () => (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    ),
    ArrowUp: () => (
        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
    ),
    ArrowDown: () => (
        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
    ),
    Clock: () => (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    CheckCircle: () => (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
};

// Loading Skeleton component
function LoadingSkeleton() {
    return (
        <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 rounded-lg bg-gray-200" />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 rounded-2xl bg-gray-100" />
                ))}
            </div>
        </div>
    );
}

export default function Dashboard({
    statistics = {},
    approvalRate = 0,
    recentActivities = [],
    pendingSubmissions = [],
    isLoading = false,
    weeklyTrend = {},
    studentCount = 0
}) {
    const [refreshing, setRefreshing] = useState(false);

    const shortcuts = [
        { name: 'Tasks', href: route('supervisor.tasks'), description: 'Manage folders and due dates.', icon: Icons.Tasks, color: 'blue' },
        { name: 'Interns', href: route('supervisor.interns'), description: `View all supervised interns (${studentCount})`, icon: Icons.Interns, color: 'green' },
        { name: 'Submissions', href: route('supervisor.submissions'), description: 'Review pending student work.', icon: Icons.Submissions, color: 'purple' },
        { name: 'Reports', href: route('supervisor.reports'), description: 'Search and manage submitted reports.', icon: Icons.Reports, color: 'orange' },
    ];

    const handleRefresh = () => {
        setRefreshing(true);
        // Trigger refresh via Inertia.reload or your refresh logic
        setTimeout(() => setRefreshing(false), 1000);
    };

    if (isLoading) {
        return (
            <AuthenticatedLayout>
                <Head title="Supervisor Dashboard" />
                <div className="px-4 py-6 sm:px-6 lg:px-8">
                    <LoadingSkeleton />
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title="Supervisor Dashboard" />

            <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
                {/* Header Section with Refresh */}
                <section className="space-y-6">
                    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Supervisor Flow</p>
                                <span className="h-1 w-1 rounded-full bg-gray-300" />
                                <p className="text-xs text-gray-400">Real-time insights</p>
                            </div>
                            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">Dashboard</h1>
                            <p className="mt-2 max-w-3xl text-sm text-gray-500">
                                Overview of your supervision activities, pending reviews, and intern progress.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Approval Rate Card */}
                            <div className="group rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white px-5 py-3 transition-all hover:shadow-sm">
                                <p className="text-xs font-medium uppercase tracking-wide text-blue-600">Approval Rate</p>
                                <div className="mt-1 flex items-baseline gap-1">
                                    <p className="text-2xl font-bold text-blue-900">{approvalRate}%</p>
                                    <span className="text-xs text-blue-500">of {statistics.total_submissions || 0} total</span>
                                </div>
                                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-blue-100">
                                    <div
                                        className="h-full rounded-full bg-blue-500 transition-all duration-500"
                                        style={{ width: `${Math.min(approvalRate, 100)}%` }}
                                    />
                                </div>
                            </div>

                            {/* Refresh Button */}
                            <button
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className="rounded-xl border border-gray-200 bg-white p-2.5 text-gray-400 transition-all hover:border-gray-300 hover:text-gray-600 disabled:opacity-50"
                            >
                                <svg
                                    className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Statistics Grid with Trends */}
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <StatCard
                            title="Total Reports"
                            value={statistics.total_submissions}
                            icon={Icons.Reports}
                            trend={weeklyTrend.total}
                            trendLabel="vs last week"
                        />
                        <StatCard
                            title="Pending Approvals"
                            value={statistics.total_pending}
                            icon={Icons.Clock}
                            trend={weeklyTrend.pending}
                            trendLabel="awaiting review"
                        />
                        <StatCard
                            title="Approved Reports"
                            value={statistics.total_approved}
                            icon={Icons.CheckCircle}
                            trend={weeklyTrend.approved}
                            trendLabel="accepted"
                        />
                        <StatCard
                            title="Rejected Reports"
                            value={statistics.total_rejected}
                            icon={Icons.ArrowDown}
                            trend={weeklyTrend.rejected}
                            trendLabel="needs revision"
                        />
                    </div>
                </section>

                {/* Quick Actions Section - Enhanced */}
                <section>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">Quick Actions</h2>
                        <span className="text-xs text-gray-400">Jump to any section</span>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {shortcuts.map((shortcut) => (
                            <Link
                                key={shortcut.name}
                                href={shortcut.href}
                                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5"
                            >
                                <div className={`mb-3 inline-flex rounded-xl bg-${shortcut.color}-50 p-2 text-${shortcut.color}-500`}>
                                    <shortcut.icon />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {shortcut.name}
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">{shortcut.description}</p>
                                <div className="mt-3 flex items-center text-xs font-medium text-blue-500 opacity-0 transition-opacity group-hover:opacity-100">
                                    Go to {shortcut.name}
                                    <svg className="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Two Column Layout for Activity and Pending */}
                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Recent Activity Section */}
                    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                                    <p className="text-xs text-gray-500 mt-0.5">Latest submissions and updates</p>
                                </div>
                                {recentActivities.length > 3 && (
                                    <Link href={route('supervisor.submissions')} className="text-sm font-medium text-blue-600 hover:text-blue-700">
                                        View all
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div className="p-5">
                            {recentActivities.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="rounded-full bg-gray-100 p-3 mb-3">
                                        <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                        </svg>
                                    </div>
                                    <p className="text-sm text-gray-500">No recent activity found.</p>
                                    <p className="text-xs text-gray-400 mt-1">New submissions will appear here</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {recentActivities.slice(0, 5).map((activity, idx) => (
                                        <div
                                            key={activity.id}
                                            className="group rounded-xl border border-gray-100 bg-gray-50/30 p-4 transition-all hover:border-gray-200 hover:bg-white"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                                        {activity.student?.name || 'Student'} submitted "{activity.title}"
                                                    </p>
                                                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                                                        <StatusBadge status={activity.status} />
                                                        <span className="flex items-center gap-1">
                                                            <Icons.Clock />
                                                            {activity.created_at ? new Date(activity.created_at).toLocaleString() : 'N/A'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <Link
                                                    href={route('supervisor.submissions')}
                                                    className="ml-2 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100"
                                                >
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Pending Snapshot Section - Enhanced */}
                    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Pending Snapshot</h2>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {pendingSubmissions.length} submission{pendingSubmissions.length !== 1 ? 's' : ''} awaiting review
                                    </p>
                                </div>
                                <Link
                                    href={route('supervisor.submissions', { filter: 'pending' })}
                                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                                >
                                    Review all
                                </Link>
                            </div>
                        </div>
                        <div className="p-5">
                            {pendingSubmissions.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="rounded-full bg-green-50 p-3 mb-3">
                                        <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-sm text-gray-500">All caught up!</p>
                                    <p className="text-xs text-gray-400 mt-1">No pending submissions to review</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {pendingSubmissions.slice(0, 5).map((submission) => (
                                        <Link
                                            key={submission.id}
                                            href={route('supervisor.submissions')}
                                            className="block rounded-xl border border-amber-100 bg-amber-50/30 p-4 transition-all hover:border-amber-200 hover:bg-amber-50/50 hover:shadow-sm"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                                                        <p className="font-semibold text-gray-900 line-clamp-1">{submission.title}</p>
                                                    </div>
                                                    <p className="mt-1.5 text-sm text-gray-600">
                                                        {submission.student?.name || 'Unknown student'}
                                                    </p>
                                                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                                                        <span className="flex items-center gap-1">
                                                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                                            </svg>
                                                            {submission.folder?.name || 'No folder'}
                                                        </span>
                                                        {submission.submitted_at && (
                                                            <>
                                                                <span>•</span>
                                                                <span>{new Date(submission.submitted_at).toLocaleDateString()}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="ml-3 rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
                                                    Pending
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                    {pendingSubmissions.length > 5 && (
                                        <div className="mt-2 text-center">
                                                <Link href={route('supervisor.submissions')} className="text-xs text-blue-600 hover:text-blue-700">
                                                    + {pendingSubmissions.length - 5} more pending submission{pendingSubmissions.length - 5 !== 1 ? 's' : ''}
                                                </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
