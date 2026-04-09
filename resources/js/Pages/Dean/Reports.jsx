import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    EmptyState,
    PageIntro,
    SearchField,
    SecondaryAction,
    SelectField,
    StatusBadge,
} from './Partials/DeanShared';

export default function Reports({ submissions, departments, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [department, setDepartment] = useState(filters.department || '');
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    const applyFilters = (nextSearch = search, nextStatus = status, nextDepartment = department) => {
        router.get(route('dean.reports.index'), { search: nextSearch, status: nextStatus, department: nextDepartment }, { preserveState: true, replace: true });
    };

    const destroySubmission = (submissionId) => {
        if (!window.confirm('Delete this report?')) {
            return;
        }

        router.delete(route('submissions.destroy', submissionId), { preserveScroll: true });
    };

    const getUploadedFileName = (submission) => submission.file_name || submission.file_path?.split('/').pop() || null;
    const getPreviewTarget = (submission) => (getUploadedFileName(submission) || submission.file_path || '').toLowerCase();
    const isPdf = (submission) => getPreviewTarget(submission).endsWith('.pdf');
    const isImage = (submission) => ['.png', '.jpg', '.jpeg', '.gif', '.webp'].some((extension) => getPreviewTarget(submission).endsWith(extension));
    const isText = (submission) => ['.txt', '.md', '.csv'].some((extension) => getPreviewTarget(submission).endsWith(extension));

    return (
        <AuthenticatedLayout>
            <Head title="Reports" />

            <div className="space-y-8 bg-[#0077b6] px-4 py-6 sm:px-6 lg:px-8">
                <PageIntro
                    eyebrow="Reports"
                    title="Reports"
                    description="All submissions with report metadata, status, and quick actions."
                    action={<SecondaryAction onClick={() => window.location.assign(route('dean.reports.download-pdf', filters))}>Download All PDF</SecondaryAction>}
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

                {/* Reports Table - No Card */}
                {submissions.length === 0 ? (
                    <div className="rounded-2xl bg-white/95 p-12 text-center backdrop-blur-sm">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                            <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="mt-4 text-lg font-semibold text-gray-900">No reports found</h3>
                        <p className="mt-1 text-gray-600">There are no matching reports for the current filters.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-2xl bg-white/95 shadow-sm backdrop-blur-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-[#0077b6]/10">
                                <tr className="text-left text-xs uppercase tracking-wide text-gray-600">
                                    <th className="px-4 py-3 font-semibold">Intern</th>
                                    <th className="px-4 py-3 font-semibold">Report</th>
                                    <th className="px-4 py-3 font-semibold">Folder</th>
                                    <th className="px-4 py-3 font-semibold">Supervisor</th>
                                    <th className="px-4 py-3 font-semibold">Date</th>
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
                                        <td className="px-4 py-3 text-sm text-gray-600">{submission.supervisor_name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{submission.date}</td>
                                        <td className="px-4 py-3 text-center"><StatusBadge status={submission.status} /></td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap justify-center gap-2">
                                                <SecondaryAction onClick={() => setSelectedSubmission(submission)} className="px-3 py-2 text-xs">View</SecondaryAction>
                                                <SecondaryAction onClick={() => window.location.assign(route('submissions.download-pdf', submission.id))} className="px-3 py-2 text-xs">Summary PDF</SecondaryAction>
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

            {selectedSubmission && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedSubmission(null)}>
                    <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-6" onClick={(event) => event.stopPropagation()}>
                        <h3 className="text-2xl font-semibold text-gray-900">{selectedSubmission.report_title}</h3>
                        <div className="mt-5 space-y-4 text-sm text-gray-700">
                            <p><strong>Intern:</strong> {selectedSubmission.intern_name}</p>
                            <p><strong>Folder:</strong> {selectedSubmission.folder_name}</p>
                            <p><strong>Supervisor:</strong> {selectedSubmission.supervisor_name}</p>
                            <p><strong>Status:</strong> {selectedSubmission.status}</p>
                            {selectedSubmission.description && <p><strong>Description:</strong> {selectedSubmission.description}</p>}
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
                                            title="Dean report preview"
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
        </AuthenticatedLayout>
    );
}
