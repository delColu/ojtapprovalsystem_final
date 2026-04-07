import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    EmptyState,
    PageIntro,
    Panel,
    SearchField,
    SecondaryAction,
    SelectField,
    StatusBadge,
} from './Partials/DeanShared';

export default function Submissions({ submissions, departments, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [department, setDepartment] = useState(filters.department || '');

    const applyFilters = (nextSearch = search, nextStatus = status, nextDepartment = department) => {
        router.get(route('dean.submissions.index'), { search: nextSearch, status: nextStatus, department: nextDepartment }, { preserveState: true, replace: true });
    };

    const approve = (submissionId) => {
        router.post(route('submissions.approve', submissionId), {}, { preserveScroll: true });
    };

    const reject = (submissionId) => {
        const feedback = window.prompt('Enter rejection feedback');

        if (!feedback) {
            return;
        }

        router.post(route('submissions.reject', submissionId), { feedback }, { preserveScroll: true });
    };

    const destroySubmission = (submissionId) => {
        if (!window.confirm('Delete this submission?')) {
            return;
        }

        router.delete(route('submissions.destroy', submissionId), { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="All Submissions" />

            <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
                <PageIntro
                    eyebrow="Submissions"
                    title="All Submissions"
                    description="Complete record of intern report submissions inside your assigned departments."
                />

                <Panel title="Submission Registry" description="Review by intern, department, folder, and current status">
                    <div className="mb-5 flex flex-col gap-3 xl:flex-row">
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

                    {submissions.length === 0 ? (
                        <EmptyState title="No submissions found" description="Try another search or wait for new reports." />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
                                        <th className="pb-3 pr-4 font-semibold">Intern</th>
                                        <th className="pb-3 pr-4 font-semibold">Report Title</th>
                                        <th className="pb-3 pr-4 font-semibold">Folder</th>
                                        <th className="pb-3 pr-4 font-semibold">Department</th>
                                        <th className="pb-3 pr-4 font-semibold">Supervisor</th>
                                        <th className="pb-3 pr-4 font-semibold">Date</th>
                                        <th className="pb-3 pr-4 font-semibold">Status</th>
                                        <th className="pb-3 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {submissions.map((submission) => (
                                        <tr key={submission.id}>
                                            <td className="py-4 pr-4 text-sm font-medium text-gray-900">{submission.intern_name}</td>
                                            <td className="py-4 pr-4 text-sm text-gray-600">{submission.report_title}</td>
                                            <td className="py-4 pr-4 text-sm text-gray-600">{submission.folder_name}</td>
                                            <td className="py-4 pr-4 text-sm text-gray-600">{submission.department}</td>
                                            <td className="py-4 pr-4 text-sm text-gray-600">{submission.supervisor_name}</td>
                                            <td className="py-4 pr-4 text-sm text-gray-600">{submission.date}</td>
                                            <td className="py-4 pr-4"><StatusBadge status={submission.status} /></td>
                                            <td className="py-4">
                                                <div className="flex flex-wrap justify-end gap-2">
                                                    <SecondaryAction onClick={() => window.location.assign(route('submissions.download-pdf', submission.id))} className="px-3 py-2">PDF</SecondaryAction>
                                                    <SecondaryAction onClick={() => approve(submission.id)} className="px-3 py-2">Approve</SecondaryAction>
                                                    <button onClick={() => reject(submission.id)} className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-100">Reject</button>
                                                    <button onClick={() => destroySubmission(submission.id)} className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100">Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Panel>
            </div>
        </AuthenticatedLayout>
    );
}
