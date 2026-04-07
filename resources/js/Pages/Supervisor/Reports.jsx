import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import SubmissionModal from './Partials/SubmissionModal';
import StatusBadge from './Partials/StatusBadge';

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

    return (
        <AuthenticatedLayout>
            <Head title="Supervisor Reports" />
            <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
                <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Reports</h2>
                            <p className="text-sm text-gray-500">Search bar plus list of intern, report title, folder, status, date submitted, and actions.</p>
                        </div>
                        <form onSubmit={runSearch} className="flex w-full max-w-md items-center gap-2">
                            <input type="text" value={searchForm.data.search} onChange={(event) => searchForm.setData('search', event.target.value)} placeholder="Search reports" className="w-full rounded-xl border border-gray-300 px-4 py-3" />
                            <button type="submit" className="rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white">Search</button>
                        </form>
                    </div>
                    {reports.length === 0 ? (
                        <p className="rounded-2xl bg-gray-50 px-4 py-5 text-sm text-gray-500">No reports found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Intern</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Report Title</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Folder</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Date Submitted</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {reports.map((report) => (
                                        <tr key={report.id}>
                                            <td className="px-4 py-4 text-sm text-gray-700">{report.student?.name || 'Unknown student'}</td>
                                            <td className="px-4 py-4 text-sm font-medium text-gray-900">{report.title}</td>
                                            <td className="px-4 py-4 text-sm text-gray-600">{report.folder?.name || 'No folder'}</td>
                                            <td className="px-4 py-4 text-sm"><StatusBadge status={report.status} /></td>
                                            <td className="px-4 py-4 text-sm text-gray-600">{report.submitted_at || 'N/A'}</td>
                                            <td className="px-4 py-4 text-right text-sm">
                                                <div className="flex justify-end gap-2">
                                                    <button type="button" onClick={() => setSelectedSubmission(report)} className="rounded-lg border border-gray-300 px-3 py-2 text-gray-700">View</button>
                                                    <a href={`/submissions/${report.id}/download-pdf`} className="rounded-lg border border-gray-300 px-3 py-2 text-gray-700">PDF</a>
                                                    <button type="button" onClick={() => deleteSubmission(report)} className="rounded-lg border border-red-200 px-3 py-2 text-red-600">Delete</button>
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

            {selectedSubmission && (
                <SubmissionModal submission={selectedSubmission} onClose={() => setSelectedSubmission(null)}>
                    <a href={`/submissions/${selectedSubmission.id}/download-pdf`} className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700">Download PDF</a>
                    <button type="button" onClick={() => deleteSubmission(selectedSubmission)} className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600">Delete</button>
                </SubmissionModal>
            )}
        </AuthenticatedLayout>
    );
}
