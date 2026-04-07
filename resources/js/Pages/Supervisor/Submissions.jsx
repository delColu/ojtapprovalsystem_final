import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import SubmissionModal from './Partials/SubmissionModal';

export default function Submissions({ pendingSubmissions = [] }) {
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const rejectForm = useForm({ feedback: '' });

    const approveSubmission = (submission) => {
        if (window.confirm(`Approve "${submission.title}"?`)) {
            router.post(`/submissions/${submission.id}/approve`);
        }
    };

    const openRejectModal = (submission) => {
        setSelectedSubmission(submission);
        rejectForm.reset();
        setShowRejectModal(true);
    };

    const submitReject = () => {
        if (!selectedSubmission) return;
        rejectForm.post(`/submissions/${selectedSubmission.id}/reject`, {
            onSuccess: () => {
                setShowRejectModal(false);
                setSelectedSubmission(null);
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Supervisor Submissions" />
            <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
                <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-900">Review Pending Submissions</h2>
                    <p className="mt-1 text-sm text-gray-500">Supervisor can view, download PDF, approve or reject, and add feedback/comments.</p>
                    {pendingSubmissions.length === 0 ? (
                        <p className="mt-5 rounded-2xl bg-gray-50 px-4 py-5 text-sm text-gray-500">No pending submissions to review.</p>
                    ) : (
                        <div className="mt-5 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Intern</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Report Title</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Folder</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Date Submitted</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {pendingSubmissions.map((submission) => (
                                        <tr key={submission.id}>
                                            <td className="px-4 py-4 text-sm text-gray-700">{submission.student?.name || 'Unknown student'}</td>
                                            <td className="px-4 py-4 text-sm font-medium text-gray-900">{submission.title}</td>
                                            <td className="px-4 py-4 text-sm text-gray-600">{submission.folder?.name || 'No folder'}</td>
                                            <td className="px-4 py-4 text-sm text-gray-600">{submission.created_at ? new Date(submission.created_at).toLocaleDateString() : 'N/A'}</td>
                                            <td className="px-4 py-4 text-right text-sm">
                                                <div className="flex justify-end gap-2">
                                                    <button type="button" onClick={() => setSelectedSubmission(submission)} className="rounded-lg border border-gray-300 px-3 py-2 text-gray-700">View</button>
                                                    <a href={`/submissions/${submission.id}/download-pdf`} className="rounded-lg border border-gray-300 px-3 py-2 text-gray-700">Download PDF</a>
                                                    <button type="button" onClick={() => approveSubmission(submission)} className="rounded-lg bg-green-600 px-3 py-2 text-white">Approve</button>
                                                    <button type="button" onClick={() => openRejectModal(submission)} className="rounded-lg bg-red-600 px-3 py-2 text-white">Reject</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>

            {!showRejectModal && selectedSubmission && (
                <SubmissionModal submission={selectedSubmission} onClose={() => setSelectedSubmission(null)}>
                    <a href={`/submissions/${selectedSubmission.id}/download-pdf`} className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700">Download PDF</a>
                    <button type="button" onClick={() => approveSubmission(selectedSubmission)} className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white">Approve</button>
                    <button type="button" onClick={() => openRejectModal(selectedSubmission)} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white">Reject</button>
                </SubmissionModal>
            )}

            {showRejectModal && selectedSubmission && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
                        <h3 className="text-xl font-semibold text-gray-900">Reject Submission</h3>
                        <p className="mt-1 text-sm text-gray-500">Add feedback/comments for {selectedSubmission.title}.</p>
                        <div className="mt-5">
                            <textarea rows={5} value={rejectForm.data.feedback} onChange={(event) => rejectForm.setData('feedback', event.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3" placeholder="Explain why the report is being rejected." />
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button type="button" onClick={() => { setShowRejectModal(false); setSelectedSubmission(null); }} className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700">Cancel</button>
                            <button type="button" onClick={submitReject} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white">Reject</button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
