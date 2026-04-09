import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    EmptyState,
    PageIntro,
    SearchField,
    SecondaryAction,
    SelectField,
    StatusBadge,
} from './Partials/DeanShared';

export default function Submissions({ submissions, departments, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [department, setDepartment] = useState(filters.department || '');
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [reviewMode, setReviewMode] = useState(null);
    const form = useForm({ feedback: '' });

    const applyFilters = (nextSearch = search, nextStatus = status, nextDepartment = department) => {
        router.get(route('dean.submissions.index'), { search: nextSearch, status: nextStatus, department: nextDepartment }, { preserveState: true, replace: true });
    };

    const openReview = (submission, mode) => {
        setSelectedSubmission(submission);
        setReviewMode(mode);
        form.setData('feedback', '');
    };

    const submitReview = () => {
        if (!selectedSubmission) return;
        const endpoint = reviewMode === 'approve' ? route('submissions.approve', selectedSubmission.id) : route('submissions.reject', selectedSubmission.id);
        form.post(endpoint, {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedSubmission(null);
                setReviewMode(null);
                form.reset();
            },
        });
    };

    const destroySubmission = (submissionId) => {
        if (!window.confirm('Delete this submission?')) return;
        router.delete(route('submissions.destroy', submissionId), { preserveScroll: true });
    };

    const getUploadedFileName = (submission) => submission.file_name || submission.file_path?.split('/').pop() || null;
    const getPreviewTarget = (submission) => (getUploadedFileName(submission) || submission.file_path || '').toLowerCase();
    const isPdf = (submission) => getPreviewTarget(submission).endsWith('.pdf');
    const isImage = (submission) => ['.png', '.jpg', '.jpeg', '.gif', '.webp'].some((extension) => getPreviewTarget(submission).endsWith(extension));
    const isText = (submission) => ['.txt', '.md', '.csv'].some((extension) => getPreviewTarget(submission).endsWith(extension));

    return (
        <AuthenticatedLayout>
            <Head title="All Submissions" />

            <div className="space-y-8 bg-[#0077b6] px-4 py-6 sm:px-6 lg:px-8">
                <PageIntro
                    eyebrow="Submissions"
                    title="All Submissions"
                    description="Review forwarded student reports with supervisor approval proof, attached files, and dean feedback."
                />

                {/* Filter Section - No Card */}
                <div className="flex flex-col gap-3 xl:flex-row">
                    <SearchField
                        value={search}
                        onChange={(value) => {
                            setSearch(value);
                            applyFilters(value, status, department);
                        }}
                        placeholder="Search by intern or title..."
                    />
                    <SelectField
                        value={status}
                        onChange={(value) => {
                            setStatus(value);
                            applyFilters(search, value, department);
                        }}
                        options={[
                            { value: 'pending', label: 'Pending' },
                            { value: 'approved', label: 'Approved' },
                            { value: 'rejected', label: 'Rejected' },
                            { value: 'forwarded', label: 'Forwarded' },
                        ]}
                        placeholder="All Statuses"
                    />
                    <SelectField
                        value={department}
                        onChange={(value) => {
                            setDepartment(value);
                            applyFilters(search, status, value);
                        }}
                        options={departments}
                        placeholder="All Departments"
                    />
                </div>

                {/* Submissions Table - No Card */}
                {submissions.length === 0 ? (
                    <div className="rounded-2xl bg-white/95 p-12 text-center backdrop-blur-sm">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                            <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="mt-4 text-lg font-semibold text-gray-900">No submissions found</h3>
                        <p className="mt-1 text-gray-600">Try another search or wait for new forwarded reports.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-2xl bg-white/95 shadow-sm backdrop-blur-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-[#0077b6]/10">
                                <tr className="text-left text-xs uppercase tracking-wide text-gray-600">
                                    <th className="px-4 py-3 font-semibold">Intern</th>
                                    <th className="px-4 py-3 font-semibold">Report Title</th>
                                    <th className="px-4 py-3 font-semibold">Folder</th>
                                    <th className="px-4 py-3 font-semibold">Department</th>
                                    <th className="px-4 py-3 font-semibold">Supervisor Proof</th>
                                    <th className="px-4 py-3 font-semibold text-center">Status</th>
                                    <th className="px-4 py-3 font-semibold text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {submissions.map((submission) => (
                                    <tr key={submission.id} className="transition hover:bg-[#0077b6]/5">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{submission.intern_name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            <div>{submission.report_title}</div>
                                            {getUploadedFileName(submission) && <div className="mt-1 text-xs text-gray-400">{getUploadedFileName(submission)}</div>}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{submission.folder_name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{submission.department}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {submission.supervisor_name}
                                            <div className="text-xs text-gray-400">{submission.supervisor_approved_at || 'Not yet approved by supervisor'}</div>
                                        </td>
                                        <td className="px-4 py-3 text-center"><StatusBadge status={submission.status} /></td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap justify-center gap-2">
                                                <SecondaryAction onClick={() => setSelectedSubmission(submission)} className="px-3 py-2 text-xs">View</SecondaryAction>
                                                <SecondaryAction onClick={() => window.location.assign(route('submissions.download-pdf', submission.id))} className="px-3 py-2 text-xs">PDF</SecondaryAction>
                                                {submission.status === 'forwarded' && (
                                                    <button
                                                        onClick={() => openReview(submission, 'approve')}
                                                        className="rounded-lg bg-[#0077b6] px-3 py-2 text-xs font-medium text-white transition hover:bg-[#005f8c]"
                                                    >
                                                        Approve
                                                    </button>
                                                )}
                                                {submission.status === 'forwarded' && (
                                                    <button
                                                        onClick={() => openReview(submission, 'reject')}
                                                        className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700 transition hover:bg-amber-100"
                                                    >
                                                        Reject
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => destroySubmission(submission.id)}
                                                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 transition hover:bg-red-100"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {selectedSubmission && !reviewMode && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedSubmission(null)}>
                    <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-6" onClick={(event) => event.stopPropagation()}>
                        <h3 className="text-2xl font-semibold text-gray-900">{selectedSubmission.report_title}</h3>
                        <div className="mt-5 space-y-4 text-sm text-gray-700">
                            <p><strong>Intern:</strong> {selectedSubmission.intern_name}</p>
                            <p><strong>Description:</strong> {selectedSubmission.description}</p>
                            <p><strong>Supervisor Proof:</strong> {selectedSubmission.supervisor_name} {selectedSubmission.supervisor_approved_at ? `on ${selectedSubmission.supervisor_approved_at}` : ''}</p>
                            {selectedSubmission.supervisor_feedback && <p><strong>Supervisor Feedback:</strong> {selectedSubmission.supervisor_feedback}</p>}
                            {selectedSubmission.dean_feedback && <p><strong>Dean Feedback:</strong> {selectedSubmission.dean_feedback}</p>}
                            {selectedSubmission.file_path && (
                                <div className="space-y-3">
                                    <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                                        <p className="font-semibold text-gray-900">Student Uploaded File</p>
                                        <p className="mt-1 break-all text-gray-600">{getUploadedFileName(selectedSubmission) || 'Attached file'}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <a href={route('submissions.file', selectedSubmission.id)} target="_blank" rel="noreferrer" className="rounded-xl border border-gray-300 px-3 py-2 font-medium text-gray-700">Open File</a>
                                        <a href={route('submissions.file.download', selectedSubmission.id)} className="rounded-xl border border-gray-300 px-3 py-2 font-medium text-gray-700">Download File</a>
                                        <a href={route('submissions.download-pdf', selectedSubmission.id)} className="rounded-xl border border-gray-300 px-3 py-2 font-medium text-gray-700">Export Summary PDF</a>
                                    </div>

                                    {isImage(selectedSubmission) ? (
                                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-3">
                                            <img
                                                src={route('submissions.file', selectedSubmission.id)}
                                                alt="Student uploaded file preview"
                                                className="max-h-[560px] w-full rounded-xl object-contain"
                                            />
                                        </div>
                                    ) : isPdf(selectedSubmission) || isText(selectedSubmission) ? (
                                        <iframe
                                            src={route('submissions.file', selectedSubmission.id)}
                                            title="Forwarded report preview"
                                            className="h-[560px] w-full rounded-2xl border border-gray-200"
                                        />
                                    ) : (
                                        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-sm text-gray-500">
                                            This is still the exact uploaded file from the intern. If your browser cannot preview this file type here, use <strong>Open File</strong> to view the original attachment or <strong>Download File</strong> to save it.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button onClick={() => setSelectedSubmission(null)} className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {selectedSubmission && reviewMode && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
                        <h3 className="text-xl font-semibold text-gray-900">{reviewMode === 'approve' ? 'Approve Submission' : 'Reject Submission'}</h3>
                        <p className="mt-1 text-sm text-gray-500">Feedback is required before this decision is emailed to the student.</p>
                        <textarea rows={5} value={form.data.feedback} onChange={(event) => form.setData('feedback', event.target.value)} className="mt-5 w-full rounded-xl border border-gray-300 px-4 py-3" placeholder="Dean feedback" />
                        {form.errors.feedback && <p className="mt-2 text-sm text-red-600">{form.errors.feedback}</p>}
                        <div className="mt-6 flex justify-end gap-3">
                            <button onClick={() => { setReviewMode(null); form.reset(); }} className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700">Cancel</button>
                            <button onClick={submitReview} className={`rounded-xl px-4 py-2 text-sm font-semibold text-white ${reviewMode === 'approve' ? 'bg-[#0077b6]' : 'bg-red-600'}`}>
                                {reviewMode === 'approve' ? 'Approve and Email Student' : 'Reject and Email Student'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
