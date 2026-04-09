import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import SubmissionModal from './Partials/SubmissionModal';
import StatusBadge from './Partials/StatusBadge';

function SearchField({ value, onChange }) {
    return (
        <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-4.35-4.35m1.35-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input
                type="text"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder="Search reports..."
                className="w-full rounded-lg border-2 border-slate-600 bg-slate-800/80 py-2.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            />
        </div>
    );
}

function StatCard({ label, value, accent, trend }) {
    return (
        <div className="rounded-lg border border-slate-500/80 bg-gradient-to-b from-slate-800/95 to-slate-900/95 p-3 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.9)] ring-1 ring-white/5">
            <div className={`h-1.5 w-8 rounded-full bg-gradient-to-r ${accent}`} />
            <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
            <div className="mt-1 flex items-baseline gap-2">
                <p className="text-xl font-semibold tracking-tight text-white">{value}</p>
                {trend && <span className="text-[10px] font-medium text-emerald-400">{trend}</span>}
            </div>
        </div>
    );
}

function formatDate(date) {
    if (!date) {
        return 'N/A';
    }

    return new Date(date).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

export default function Reports({ reports = [], search = '' }) {
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const searchForm = useForm({ search });

    const runSearch = (event) => {
        event.preventDefault();
        router.get(route('supervisor.reports'), { search: searchForm.data.search }, { preserveState: true, replace: true });
    };

    const deleteSubmission = (submission) => {
        if (window.confirm(`Delete report "${submission.title}"?`)) {
            router.delete(`/submissions/${submission.id}`);
        }
    };

    const stats = useMemo(() => {
        const approved = reports.filter((report) => report.status === 'approved').length;
        const rejected = reports.filter((report) => report.status === 'rejected').length;
        const pending = reports.filter((report) => report.status === 'pending').length;

        return {
            total: reports.length,
            approved,
            rejected,
            pending,
        };
    }, [reports]);

    return (
        <AuthenticatedLayout>
            <Head title="Supervisor Reports" />

            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-6 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl space-y-6">
                    <div className="border-b-2 border-slate-700 pb-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div className="space-y-2">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-400">
                                    Supervisor Archive
                                </p>
                                <div className="space-y-1">
                                    <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                                        Reports
                                    </h1>
                                    <p className="max-w-xl text-sm text-slate-400">
                                        Search and manage submitted work using the same streamlined card layout.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-2">
                                <StatCard
                                    label="Total"
                                    value={stats.total}
                                    accent="from-slate-500 to-slate-600"
                                />
                                <StatCard
                                    label="Approved"
                                    value={stats.approved}
                                    accent="from-emerald-500 to-teal-400"
                                />
                                <StatCard
                                    label="Pending"
                                    value={stats.pending}
                                    accent="from-amber-500 to-orange-400"
                                />
                                <StatCard
                                    label="Rejected"
                                    value={stats.rejected}
                                    accent="from-rose-500 to-pink-500"
                                />
                            </div>
                        </div>
                    </div>

                    <form onSubmit={runSearch} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                            <SearchField
                                value={searchForm.data.search}
                                onChange={(value) => searchForm.setData('search', value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-700 whitespace-nowrap"
                        >
                            Search
                        </button>
                    </form>

                    <section className="space-y-3">
                        <div className="grid gap-2 rounded-lg border border-slate-500/80 bg-gradient-to-b from-slate-800/95 to-slate-900/95 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.9)] ring-1 ring-white/5 md:grid-cols-[1.2fr_1.35fr_0.9fr_0.8fr_1fr]">
                            <div>Intern</div>
                            <div>Report</div>
                            <div>Folder</div>
                            <div className="md:text-center">Status</div>
                            <div className="md:text-center">Actions</div>
                        </div>

                        {reports.length === 0 ? (
                            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-500/80 bg-slate-800/60 px-6 text-center shadow-[0_18px_40px_-28px_rgba(15,23,42,0.9)] ring-1 ring-white/5">
                                <div className="rounded-lg border border-slate-500/80 bg-slate-700/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-300 shadow-sm">
                                    No Reports
                                </div>
                                <p className="mt-3 text-sm font-medium text-slate-400">No reports found.</p>
                                <p className="mt-1 text-sm text-slate-500">Try another keyword or wait for new submissions.</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {reports.map((report, index) => (
                                    <div
                                        key={report.id}
                                        className="rounded-lg border border-slate-500/80 bg-gradient-to-b from-slate-800/88 to-slate-900/82 px-4 py-3 text-left shadow-[0_18px_40px_-28px_rgba(15,23,42,0.9)] ring-1 ring-white/5 transition-all duration-300 hover:border-cyan-500/45 hover:shadow-[0_22px_44px_-26px_rgba(6,182,212,0.2)]"
                                    >
                                        <div className="grid gap-3 md:grid-cols-[1.2fr_1.35fr_0.9fr_0.8fr_1fr] md:items-center">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-cyan-500/20 bg-gradient-to-br from-cyan-500/18 to-indigo-500/18 text-sm font-semibold text-cyan-300 shadow-inner shadow-cyan-950/20">
                                                    {report.student?.name?.charAt(0).toUpperCase() || '?'}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <p className="truncate text-sm font-semibold tracking-tight text-white">
                                                            {report.student?.name || 'Unknown student'}
                                                        </p>
                                                        <span className="hidden sm:inline-flex rounded-full border border-slate-500/80 bg-slate-700/85 px-2 py-0.5 text-[9px] font-semibold text-slate-300 shadow-sm">
                                                            #{String(index + 1).padStart(2, '0')}
                                                        </span>
                                                    </div>
                                                    <p className="mt-0.5 text-[11px] text-slate-400">
                                                        Submitted: {formatDate(report.submitted_at)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="rounded-lg border border-slate-500/80 bg-slate-800/65 p-3 ring-1 ring-white/5">
                                                    <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                                                        Report
                                                    </p>
                                                    <p className="truncate text-xs font-medium text-slate-300">
                                                        {report.title}
                                                    </p>
                                                    {report.file_name && (
                                                        <p className="mt-1 truncate text-[11px] text-slate-400">
                                                            {report.file_name}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-start md:justify-center">
                                                <span className="inline-flex rounded-full border border-slate-500/80 bg-slate-700/85 px-3 py-1 text-[11px] font-medium text-slate-300 shadow-sm">
                                                    {report.folder?.name || 'No folder'}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-start md:justify-center">
                                                <StatusBadge status={report.status} />
                                            </div>

                                            <div className="flex flex-wrap gap-1.5 md:justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedSubmission(report)}
                                                    className="inline-flex items-center justify-center rounded-lg border border-slate-500/80 bg-slate-700/90 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-600 hover:text-white"
                                                >
                                                    View
                                                </button>
                                                <a
                                                    href={`/submissions/${report.id}/download-pdf`}
                                                    className="inline-flex items-center justify-center rounded-lg border border-slate-500/80 bg-slate-700/90 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-600 hover:text-white"
                                                >
                                                    PDF
                                                </a>
                                                <button
                                                    type="button"
                                                    onClick={() => deleteSubmission(report)}
                                                    className="inline-flex items-center justify-center rounded-lg border border-rose-500/30 bg-rose-500/20 px-3 py-1.5 text-xs font-medium text-rose-300 transition hover:bg-rose-500/30"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {reports.length > 0 && (
                            <div className="flex items-center justify-between rounded-lg border border-slate-500/80 bg-gradient-to-b from-slate-800/95 to-slate-900/95 px-4 py-2.5 text-xs text-slate-400 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.9)] ring-1 ring-white/5">
                                <span>Showing {reports.length} reports</span>
                                <span className="text-[11px]">Approved: {stats.approved} • Pending: {stats.pending} • Rejected: {stats.rejected}</span>
                            </div>
                        )}
                    </section>
                </div>
            </div>

            {selectedSubmission && (
                <SubmissionModal submission={selectedSubmission} onClose={() => setSelectedSubmission(null)}>
                    <a
                        href={`/submissions/${selectedSubmission.id}/download-pdf`}
                        className="rounded-lg border-2 border-slate-600 bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-600 hover:text-white"
                    >
                        Download Summary PDF
                    </a>
                    <button
                        type="button"
                        onClick={() => deleteSubmission(selectedSubmission)}
                        className="rounded-lg border-2 border-rose-500/30 bg-rose-500/20 px-4 py-2 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/30"
                    >
                        Delete
                    </button>
                </SubmissionModal>
            )}
        </AuthenticatedLayout>
    );
}
