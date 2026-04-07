import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { ActionLink, PageIntro, Panel, StatCard, StatusBadge } from './Partials/AdminShared';

export default function Dashboard({ stats, recentTasks }) {
    return (
        <AuthenticatedLayout>
            <Head title="Admin Dashboard" />

            <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
                <PageIntro
                    eyebrow="Main Menu"
                    title="Admin Dashboard"
                    description="Monitor interns, tasks, and recent system activity across students, supervisors, and deans."
                />

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <StatCard label="Total Interns" value={stats.total_interns} tone="blue" />
                    <StatCard label="Active Tasks" value={stats.active_tasks} tone="amber" />
                    <StatCard label="Completed" value={stats.completed} tone="green" />
                    <StatCard label="Overdue" value={stats.overdue} tone="red" />
                </div>

                <Panel
                    title="Recent Tasks"
                    description="Latest tracked tasks in the system"
                    action={<ActionLink href={route('admin.tasks.index')}>View all</ActionLink>}
                >
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
                                    <th className="pb-3 pr-4 font-semibold">Task</th>
                                    <th className="pb-3 pr-4 font-semibold">Assigned To</th>
                                    <th className="pb-3 pr-4 font-semibold">Due Date</th>
                                    <th className="pb-3 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentTasks.map((task) => (
                                    <tr key={task.id}>
                                        <td className="py-4 pr-4">
                                            <p className="font-semibold text-gray-900">{task.title}</p>
                                            <p className="text-xs text-gray-500">{task.company}</p>
                                        </td>
                                        <td className="py-4 pr-4 text-sm text-gray-600">{task.assigned_to}</td>
                                        <td className="py-4 pr-4 text-sm text-gray-600">{task.due_date}</td>
                                        <td className="py-4"><StatusBadge status={task.status} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {recentTasks.length === 0 ? <p className="text-sm text-gray-500">No tasks available yet.</p> : null}
                </Panel>
            </div>
        </AuthenticatedLayout>
    );
}
