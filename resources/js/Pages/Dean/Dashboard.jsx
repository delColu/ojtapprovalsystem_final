import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { ActionLink, PageIntro, Panel, PrimaryAction, StatCard, StatusBadge } from './Partials/DeanShared';

function ProgressRow({ label, rate, count, tone }) {
    const toneClass = {
        green: 'bg-green-500',
        amber: 'bg-amber-500',
        red: 'bg-red-500',
    };

    return (
        <div>
            <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">{label}</span>
                <span className="font-semibold text-gray-900">{rate}%</span>
            </div>
            <div className="h-2 rounded-full bg-gray-100">
                <div className={`h-2 rounded-full ${toneClass[tone] || toneClass.green}`} style={{ width: `${Math.min(rate, 100)}%` }} />
            </div>
            <p className="mt-1 text-xs text-gray-500">{count}</p>
        </div>
    );
}

export default function DeanDashboard({ stats, submissionOverview, interns, departmentSummary }) {
    return (
        <AuthenticatedLayout>
            <Head title="Dean Dashboard" />

            <div className="space-y-8 bg-[#0077b6] px-4 py-6 sm:px-6 lg:px-8">
                <PageIntro
                    eyebrow="Overview"
                    title="Dean Dashboard"
                    description="Overview of all OJT activity for your assigned departments."
                />

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <StatCard label="Total Interns" value={stats.total_interns} tone="blue" caption="Across assigned departments" />
                    <StatCard label="Pending Review" value={stats.pending_review} tone="amber" caption="Awaiting supervisor action" />
                    <StatCard label="Approved" value={stats.approved} tone="green" caption="Accepted submissions" />
                    <StatCard label="Rejected" value={stats.rejected} tone="red" caption="Needs revision" />
                </div>

                <div className="grid items-start gap-6 xl:grid-cols-[1.4fr,1fr]">
                    <Panel
                        title="Submission Overview"
                        description="Current semester summary"
                        action={<ActionLink href={route('dean.submissions.index')}>Review all submissions</ActionLink>}
                        className="pb-0"
                    >
                        <div className="space-y-3">
                            <ProgressRow
                                label="Approval Rate"
                                rate={submissionOverview.approval_rate}
                                count={`${submissionOverview.approved} approved submission${submissionOverview.approved === 1 ? '' : 's'}`}
                                tone="green"
                            />
                            <ProgressRow
                                label="Pending Rate"
                                rate={submissionOverview.pending_rate}
                                count={`${submissionOverview.pending} report${submissionOverview.pending === 1 ? '' : 's'} awaiting review`}
                                tone="amber"
                            />
                            <ProgressRow
                                label="Rejection Rate"
                                rate={submissionOverview.rejection_rate}
                                count={`${submissionOverview.rejected} report${submissionOverview.rejected === 1 ? '' : 's'} returned for revision`}
                                tone="red"
                            />
                            <Link
                                href={route('dean.submissions.index')}
                                className="inline-flex w-full items-center justify-center rounded-2xl bg-[#0077b6] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#005f8c]"
                            >
                                Review All Submissions
                            </Link>
                        </div>
                    </Panel>

                    <Panel
                        title="Interns"
                        description="Active this semester"
                        action={<ActionLink href={route('dean.interns.index')}>View all</ActionLink>}
                        className="pb-0"
                    >
                        <div className="space-y-3">
                            {interns.length === 0 ? (
                                <p className="text-sm text-gray-500">No interns assigned yet.</p>
                            ) : (
                                interns.map((intern) => (
                                    <div
                                        key={intern.id}
                                        className="flex items-center justify-between rounded-2xl border border-blue-200/70 bg-gradient-to-r from-blue-50 via-white to-sky-50 px-4 py-2.5 shadow-sm ring-1 ring-blue-100/70 transition duration-300 hover:border-blue-300 hover:shadow-[0_14px_30px_-22px_rgba(0,119,182,0.45)]"
                                    >
                                        <div>
                                            <p className="font-semibold text-gray-900">{intern.name}</p>
                                            <p className="text-sm text-gray-600">{intern.department || 'Unassigned department'}</p>
                                        </div>
                                        <StatusBadge status={intern.status} />
                                    </div>
                                ))
                            )}
                        </div>
                    </Panel>
                </div>

                <Panel
                    title="Department Summary"
                    description="Submission status by department this semester"
                    action={<ActionLink href={route('dean.departments.index')}>View all</ActionLink>}
                >
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
                                    <th className="pb-3 pr-4 font-semibold">Department</th>
                                    <th className="pb-3 pr-4 font-semibold">Supervisor</th>
                                    <th className="pb-3 pr-4 font-semibold">Interns</th>
                                    <th className="pb-3 pr-4 font-semibold">Submitted</th>
                                    <th className="pb-3 pr-4 font-semibold">Approved</th>
                                    <th className="pb-3 pr-4 font-semibold">Pending</th>
                                    <th className="pb-3 font-semibold">Approval Rate</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {departmentSummary.map((department) => (
                                    <tr key={department.id}>
                                        <td className="py-4 pr-4">
                                            <p className="font-semibold text-gray-900">{department.name}</p>
                                            <p className="text-xs text-gray-500">{department.company || 'No company'}</p>
                                        </td>
                                        <td className="py-4 pr-4 text-sm text-gray-600">{department.supervisor_name}</td>
                                        <td className="py-4 pr-4 text-sm text-gray-600">{department.interns_count}</td>
                                        <td className="py-4 pr-4 text-sm text-gray-600">{department.submitted}</td>
                                        <td className="py-4 pr-4 text-sm text-gray-600">{department.approved}</td>
                                        <td className="py-4 pr-4 text-sm text-gray-600">{department.pending}</td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-2 w-24 rounded-full bg-gray-100">
                                                    <div className="h-2 rounded-full bg-[#0077b6]" style={{ width: `${Math.min(department.approval_rate, 100)}%` }} />
                                                </div>
                                                <span className="text-sm font-semibold text-gray-700">{department.approval_rate}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Panel>
            </div>
        </AuthenticatedLayout>
    );
}
