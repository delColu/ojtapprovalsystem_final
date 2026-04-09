import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { EmptyState, PageIntro, Panel, SearchField, SecondaryAction, SelectField, StatusBadge } from './Partials/AdminShared';

export default function ActivityLogs({ logs, users, filters }) {
    const [action, setAction] = useState(filters.action || '');
    const [userId, setUserId] = useState(filters.user_id || '');
    const [status, setStatus] = useState(filters.status || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const applyFilters = (next = {}) => {
        router.get(route('admin.activity-logs.index'), {
            action: next.action ?? action,
            user_id: next.userId ?? userId,
            status: next.status ?? status,
            date_from: next.dateFrom ?? dateFrom,
            date_to: next.dateTo ?? dateTo,
        }, { preserveState: true, replace: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Activity Logs" />

            <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
                <PageIntro eyebrow="Audit" title="Activity Logs" description="Track important actions across students, supervisors, deans, and admins." />

                <Panel title="System Logs" description={`${logs.length} log entr${logs.length === 1 ? 'y' : 'ies'}`}>
                    <div className="mb-5 flex flex-col gap-3 xl:flex-row">
                        <SearchField value={action} onChange={(value) => { setAction(value); applyFilters({ action: value }); }} placeholder="All actions" />
                        <SelectField value={userId} onChange={(value) => { setUserId(value); applyFilters({ userId: value }); }} options={users} placeholder="All users" />
                        <SelectField value={status} onChange={(value) => { setStatus(value); applyFilters({ status: value }); }} options={[{ value: 'success', label: 'Success' }, { value: 'failed', label: 'Failed' }]} placeholder="All status" />
                        <input type="date" value={dateFrom} onChange={(event) => { setDateFrom(event.target.value); applyFilters({ dateFrom: event.target.value }); }} className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100" />
                        <input type="date" value={dateTo} onChange={(event) => { setDateTo(event.target.value); applyFilters({ dateTo: event.target.value }); }} className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100" />
                    </div>

                    {logs.length === 0 ? (
                        <EmptyState title="No activity logs found" description="Try another filter combination." />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
                                        <th className="pb-3 pr-4 font-semibold">Timestamp</th>
                                        <th className="pb-3 pr-4 font-semibold">User</th>
                                        <th className="pb-3 pr-4 font-semibold">Action</th>
                                        <th className="pb-3 pr-4 font-semibold">Status</th>
                                        <th className="pb-3 pr-4 font-semibold">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {logs.map((log) => (
                                        <tr key={log.id}>
                                            <td className="py-4 pr-4 text-sm text-gray-600">{log.timestamp}</td>
                                            <td className="py-4 pr-4 text-sm text-gray-600">{log.user}</td>
                                            <td className="py-4 pr-4 text-sm text-gray-600">{log.action}</td>
                                            <td className="py-4 pr-4"><StatusBadge status={log.status} /></td>
                                            <td className="py-4 pr-4 text-sm text-gray-600">{log.details}</td>
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
