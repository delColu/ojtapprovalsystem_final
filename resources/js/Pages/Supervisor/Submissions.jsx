import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import SubmissionModal from './Partials/SubmissionModal';

const reviewStyles = {
    approve: {
        title: 'Approve Submission',
        action: 'Approve and Email Student',
        badge: 'Approve flow',
        button: 'bg-emerald-600 text-white hover:bg-emerald-700',
        ring: 'focus:ring-emerald-500/20',
    },
    reject: {
        title: 'Reject Submission',
        action: 'Reject and Email Student',
        badge: 'Reject flow',
        button: 'bg-rose-600 text-white hover:bg-rose-700',
        ring: 'focus:ring-rose-500/20',
    },
};

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

function StatusBadge() {
    return (
        <span className="rounded-full border border-amber-500/30 bg-amber-500/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">
            Pending Review
        </span>
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

export default function Submissions({ pendingSubmissions = [] }) {
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [reviewMode, setReviewMode] = useState(null);
    const form = useForm({ feedback: '' });

    const openReview = (submission, mode) => {
        setSelectedSubmission(submission);
        setReviewMode(mode);
        form.setData('feedback', '');
        form.clearErrors();
    };

    const submitReview = () => {
        if (!selectedSubmission || !form.data.feedback.trim()) {
            return;
        }

        const routeName = reviewMode === 'approve' ? 'submissions.approve' : 'submissions.reject';

        form.post(route(routeName, selectedSubmission.id), {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedSubmission(null);
                setReviewMode(null);
                form.reset();
            },
        });
    };

    const metrics = useMemo(() => {
        const today = new Date().toDateString();
        const todayCount = pendingSubmissions.filter((submission) => {
            if (!submission.created_at) {
                return false;
            }

            return new Date(submission.created_at).toDateString() === today;
        }).length;

        const folders = new Set(
            pendingSubmissions
                .map((submission) => submission.folder?.name)
                .filter(Boolean),
        );

        return {
            total: pendingSubmissions.length,
            today: todayCount,
            folders: folders.size,
        };
    }, [pendingSubmissions]);

    const activeReviewStyle = reviewMode ? reviewStyles[reviewMode] : null;

    return (
        <AuthenticatedLayout>
            <Head title="Supervisor Submissions" />

            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-6 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl space-y-6">
                    <div className="border-b-2 border-slate-700 pb-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div className="space-y-2">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-400">
                                    Supervisor Review Desk
                                </p>
                                <div className="space-y-1">
                                    <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                                        Pending Submissions
                                    </h1>
                                    <p className="max-w-xl text-sm text-slate-400">
                                        Review intern reports using the same clean card layout as the interns page.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <StatCard
                                    label="Queue"
                                    value={metrics.total}
                                    accent="from-slate-500 to-slate-600"
                                />
                                <StatCard
                                    label="Today"
                                    value={metrics.today}
                                    accent="from-cyan-600 to-blue-500"
                                />
                                <StatCard
                                    label="Folders"
                                    value={metrics.folders}
                                    accent="from-emerald-500 to-teal-400"
                                />
                            </div>
                        </div>
                    </div>

                    <section className="space-y-3">
                        <div className="grid gap-2 rounded-lg border border-slate-500/80 bg-gradient-to-b from-slate-800/95 to-slate-900/95 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.9)] ring-1 ring-white/5 md:grid-cols-[1.35fr_1fr_0.9fr_0.75fr]">
                            <div>Submission</div>
                            <div>Intern & Folder</div>
                            <div className="md:text-center">Date</div>
                            <div className="md:text-center">Status</div>
                        </div>

                        {pendingSubmissions.length === 0 ? (
                            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-500/80 bg-slate-800/60 px-6 text-center shadow-[0_18px_40px_-28px_rgba(15,23,42,0.9)] ring-1 ring-white/5">
                                <div className="rounded-lg border border-slate-500/80 bg-slate-700/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-300 shadow-sm">
                                    Clear Queue
                                </div>
                                <p className="mt-3 text-sm font-medium text-slate-400">Nothing waiting right now.</p>
                                <p className="mt-1 text-sm text-slate-500">New submissions will appear here once interns upload reports.</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {pendingSubmissions.map((submission, index) => (
                                    <div
                                        key={submission.id}
                                        className="rounded-lg border border-slate-500/80 bg-gradient-to-b from-slate-800/88 to-slate-900/82 px-4 py-3 text-left shadow-[0_18px_40px_-28px_rgba(15,23,42,0.9)] ring-1 ring-white/5 transition-all duration-300 hover:border-cyan-500/45 hover:shadow-[0_22px_44px_-26px_rgba(6,182,212,0.2)]"
                                    >
                                        <div className="grid gap-3 md:grid-cols-[1.35fr_1fr_0.9fr_0.75fr] md:items-center">
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-cyan-500/20 bg-gradient-to-br from-cyan-500/18 to-indigo-500/18 text-sm font-semibold text-cyan-300 shadow-inner shadow-cyan-950/20">
                                                        {submission.title?.charAt(0).toUpperCase() || 'S'}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <p className="truncate text-sm font-semibold tracking-tight text-white">
                                                                {submission.title}
                                                            </p>
                                                            <span className="hidden sm:inline-flex rounded-full border border-slate-500/80 bg-slate-700/85 px-2 py-0.5 text-[9px] font-semibold text-slate-300 shadow-sm">
                                                                #{String(index + 1).padStart(2, '0')}
                                                            </span>
                                                        </div>
                                                        <p className="mt-0.5 truncate text-[11px] text-slate-400">
                                                            {submission.file_name || 'No attached file name'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="rounded-lg border border-slate-500/80 bg-slate-800/65 p-3 ring-1 ring-white/5">
                                                    <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                                                        Intern
                                                    </p>
                                                    <p className="truncate text-xs font-medium text-slate-300">
                                                        {submission.student?.name || 'Unknown student'}
                                                    </p>
                                                </div>
                                                <div className="rounded-lg border border-slate-500/80 bg-slate-800/65 p-3 ring-1 ring-white/5">
                                                    <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                                                        Folder
                                                    </p>
                                                    <p className="truncate text-xs font-medium text-slate-300">
                                                        {submission.folder?.name || 'No folder'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-start gap-2 md:items-center">
                                                <span className="inline-flex rounded-full border border-slate-500/80 bg-slate-700/85 px-3 py-1 text-[11px] font-medium text-slate-300 shadow-sm">
                                                    {formatDate(submission.created_at)}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedSubmission(submission)}
                                                    className="inline-flex items-center justify-center rounded-lg border border-slate-500/80 bg-slate-700/90 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-600 hover:text-white"
                                                >
                                                    View
                                                </button>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between gap-2 md:flex-col md:items-center md:justify-center">
                                                    <StatusBadge />
                                                </div>

                                                <div className="flex flex-wrap gap-1.5 md:justify-center">
                                                    <a
                                                        href={route('submissions.download-pdf', submission.id)}
                                                        className="inline-flex items-center justify-center rounded-lg border border-slate-500/80 bg-slate-700/90 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-600 hover:text-white"
                                                    >
                                                        PDF
                                                    </a>
                                                    <button
                                                        type="button"
                                                        onClick={() => openReview(submission, 'approve')}
                                                        className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-700"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => openReview(submission, 'reject')}
                                                        className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-rose-700"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {pendingSubmissions.length > 0 && (
                            <div className="flex items-center justify-between rounded-lg border border-slate-500/80 bg-gradient-to-b from-slate-800/95 to-slate-900/95 px-4 py-2.5 text-xs text-slate-400 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.9)] ring-1 ring-white/5">
                                <span>Showing {pendingSubmissions.length} pending submissions</span>
                                <span className="text-[11px]">Needs supervisor review</span>
                            </div>
                        )}
                    </section>
                </div>
            </div>

            {selectedSubmission && !reviewMode && (
                <SubmissionModal submission={selectedSubmission} onClose={() => setSelectedSubmission(null)}>
                    <a
                        href={route('submissions.download-pdf', selectedSubmission.id)}
                        className="rounded-lg border-2 border-slate-600 bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-600 hover:text-white"
                    >
                        Download Summary PDF
                    </a>
                    <button
                        type="button"
                        onClick={() => openReview(selectedSubmission, 'approve')}
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                    >
                        Approve
                    </button>
                    <button
                        type="button"
                        onClick={() => openReview(selectedSubmission, 'reject')}
                        className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
                    >
                        Reject
                    </button>
                </SubmissionModal>
            )}

            {selectedSubmission && reviewMode && activeReviewStyle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm">
                    <div className="relative w-full max-w-xl overflow-hidden rounded-xl border border-slate-500/80 bg-gradient-to-b from-slate-800 to-slate-900 shadow-2xl ring-1 ring-white/5">
                        <div className="flex items-start justify-between border-b border-slate-600/80 bg-white/[0.02] px-6 py-5">
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-400">
                                    {activeReviewStyle.badge}
                                </p>
                                <h3 className="mt-1 text-xl font-semibold tracking-tight text-white">
                                    {activeReviewStyle.title}
                                </h3>
                                <p className="mt-1 text-sm text-slate-400">
                                    Add your feedback for {selectedSubmission.title}.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setReviewMode(null);
                                    form.reset();
                                }}
                                className="rounded-full p-1 text-slate-400 transition hover:bg-slate-700 hover:text-slate-300"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4 px-6 py-5">
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-lg border border-slate-500/80 bg-slate-800/65 px-4 py-3 ring-1 ring-white/5">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">Student</p>
                                    <p className="mt-1 text-sm font-medium text-white">
                                        {selectedSubmission.student?.name || 'Unknown student'}
                                    </p>
                                </div>
                                <div className="rounded-lg border border-slate-500/80 bg-slate-800/65 px-4 py-3 ring-1 ring-white/5">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">Submitted</p>
                                    <p className="mt-1 text-sm font-medium text-white">
                                        {formatDate(selectedSubmission.created_at)}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <textarea
                                    rows={5}
                                    value={form.data.feedback}
                                    onChange={(event) => form.setData('feedback', event.target.value)}
                                    className={`w-full rounded-lg border-2 border-slate-600 bg-slate-800/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 ${activeReviewStyle.ring}`}
                                    placeholder="Write your feedback here."
                                />
                                {form.errors.feedback && (
                                    <p className="mt-2 text-sm text-rose-400">{form.errors.feedback}</p>
                                )}
                            </div>

                            <div className="flex flex-wrap justify-end gap-3 border-t border-slate-600/80 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setReviewMode(null);
                                        form.reset();
                                    }}
                                    className="rounded-lg border border-slate-500/80 bg-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-600 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={submitReview}
                                    className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${activeReviewStyle.button}`}
                                >
                                    {activeReviewStyle.action}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
