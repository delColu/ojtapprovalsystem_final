import React, { useMemo, useState } from 'react';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    ArrowDownTrayIcon,
    BuildingOffice2Icon,
    CalendarDaysIcon,
    CheckCircleIcon,
    ClockIcon,
    DocumentIcon,
    FolderIcon,
    MapPinIcon,
    SparklesIcon,
    UserGroupIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline';

export default function Dashboard({ stats, recentReports, availableFolders, notifications, currentCompany = null }) {
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [selectedReport, setSelectedReport] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);

    const { auth } = usePage().props;
    const userName = auth?.user?.name || 'User';

    const { data, setData, post, processing, reset } = useForm({
        folder_id: '',
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        file: null,
    });

    const dashboardStats = stats || {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
    };

    const reports = recentReports || [];
    const folders = availableFolders || [];
    const alertNotifications = notifications || [];

    const completionRate = useMemo(() => {
        if (!dashboardStats.total) return 0;
        return Math.round((dashboardStats.approved / dashboardStats.total) * 100);
    }, [dashboardStats.approved, dashboardStats.total]);

    const latestReport = reports[0] || null;
    const nextDeadline = folders.find((folder) => folder?.due_date) || null;

    const quickStats = [
        {
            label: 'Total Reports',
            value: dashboardStats.total,
            helper: 'Recorded submissions',
            icon: DocumentIcon,
            iconWrap: 'bg-rose-100 text-rose-700',
            valueClass: 'text-slate-900',
        },
        {
            label: 'Pending Review',
            value: dashboardStats.pending,
            helper: 'Awaiting action',
            icon: ClockIcon,
            iconWrap: 'bg-amber-100 text-amber-700',
            valueClass: 'text-amber-600',
        },
        {
            label: 'Approved',
            value: dashboardStats.approved,
            helper: `${completionRate}% completion`,
            icon: CheckCircleIcon,
            iconWrap: 'bg-emerald-100 text-emerald-700',
            valueClass: 'text-emerald-600',
        },
        {
            label: 'Rejected',
            value: dashboardStats.rejected,
            helper: 'Needs revision',
            icon: XCircleIcon,
            iconWrap: 'bg-red-100 text-red-700',
            valueClass: 'text-red-600',
        },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('folder_id', data.folder_id);
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('date', data.date);
        if (data.file) {
            formData.append('file', data.file);
        }

        post('/submissions', {
            data: formData,
            onSuccess: () => {
                reset();
                setShowSubmitModal(false);
                setSelectedFolder(null);
            },
        });
    };

    const openSubmitModal = (folder) => {
        setSelectedFolder(folder);
        setData('folder_id', folder.id);
        setShowSubmitModal(true);
    };

    const openViewModal = (report) => {
        setSelectedReport(report);
        setShowViewModal(true);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved':
                return <CheckCircleIcon className="h-3 w-3" />;
            case 'rejected':
                return <XCircleIcon className="h-3 w-3" />;
            default:
                return <ClockIcon className="h-3 w-3" />;
        }
    };

    const getStatusBadgeStyle = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';
            case 'rejected':
                return 'bg-red-50 text-red-700 ring-red-600/20';
            default:
                return 'bg-amber-50 text-amber-700 ring-amber-600/20';
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Student Dashboard | CAST OJT System" />

            {/* Dark background with brighter borders */}
            <div className="min-h-[calc(100vh-88px)] bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="space-y-5">
                        {/* Hero Section - with brighter border */}
                        <div className="relative overflow-hidden rounded-xl border border-rose-500/40 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md">
                            <div className="absolute inset-0 bg-gradient-to-br from-rose-900/10 to-transparent" />

                            <div className="relative p-5">
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                        <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/40 bg-rose-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-rose-300">
                                            <SparklesIcon className="h-3.5 w-3.5" />
                                            Dashboard
                                        </div>
                                        <h1 className="mt-2 text-xl font-bold tracking-tight text-white">
                                            Welcome back, {userName} !
                                        </h1>
                                        <p className="mt-1 text-sm text-slate-300">
                                            Track your internship progress and submissions.
                                        </p>
                                    </div>

                                    <div className="flex gap-3">
                                        <div className="rounded-lg border border-white/15 bg-white/5 px-3 py-2">
                                            <p className="text-[10px] text-slate-400">Approval Rate</p>
                                            <p className="text-xl font-bold text-white">{completionRate}%</p>
                                        </div>
                                        <div className="rounded-lg border border-white/15 bg-white/5 px-3 py-2">
                                            <p className="text-[10px] text-slate-400">Folders</p>
                                            <p className="text-xl font-bold text-white">{folders.length}</p>
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
                                    <div className="col-span-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                                        <p className="text-[10px] text-slate-400">Next Due</p>
                                        <p className="text-sm font-semibold text-white">
                                            {nextDeadline?.due_date || 'No deadline'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Cards - with brighter borders */}
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            {quickStats.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <div
                                        key={item.label}
                                        className="rounded-xl border border-slate-500/60 bg-gradient-to-br from-slate-800/85 via-slate-800/70 to-slate-900/85 p-3 shadow-[0_14px_30px_-18px_rgba(15,23,42,0.85)] backdrop-blur-sm ring-1 ring-white/10 transition duration-300 hover:border-slate-400/70 hover:shadow-[0_18px_36px_-18px_rgba(15,23,42,0.95)] hover:bg-slate-800"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-slate-400">{item.label}</p>
                                                <p className={`mt-1 text-2xl font-bold text-white`}>{item.value}</p>
                                                <p className="text-[10px] text-slate-500">{item.helper}</p>
                                            </div>
                                            <div className={`rounded-lg p-2 ${item.iconWrap}`}>
                                                <Icon className="h-4 w-4" />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Main Content */}
                        <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
                            {/* Recent Reports - with brighter border */}
                            <div className="rounded-xl border border-slate-500/60 bg-gradient-to-br from-slate-800/80 via-slate-800/70 to-slate-900/85 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.9)] backdrop-blur-sm ring-1 ring-white/10">
                                <div className="flex items-center justify-between border-b border-slate-500/40 bg-white/[0.02] px-4 py-3">
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-wider text-rose-400">Activity</p>
                                        <h3 className="text-base font-bold text-white">Recent Reports</h3>
                                    </div>
                                    <DocumentIcon className="h-5 w-5 text-rose-400" />
                                </div>

                                <div className="p-4">
                                    {reports.length > 0 ? (
                                        <div className="space-y-2">
                                            {reports.map((report) => (
                                                <div
                                                    key={report.id}
                                                    className="cursor-pointer rounded-lg border border-slate-500/50 bg-gradient-to-r from-slate-900/80 to-slate-800/70 p-3 shadow-[0_12px_24px_-20px_rgba(15,23,42,0.9)] ring-1 ring-white/10 transition duration-300 hover:border-rose-500/60 hover:from-slate-900 hover:to-slate-800"
                                                    onClick={() => openViewModal(report)}
                                                >
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-start gap-2">
                                                                <DocumentIcon className="mt-0.5 h-4 w-4 text-rose-400" />
                                                                <div>
                                                                    <h4 className="truncate text-sm font-semibold text-white">
                                                                        {report.title}
                                                                    </h4>
                                                                    <p className="text-xs text-slate-400">{report.folder_name}</p>
                                                                </div>
                                                            </div>
                                                            <div className="mt-2 flex items-center gap-2">
                                                                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${getStatusBadgeStyle(report.status)}`}>
                                                                    {getStatusIcon(report.status)}
                                                                    <span className="capitalize text-[10px]">{report.status}</span>
                                                                </span>
                                                                <span className="text-[10px] text-slate-500">{report.created_at}</span>
                                                            </div>
                                                        </div>

                                                        <Link
                                                            href={`/submissions/${report.id}/download-pdf`}
                                                            className="rounded-lg border border-slate-500/50 bg-slate-800/90 p-1.5 text-slate-300 shadow-sm ring-1 ring-white/10 transition hover:border-rose-500/70 hover:bg-rose-500/10 hover:text-rose-300"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <ArrowDownTrayIcon className="h-4 w-4" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="rounded-lg border border-dashed border-rose-500/40 bg-rose-500/5 px-4 py-8 text-center">
                                            <DocumentIcon className="mx-auto h-8 w-8 text-rose-400/50" />
                                            <p className="mt-2 text-sm text-slate-400">No reports yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Available Folders - with brighter border */}
                            <div className="rounded-xl border border-rose-500/40 bg-gradient-to-br from-slate-800/80 via-slate-800/70 to-slate-900/85 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.9)] backdrop-blur-sm ring-1 ring-white/10">
                                <div className="flex items-center justify-between border-b border-rose-500/30 bg-gradient-to-r from-rose-500/15 via-rose-500/8 to-transparent px-4 py-3">
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-wider text-rose-400">Queue</p>
                                        <h3 className="text-base font-bold text-white">Available Folders</h3>
                                    </div>
                                    <FolderIcon className="h-5 w-5 text-rose-400" />
                                </div>

                                <div className="p-4">
                                    {folders.length > 0 ? (
                                        <div className="space-y-3">
                                            {folders.map((folder) => (
                                                <div
                                                    key={folder.id}
                                                    className="rounded-lg border border-slate-500/50 bg-gradient-to-r from-slate-900/80 to-slate-800/70 p-3 shadow-[0_12px_24px_-20px_rgba(15,23,42,0.9)] ring-1 ring-white/10 transition duration-300 hover:border-rose-500/60 hover:from-slate-900 hover:to-slate-800"
                                                >
                                                    <div className="flex items-start gap-2">
                                                        <FolderIcon className="mt-0.5 h-4 w-4 text-rose-400" />
                                                        <div className="min-w-0 flex-1">
                                                            <h4 className="text-sm font-semibold text-white">{folder.name}</h4>
                                                            {folder.description && (
                                                                <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                                                                    {folder.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                                                        {folder.due_date && (
                                                            <div className="flex items-center gap-1 rounded-md border border-slate-500/40 bg-slate-800/90 px-2 py-1 text-slate-300 ring-1 ring-white/10">
                                                                <CalendarDaysIcon className="h-3 w-3 text-rose-400" />
                                                                <span>{folder.due_date}</span>
                                                            </div>
                                                        )}
                                                        {folder.supervisor_name && (
                                                            <div className="flex items-center gap-1 rounded-md border border-slate-500/40 bg-slate-800/90 px-2 py-1 text-slate-300 ring-1 ring-white/10">
                                                                <UserGroupIcon className="h-3 w-3 text-rose-400" />
                                                                <span>{folder.supervisor_name}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <button
                                                        onClick={() => openSubmitModal(folder)}
                                                        className="mt-3 w-full rounded-lg border border-rose-500/40 bg-gradient-to-r from-rose-600 to-pink-600 px-3 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_-14px_rgba(244,63,94,0.8)] transition duration-300 hover:from-rose-500 hover:to-pink-500 hover:shadow-[0_14px_28px_-14px_rgba(244,63,94,0.95)]"
                                                    >
                                                        Submit Report
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="rounded-lg border border-dashed border-rose-500/40 bg-rose-500/5 px-4 py-8 text-center">
                                            <FolderIcon className="mx-auto h-8 w-8 text-rose-400/50" />
                                            <p className="mt-2 text-sm text-slate-400">No folders available</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit Modal - with brighter border */}
            {showSubmitModal && selectedFolder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
                    <div className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-xl border border-slate-500/60 bg-slate-800 shadow-xl">
                        <div className="border-b border-rose-500/30 bg-gradient-to-r from-rose-500/10 to-transparent px-5 py-4">
                            <h2 className="text-xl font-bold text-white">Submit Report</h2>
                            <p className="text-sm text-slate-400">{selectedFolder.name}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 p-5">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-300">Title *</label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="w-full rounded-lg border border-slate-500/50 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-300">Description *</label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                    className="w-full rounded-lg border border-slate-500/50 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-300">Date</label>
                                <input
                                    type="date"
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                    className="w-full rounded-lg border border-slate-500/50 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-300">File</label>
                                <input
                                    type="file"
                                    onChange={(e) => setData('file', e.target.files[0])}
                                    className="w-full text-sm text-slate-300 file:mr-2 file:rounded-lg file:border-0 file:bg-rose-600 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:file:bg-rose-500"
                                    accept=".pdf,.doc,.docx,.txt"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowSubmitModal(false);
                                        setSelectedFolder(null);
                                        reset();
                                    }}
                                    className="rounded-lg border border-slate-500/50 px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 hover:from-rose-500 hover:to-pink-500"
                                >
                                    {processing ? 'Submitting...' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Modal - with brighter border */}
            {showViewModal && selectedReport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
                    <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl border border-slate-500/60 bg-slate-800 shadow-xl">
                        <div className="border-b border-slate-500/40 bg-gradient-to-r from-slate-800 to-rose-500/10 px-5 py-4">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h2 className="text-xl font-bold text-white">{selectedReport.title}</h2>
                                    <p className="text-sm text-slate-400">{selectedReport.folder_name}</p>
                                </div>
                                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${getStatusBadgeStyle(selectedReport.status)}`}>
                                    {getStatusIcon(selectedReport.status)}
                                    <span className="capitalize">{selectedReport.status}</span>
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4 p-5">
                            <div className="rounded-lg border border-slate-500/40 bg-slate-900/50 p-3">
                                <h4 className="text-xs font-semibold text-slate-400">Description</h4>
                                <p className="mt-1 text-sm text-slate-300">{selectedReport.description}</p>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-lg border border-slate-500/40 bg-slate-900/50 p-3">
                                    <h4 className="text-xs font-semibold text-slate-400">Date</h4>
                                    <p className="mt-1 text-sm text-slate-300">{selectedReport.created_at}</p>
                                </div>
                                <div className="rounded-lg border border-slate-500/40 bg-slate-900/50 p-3">
                                    <h4 className="text-xs font-semibold text-slate-400">Status</h4>
                                    <p className="mt-1 text-sm capitalize text-slate-300">{selectedReport.status}</p>
                                </div>
                            </div>

                            {selectedReport.feedback && (
                                <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3">
                                    <h4 className="text-xs font-semibold text-amber-400">Feedback</h4>
                                    <p className="mt-1 text-sm text-amber-300">{selectedReport.feedback}</p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end border-t border-slate-500/40 px-5 py-4">
                            <button
                                onClick={() => setShowViewModal(false)}
                                className="rounded-lg border border-slate-500/50 bg-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
