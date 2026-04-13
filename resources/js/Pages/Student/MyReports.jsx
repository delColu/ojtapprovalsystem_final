import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowDownTrayIcon,
    CalendarDaysIcon,
    CheckCircleIcon,
    ClockIcon,
    DocumentChartBarIcon,
    EyeIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    PaperAirplaneIcon,
    PencilSquareIcon,
    PlusCircleIcon,
    ShieldCheckIcon,
    Squares2X2Icon,
    TrashIcon,
    XCircleIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import { useMemo, useState } from 'react';

// Helper functions
const statusLabel = (report) => {
    if (report.status === 'forwarded') return 'Submitted to Dean';
    if (report.status === 'approved' && report.dean_reviewed_at) return 'Dean Approved';
    if (report.status === 'approved' && report.supervisor_approved_at) return 'Supervisor Approved';
    if (report.status === 'rejected' && report.dean_feedback) return 'Dean Rejected';
    if (report.status === 'rejected' && report.supervisor_feedback) return 'Supervisor Rejected';
    return report.status?.charAt(0).toUpperCase() + report.status?.slice(1);
};

const getStatusConfig = (report) => {
    const label = statusLabel(report);

    if (label.includes('Approved')) {
        return {
            label,
            icon: CheckCircleIcon,
            badgeClass: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
            railClass: 'bg-emerald-500',
            softClass: 'bg-emerald-100 text-emerald-700',
        };
    }

    if (label.includes('Rejected')) {
        return {
            label,
            icon: XCircleIcon,
            badgeClass: 'bg-red-50 text-red-700 ring-red-600/20',
            railClass: 'bg-red-500',
            softClass: 'bg-red-100 text-red-700',
        };
    }

    if (label.includes('Dean')) {
        return {
            label,
            icon: ShieldCheckIcon,
            badgeClass: 'bg-sky-50 text-sky-700 ring-sky-600/20',
            railClass: 'bg-sky-500',
            softClass: 'bg-sky-100 text-sky-700',
        };
    }

    return {
        label,
        icon: ClockIcon,
        badgeClass: 'bg-amber-50 text-amber-700 ring-amber-600/20',
        railClass: 'bg-amber-500',
        softClass: 'bg-amber-100 text-amber-700',
    };
};

