import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import StatusBadge from './Partials/StatusBadge';

function StatCard({ title, value, icon: Icon, accent, note }) {
    return (
        <div className="group relative overflow-hidden rounded-xl border border-slate-500/80 bg-gradient-to-b from-slate-800/95 to-slate-900/95 p-4 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.9)] ring-1 ring-white/5 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_44px_-26px_rgba(6,182,212,0.2)]">
            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent}`} />
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{title}</p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight text-white">
                        {value?.toLocaleString() ?? 0}
                    </p>
                    {note ? <p className="mt-1 text-xs text-slate-400">{note}</p> : null}
                </div>

                {Icon ? (
                    <div className={`rounded-lg border border-white/10 bg-gradient-to-br p-2 text-white shadow-md ${accent}`}>
                        <Icon className="h-4 w-4" />
                    </div>
                ) : null}
            </div>
        </div>
    );
}

function Panel({ title, subtitle, action, children }) {
    return (
        <section className="overflow-hidden rounded-xl border border-slate-500/80 bg-gradient-to-b from-slate-800/95 to-slate-900/95 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.9)] ring-1 ring-white/5">
            <div className="flex items-center justify-between border-b border-slate-600/80 bg-white/[0.02] px-4 py-3">
                <div>
                    <h2 className="text-base font-semibold tracking-tight text-white">{title}</h2>
                    {subtitle ? <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p> : null}
                </div>
                {action}
            </div>
            <div className="p-4">{children}</div>
        </section>
    );
}

const Icons = {
    Tasks: ({ className = 'h-4 w-4' }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
    ),
    Interns: ({ className = 'h-4 w-4' }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    ),
    Submissions: ({ className = 'h-4 w-4' }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    ),
    Reports: ({ className = 'h-4 w-4' }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    ),
    Clock: ({ className = 'h-4 w-4' }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    CheckCircle: ({ className = 'h-4 w-4' }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    Spark: ({ className = 'h-3.5 w-3.5' }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
        </svg>
    ),
    ArrowRight: ({ className = 'h-3 w-3' }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} d="M9 5l7 7-7 7" />
        </svg>
    ),
};

function LoadingSkeleton() {
    return (
            <div className="space-y-5 animate-pulse">
                <div className="h-36 rounded-xl border border-slate-500/80 bg-slate-800/60 ring-1 ring-white/5" />
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {[...Array(4)].map((_, index) => (
                    <div key={index} className="h-28 rounded-xl border border-slate-500/80 bg-slate-800/60 ring-1 ring-white/5" />
                ))}
            </div>
            <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
                <div className="h-80 rounded-xl border border-slate-500/80 bg-slate-800/60 ring-1 ring-white/5" />
                <div className="h-80 rounded-xl border border-slate-500/80 bg-slate-800/60 ring-1 ring-white/5" />
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
    studentCount = 0,
}) {
    const [refreshing, setRefreshing] = useState(false);

    const shortcuts = [
        {
            name: 'Tasks',
            href: route('supervisor.tasks'),
            description: 'Folders and due dates',
            icon: Icons.Tasks,
            accent: 'from-sky-500 to-cyan-400',
            border: 'border-sky-500/30',
            iconShell: 'bg-sky-500/20 text-sky-300',
        },
        {
            name: 'Interns',
            href: route('supervisor.interns'),
            description: `${studentCount} supervised`,
            icon: Icons.Interns,
            accent: 'from-emerald-500 to-teal-400',
            border: 'border-emerald-500/30',
            iconShell: 'bg-emerald-500/20 text-emerald-300',
        },
        {
            name: 'Submissions',
            href: route('supervisor.submissions'),
            description: 'Review queue',
            icon: Icons.Submissions,
            accent: 'from-violet-500 to-fuchsia-400',
            border: 'border-violet-500/30',
            iconShell: 'bg-violet-500/20 text-violet-300',
        },
        {
            name: 'Reports',
            href: route('supervisor.reports'),
            description: 'Archive and history',
            icon: Icons.Reports,
            accent: 'from-amber-500 to-orange-400',
            border: 'border-amber-500/30',
            iconShell: 'bg-amber-500/20 text-amber-300',
        },
    ];

    const statCards = [
        {
            title: 'Total Reports',
            value: statistics.total_submissions,
            icon: Icons.Reports,
            accent: 'from-slate-500 to-slate-600',
            note: 'Overall submissions',
        },
        {
            title: 'Pending',
            value: statistics.total_pending,
            icon: Icons.Clock,
            accent: 'from-amber-500 to-orange-400',
            note: 'Awaiting review',
        },
        {
            title: 'Approved',
            value: statistics.total_approved,
            icon: Icons.CheckCircle,
            accent: 'from-emerald-500 to-teal-400',
            note: 'Accepted reports',
        },
        {
            title: 'Rejected',
            value: statistics.total_rejected,
            icon: Icons.Submissions,
            accent: 'from-rose-500 to-pink-400',
            note: 'Needs revision',
        },
    ];

    const headlineMetric = useMemo(() => {
        const values = [
            { label: 'Pending', value: statistics.total_pending ?? 0 },
            { label: 'Approved', value: statistics.total_approved ?? 0 },
            { label: 'Rejected', value: statistics.total_rejected ?? 0 },
        ];

        return values.sort((a, b) => b.value - a.value)[0];
    }, [statistics.total_approved, statistics.total_pending, statistics.total_rejected]);

    const handleRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    };

    if (isLoading) {
        return (
            <AuthenticatedLayout>
                <Head title="Supervisor Dashboard" />
                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-6 sm:px-6 lg:px-8">
                    <LoadingSkeleton />
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title="Supervisor Dashboard" />

            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-6 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl space-y-5">
                    {/* Hero Section - Compact */}
                    <div className="relative overflow-hidden rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 px-5 py-5 shadow-lg">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-transparent" />

                        <div className="relative grid gap-4 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
                            <div className="space-y-3">
                                <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-600 bg-slate-800/50 px-2.5 py-1 text-[10px] font-medium text-slate-300">
                                    <Icons.Spark className="h-3 w-3 text-cyan-400" />
                                    Supervisor Workspace
                                </div>

                                <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                                    Command view for reviews & interns
                                </h1>
                                <p className="max-w-xl text-xs text-slate-400">
                                    Focus on pending work and submissions.
                                </p>

                                <div className="flex flex-wrap gap-2 pt-1">
                                    <Link
                                        href={route('supervisor.submissions', { filter: 'pending' })}
                                        className="inline-flex items-center gap-1.5 rounded-full bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-cyan-700"
                                    >
                                        Review pending
                                        <Icons.ArrowRight />
                                    </Link>
                                    <button
                                        onClick={handleRefresh}
                                        disabled={refreshing}
                                        className="inline-flex items-center gap-1.5 rounded-full border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-700 disabled:opacity-60"
                                    >
                                        <svg
                                            className={`h-3 w-3 ${refreshing ? 'animate-spin' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Refresh
                                    </button>
                                </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-lg border border-slate-500/80 bg-gradient-to-b from-slate-800/88 to-slate-900/82 p-3 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.9)] ring-1 ring-white/5">
                                    <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Approval Rate</p>
                                    <div className="mt-2 flex items-end justify-between gap-2">
                                        <div>
                                            <p className="text-2xl font-semibold text-white">{approvalRate}%</p>
                                            <p className="text-[10px] text-slate-400">
                                                {statistics.total_submissions || 0} total
                                            </p>
                                        </div>
                                        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/20 px-2 py-1 text-[10px] font-medium text-emerald-300">
                                            {headlineMetric?.label}
                                        </div>
                                    </div>
                                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-700">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-emerald-400"
                                            style={{ width: `${Math.min(approvalRate, 100)}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="rounded-lg border border-slate-500/80 bg-gradient-to-b from-slate-800/88 to-slate-900/82 p-3 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.9)] ring-1 ring-white/5">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Weekly</p>
                                        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2 py-0.5 text-[9px] text-emerald-300">
                                            Live
                                        </span>
                                    </div>
                                    <div className="mt-2 grid grid-cols-2 gap-2">
                                        <div className="rounded-lg border border-slate-700 bg-slate-700/50 p-2">
                                            <p className="text-[9px] text-slate-400">Reports</p>
                                            <p className="mt-1 text-base font-semibold text-white">
                                                {weeklyTrend.total ?? 0}%
                                            </p>
                                        </div>
                                        <div className="rounded-lg border border-slate-700 bg-slate-700/50 p-2">
                                            <p className="text-[9px] text-slate-400">Pending</p>
                                            <p className="mt-1 text-base font-semibold text-white">
                                                {weeklyTrend.pending ?? 0}%
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards - Compact */}
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {statCards.map((card) => (
                            <StatCard
                                key={card.title}
                                title={card.title}
                                value={card.value}
                                icon={card.icon}
                                accent={card.accent}
                                note={card.note}
                            />
                        ))}
                    </div>

                    {/* Shortcuts - Compact */}
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {shortcuts.map((shortcut) => (
                            <Link
                                key={shortcut.name}
                                href={shortcut.href}
                                        className={`group relative overflow-hidden rounded-xl border ${shortcut.border} bg-gradient-to-b from-slate-800/95 to-slate-900/95 p-4 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.9)] ring-1 ring-white/5 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_44px_-26px_rgba(6,182,212,0.2)]`}
                            >
                                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${shortcut.accent}`} />
                                <div className={`inline-flex rounded-lg border border-white/10 p-2 ${shortcut.iconShell}`}>
                                    <shortcut.icon />
                                </div>
                                <div className="mt-3">
                                    <h2 className="text-base font-semibold tracking-tight text-white">{shortcut.name}</h2>
                                    <p className="mt-0.5 text-xs text-slate-400">{shortcut.description}</p>
                                </div>
                                <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-slate-400">
                                    Open
                                    <Icons.ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Panels - Compact */}
                    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                        <Panel
                            title="Recent Activity"
                            subtitle="Latest updates across submissions"
                            action={
                                recentActivities.length > 0 ? (
                                    <Link
                                        href={route('supervisor.submissions')}
                                        className="text-xs font-medium text-cyan-400 transition hover:text-cyan-300"
                                    >
                                        View all
                                    </Link>
                                ) : null
                            }
                        >
                            {recentActivities.length === 0 ? (
                                <div className="flex min-h-[240px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-500/80 bg-slate-800/60 px-4 text-center shadow-[0_18px_40px_-28px_rgba(15,23,42,0.9)] ring-1 ring-white/5">
                                    <div className="rounded-lg border border-slate-500/80 bg-slate-700/90 p-2 shadow-sm">
                                        <Icons.Submissions className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <p className="mt-3 text-sm font-medium text-slate-400">No recent activity</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {recentActivities.slice(0, 5).map((activity) => (
                                        <div
                                            key={activity.id}
                                            className="rounded-lg border border-slate-500/80 bg-gradient-to-b from-slate-800/88 to-slate-900/82 p-3 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.9)] ring-1 ring-white/5 transition hover:border-cyan-500/45 hover:shadow-[0_22px_44px_-26px_rgba(6,182,212,0.2)]"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-semibold text-white">
                                                        {activity.student?.name || 'Student'} submitted “{activity.title}”
                                                    </p>
                                                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                                                        <StatusBadge status={activity.status} />
                                                        <span>
                                                            {activity.created_at
                                                                ? new Date(activity.created_at).toLocaleString()
                                                                : 'N/A'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <Link
                                                    href={route('supervisor.submissions')}
                                                    className="rounded-full border border-slate-500/80 bg-slate-700/90 p-1.5 text-slate-400 shadow-sm transition hover:bg-slate-600 hover:text-slate-300"
                                                >
                                                    <Icons.ArrowRight />
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Panel>

                        <Panel
                            title="Pending Snapshot"
                            subtitle={`${pendingSubmissions.length} awaiting review`}
                            action={
                                <Link
                                    href={route('supervisor.submissions', { filter: 'pending' })}
                                    className="text-xs font-medium text-cyan-400 transition hover:text-cyan-300"
                                >
                                    Review all
                                </Link>
                            }
                        >
                            {pendingSubmissions.length === 0 ? (
                                <div className="flex min-h-[240px] flex-col items-center justify-center rounded-lg border border-dashed border-emerald-700/40 bg-slate-800/60 px-4 text-center shadow-[0_18px_40px_-28px_rgba(15,23,42,0.9)] ring-1 ring-white/5">
                                    <div className="rounded-lg border border-emerald-500/30 bg-slate-700/90 p-2 shadow-sm">
                                        <Icons.CheckCircle className="h-5 w-5 text-emerald-400" />
                                    </div>
                                    <p className="mt-3 text-sm font-medium text-emerald-400">All caught up</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {pendingSubmissions.slice(0, 5).map((submission, index) => (
                                        <Link
                                            key={submission.id}
                                            href={route('supervisor.submissions')}
                                            className="group block rounded-lg border border-slate-500/80 bg-gradient-to-b from-slate-800/88 to-slate-900/82 p-3 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.9)] ring-1 ring-white/5 transition hover:border-amber-500/40 hover:shadow-[0_22px_44px_-26px_rgba(245,158,11,0.22)]"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/20 px-1.5 text-[10px] font-semibold text-amber-300">
                                                            {index + 1}
                                                        </span>
                                                        <p className="truncate text-sm font-semibold text-white">
                                                            {submission.title}
                                                        </p>
                                                    </div>

                                                    <p className="mt-1 text-xs text-slate-400">
                                                        {submission.student?.name || 'Unknown'}
                                                    </p>

                                                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500">
                                                        <span className="rounded-full border border-slate-500/80 bg-slate-700/85 px-2 py-0.5 shadow-sm">
                                                            {submission.folder?.name || 'No folder'}
                                                        </span>
                                                        {submission.submitted_at ? (
                                                            <span className="rounded-full border border-slate-500/80 bg-slate-700/85 px-2 py-0.5 shadow-sm">
                                                                {new Date(submission.submitted_at).toLocaleDateString()}
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                </div>

                                                <div className="rounded-full border border-amber-500/30 bg-amber-500/20 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-amber-300">
                                                    Pending
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </Panel>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