const StatusBadge = ({ report }) => {
    const config = getStatusConfig(report);
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${config.badgeClass}`}>
            <Icon className="h-3 w-3" />
            <span className="text-[10px]">{config.label}</span>
        </span>
    );
};

// Report Card Component
const ReportCard = ({ report, onView, onEdit, onDelete, onSubmitToDean }) => {
    return (
        <article className="rounded-lg border border-slate-500/50 bg-gradient-to-r from-slate-900/80 to-slate-800/70 p-3 shadow-[0_12px_24px_-20px_rgba(15,23,42,0.9)] ring-1 ring-white/10 transition duration-300 hover:border-rose-500/50 hover:from-slate-900 hover:to-slate-800">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-2">
                        <DocumentChartBarIcon className="mt-0.5 h-4 w-4 text-rose-400" />
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="truncate text-sm font-semibold text-white">
                                    {report.title}
                                </h3>
                                <StatusBadge report={report} />
                            </div>
                            <p className="text-xs text-slate-400">{report.folder_name || 'No folder'}</p>
                        </div>
                    </div>

                    {report.description && (
                        <p className="mt-2 line-clamp-2 text-xs text-slate-400">
                            {report.description}
                        </p>
                    )}

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1 rounded-md border border-slate-500/40 bg-slate-800/90 px-2 py-1 text-slate-300 ring-1 ring-white/10">
                            <CalendarDaysIcon className="h-3 w-3 text-rose-400" />
                            <span className="text-[10px]">{report.submitted_at || 'No date'}</span>
                        </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                        <button
                            onClick={() => onView(report)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-500/40 bg-slate-800/90 px-3 py-1.5 text-xs font-medium text-slate-300 shadow-sm ring-1 ring-white/10 transition hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300"
                        >
                            <EyeIcon className="h-3.5 w-3.5" />
                            View
                        </button>

                        <a
                            href={route('submissions.download-pdf', report.id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-500/40 bg-slate-800/90 px-3 py-1.5 text-xs font-medium text-slate-300 shadow-sm ring-1 ring-white/10 transition hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300"
                        >
                            <ArrowDownTrayIcon className="h-3.5 w-3.5" />
                            PDF
                        </a>

                        {report.can_edit && (
                            <>
                                <button
                                    onClick={() => onEdit(report)}
                                    className="inline-flex items-center gap-1 rounded-lg border border-slate-500/40 bg-slate-800/90 px-3 py-1.5 text-xs font-medium text-sky-300 shadow-sm ring-1 ring-white/10 transition hover:border-sky-500/40 hover:bg-sky-500/10"
                                >
                                    <PencilSquareIcon className="h-3.5 w-3.5" />
                                    Edit
                                </button>

                                <button
                                    onClick={() => onDelete(report)}
                                    className="inline-flex items-center gap-1 rounded-lg border border-slate-500/40 bg-slate-800/90 px-3 py-1.5 text-xs font-medium text-red-300 shadow-sm ring-1 ring-white/10 transition hover:border-red-500/40 hover:bg-red-500/10"
                                >
                                    <TrashIcon className="h-3.5 w-3.5" />
                                    Delete
                                </button>
                            </>
                        )}

                        {report.can_submit_to_dean && (
                            <button
                                onClick={() => onSubmitToDean(report)}
                                className="inline-flex items-center gap-1 rounded-lg border border-rose-500/40 bg-gradient-to-r from-rose-600 to-pink-600 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_10px_24px_-14px_rgba(244,63,94,0.8)] transition duration-300 hover:from-rose-500 hover:to-pink-500"
                            >
                                <PaperAirplaneIcon className="h-3.5 w-3.5" />
                                Submit to Dean
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
};

// Main Component
export default function MyReports({ reports = [] }) {
    const [selectedReport, setSelectedReport] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [editingReport, setEditingReport] = useState(null);

    const { data, setData, post, processing, reset, transform } = useForm({
        title: '',
        description: '',
        date: '',
        file: null,
    });

    const filteredReports = reports.filter((report) => {
        const matchesSearch = searchTerm === '' ||
            [report.title, report.description, report.folder_name]
                .some((value) => String(value || '').toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = statusFilter === 'all' || report.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const reportStats = useMemo(() => {
        const total = reports.length;
        const approved = reports.filter((report) => statusLabel(report).includes('Approved')).length;
        const rejected = reports.filter((report) => statusLabel(report).includes('Rejected')).length;
        const pending = reports.filter((report) => {
            const label = statusLabel(report);
            return !label.includes('Approved') && !label.includes('Rejected') && label !== 'Submitted to Dean';
        }).length;
        const forwarded = reports.filter((report) => report.status === 'forwarded').length;

        return { total, approved, rejected, pending, forwarded };
    }, [reports]);

    const latestReport = reports[0] || null;
    const approvalRate = reportStats.total ? Math.round((reportStats.approved / reportStats.total) * 100) : 0;

    const openEdit = (report) => {
        setEditingReport(report);
        setData({
            title: report.title || '',
            description: report.description || '',
            date: report.submitted_at?.slice(0, 10) || '',
            file: null,
        });
        setSelectedReport(null);
    };

const submitEdit = (event) => {
        event.preventDefault();
        if (!editingReport?.id) {
            console.error('No report ID for editing');
            return;
        }
        post(route('submissions.update', editingReport.id), {
            ...data,
            _method: 'PUT',
        }, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setEditingReport(null);
                reset();
            },
            onError: (errors) => {
                console.error('Edit failed:', errors);
            },
        });
    };

    const deleteReport = (report) => {
        if (!window.confirm(`Delete "${report.title}"?`)) return;
        router.delete(route('submissions.destroy', report.id), { preserveScroll: true });
    };

    const submitToDean = (report) => {
        router.post(route('submissions.submit-to-dean', report.id), {}, { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="My Reports | CAST OJT System" />

            <div className="min-h-[calc(100vh-88px)] bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="space-y-5">
                        {/* Hero Section with Clear Submit Button */}
                        <div className="relative overflow-hidden rounded-xl border border-rose-500/30 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md">
                            <div className="absolute inset-0 bg-gradient-to-br from-rose-900/10 to-transparent" />

                            <div className="relative p-5">
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                        <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-rose-300">
                                            <Squares2X2Icon className="h-3.5 w-3.5" />
                                            My Reports
                                        </div>
                                        <h1 className="mt-2 text-xl font-bold tracking-tight text-white">
                                            Manage Your Reports
                                        </h1>
                                        <p className="mt-1 text-sm text-slate-300">
                                            Track approvals, revisit files, and manage revisions.
                                        </p>
                                    </div>

                                    <div className="flex gap-3">
                                        <div className="rounded-lg border border-white/15 bg-white/5 px-3 py-2">
                                            <p className="text-[10px] text-slate-400">Approval Rate</p>
                                            <p className="text-xl font-bold text-white">{approvalRate}%</p>
                                        </div>
                                        <div className="rounded-lg border border-white/15 bg-white/5 px-3 py-2">
                                            <p className="text-[10px] text-slate-400">Reports</p>
                                            <p className="text-xl font-bold text-white">{reportStats.total}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                                        <p className="text-[10px] text-slate-400">Year</p>
                                        <p className="text-sm font-semibold text-white">{new Date().getFullYear()}</p>
                                    </div>
                                    <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                                        <p className="text-[10px] text-slate-400">Latest</p>
                                        <p className="truncate text-sm font-semibold text-white">
                                            {latestReport?.title || 'None'}
                                        </p>
                                    </div>
                                    <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                                        <p className="text-[10px] text-slate-400">Pending</p>
                                        <p className="text-sm font-semibold text-white">{reportStats.pending}</p>
                                    </div>
                                    {/* CLEARER SUBMIT BUTTON - Made more prominent */}
                                    <div className="rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 px-3 py-2 shadow-lg transition hover:from-rose-500 hover:to-pink-500">
                                        <Link
                                            href={route('submit-reports')}
                                            className="flex items-center justify-center gap-2 text-sm font-bold text-white"
                                        >
                                            <PlusCircleIcon className="h-6 w-5 justify-center gap-6" />

                                            Submit New Report
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="grid gap-6 xl:grid-cols-[1fr_280px]">
                            {/* Reports List */}
                            <div className="rounded-xl border border-slate-500/50 bg-gradient-to-br from-slate-800/80 via-slate-800/70 to-slate-900/85 p-5 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.9)] backdrop-blur-sm ring-1 ring-white/10">
                                <div className="flex flex-col gap-4 border-b border-slate-500/30 pb-4 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-rose-400">Archive</p>
                                        <h2 className="text-xl font-bold text-white">Report History</h2>
                                    </div>

                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={(event) => setSearchTerm(event.target.value)}
                                                placeholder="Search..."
                                                className="w-full rounded-lg border border-slate-500/50 bg-slate-900 py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-rose-500/40 focus:ring-2 focus:ring-rose-500/15"
                                            />
                                        </div>

                                        <div className="relative">
                                            <FunnelIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                            <select
                                                value={statusFilter}
                                                onChange={(event) => setStatusFilter(event.target.value)}
                                                className="rounded-lg border border-slate-500/50 bg-slate-900 py-2 pl-9 pr-8 text-sm text-white outline-none focus:border-rose-500/40 focus:ring-2 focus:ring-rose-500/15"
                                            >
                                                <option value="all">All</option>
                                                <option value="pending">Pending</option>
                                                <option value="approved">Approved</option>
                                                <option value="forwarded">Forwarded</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    {filteredReports.length === 0 ? (
                                        <div className="rounded-lg border border-dashed border-rose-500/30 bg-rose-500/5 px-4 py-10 text-center">
                                            <DocumentChartBarIcon className="mx-auto h-10 w-10 text-rose-400/50" />
                                            <h3 className="mt-2 text-base font-semibold text-white">No reports found</h3>
                                            <p className="mt-1 text-sm text-slate-400">Try different keywords or filters.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {filteredReports.map((report) => (
                                                <ReportCard
                                                    key={report.id}
                                                    report={report}
                                                    onView={setSelectedReport}
                                                    onEdit={openEdit}
                                                    onDelete={deleteReport}
                                                    onSubmitToDean={submitToDean}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Sidebar - Compact */}
                            <aside className="space-y-4">
                                <div className="rounded-xl border border-slate-500/50 bg-gradient-to-br from-slate-800/80 via-slate-800/70 to-slate-900/85 p-4 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.9)] backdrop-blur-sm ring-1 ring-white/10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-rose-400">Latest</p>
                                            <h3 className="mt-1 text-sm font-bold text-white">
                                                {latestReport?.title || 'No recent report'}
                                            </h3>
                                        </div>
                                        <CalendarDaysIcon className="h-5 w-5 text-rose-400" />
                                    </div>
                                    <p className="mt-2 text-xs text-slate-400">
                                        {latestReport?.submitted_at || 'No activity yet'}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-slate-500/50 bg-gradient-to-br from-slate-800/80 via-slate-800/70 to-slate-900/85 p-4 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.9)] backdrop-blur-sm ring-1 ring-white/10">
                                    <h3 className="text-sm font-bold text-white">Review Flow</h3>
                                    <div className="mt-3 space-y-2">
                                        <div className="flex justify-between rounded-lg border border-slate-500/40 bg-slate-900/60 px-3 py-2 text-sm ring-1 ring-white/10">
                                            <span className="text-slate-300">Approved</span>
                                            <span className="font-semibold text-white">{reportStats.approved}</span>
                                        </div>
                                        <div className="flex justify-between rounded-lg border border-slate-500/40 bg-slate-900/60 px-3 py-2 text-sm ring-1 ring-white/10">
                                            <span className="text-slate-300">Pending</span>
                                            <span className="font-semibold text-white">{reportStats.pending}</span>
                                        </div>
                                        <div className="flex justify-between rounded-lg border border-slate-500/40 bg-slate-900/60 px-3 py-2 text-sm ring-1 ring-white/10">
                                            <span className="text-slate-300">Forwarded</span>
                                            <span className="font-semibold text-white">{reportStats.forwarded}</span>
                                        </div>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
            </div>

            {/* View Modal */}
            {selectedReport && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
                    onClick={() => setSelectedReport(null)}
                >
                    <div
                        className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-slate-500/60 bg-slate-800 shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="border-b border-slate-500/40 bg-gradient-to-r from-slate-800 to-rose-500/10 px-5 py-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-white">{selectedReport.title}</h3>
                                    <p className="text-sm text-slate-400">{selectedReport.folder_name}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <StatusBadge report={selectedReport} />
                                    <button
                                        onClick={() => setSelectedReport(null)}
                                        className="rounded-lg p-1 text-slate-400 hover:bg-slate-700"
                                    >
                                        <XMarkIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 p-5">
                            <div className="grid gap-3 sm:grid-cols-3">
                                <div className="rounded-lg border border-slate-500/40 bg-slate-900/50 p-3">
                                    <p className="text-xs text-slate-400">Submitted</p>
                                    <p className="mt-1 text-sm font-semibold text-white">{selectedReport.submitted_at || 'N/A'}</p>
                                </div>
                                <div className="rounded-lg border border-slate-500/40 bg-slate-900/50 p-3">
                                    <p className="text-xs text-slate-400">Status</p>
                                    <p className="mt-1 text-sm font-semibold text-white">{statusLabel(selectedReport)}</p>
                                </div>
                                <div className="rounded-lg border border-slate-500/40 bg-slate-900/50 p-3">
                                    <p className="text-xs text-slate-400">File</p>
                                    <p className="mt-1 truncate text-sm font-semibold text-white">{selectedReport.file_name || 'No file'}</p>
                                </div>
                            </div>

                            {selectedReport.description && (
                                <div className="rounded-lg border border-slate-500/40 bg-slate-900/50 p-4">
                                    <h4 className="text-xs font-semibold uppercase text-slate-400">Description</h4>
                                    <p className="mt-2 text-sm text-slate-300">{selectedReport.description}</p>
                                </div>
                            )}

                            {selectedReport.supervisor_name && (
                                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
                                    <h4 className="text-xs font-semibold uppercase text-emerald-400">Supervisor</h4>
                                    <p className="mt-1 text-sm text-emerald-300">{selectedReport.supervisor_name}</p>
                                    {selectedReport.supervisor_feedback && (
                                        <p className="mt-2 text-sm text-emerald-200">Feedback: {selectedReport.supervisor_feedback}</p>
                                    )}
                                </div>
                            )}

                            {selectedReport.dean_name && (
                                <div className="rounded-lg border border-sky-500/30 bg-sky-500/10 p-4">
                                    <h4 className="text-xs font-semibold uppercase text-sky-400">Dean</h4>
                                    <p className="mt-1 text-sm text-sky-300">{selectedReport.dean_name}</p>
                                    {selectedReport.dean_feedback && (
                                        <p className="mt-2 text-sm text-sky-200">Feedback: {selectedReport.dean_feedback}</p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 border-t border-slate-500/40 px-5 py-4">
                            {selectedReport.can_edit && (
                                <button
                                    onClick={() => openEdit(selectedReport)}
                                    className="rounded-lg border border-sky-500/40 bg-sky-500/10 px-4 py-2 text-sm font-medium text-sky-300 transition hover:bg-sky-500/20"
                                >
                                    Edit
                                </button>
                            )}
                            <button
                                onClick={() => setSelectedReport(null)}
                                className="rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 px-4 py-2 text-sm font-semibold text-white"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingReport && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
                    onClick={() => setEditingReport(null)}
                >
                    <div
                        className="w-full max-w-xl rounded-xl border border-slate-500/60 bg-slate-800 shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="border-b border-slate-500/40 bg-gradient-to-r from-slate-800 to-rose-500/10 px-5 py-4">
                            <h3 className="text-xl font-bold text-white">Edit Report</h3>
                        </div>

                        <form onSubmit={submitEdit} className="space-y-4 p-5">
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-slate-300">Title</label>
                                <input
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="w-full rounded-lg border border-slate-500/50 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-rose-500/40 focus:ring-2 focus:ring-rose-500/15"
                                    placeholder="Title"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-semibold text-slate-300">Description</label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={4}
                                    className="w-full rounded-lg border border-slate-500/50 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-rose-500/40 focus:ring-2 focus:ring-rose-500/15"
                                    placeholder="Description"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-semibold text-slate-300">Date</label>
                                <input
                                    type="date"
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                    className="w-full rounded-lg border border-slate-500/50 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-rose-500/40 focus:ring-2 focus:ring-rose-500/15"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-semibold text-slate-300">Replace File</label>
                                <input
                                    type="file"
                                    onChange={(e) => setData('file', e.target.files[0])}
                                    className="w-full text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-rose-600 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:file:bg-rose-500"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingReport(null)}
                                    className="rounded-lg border border-slate-500/50 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50 hover:from-rose-500 hover:to-pink-500"
                                >
{processing ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
