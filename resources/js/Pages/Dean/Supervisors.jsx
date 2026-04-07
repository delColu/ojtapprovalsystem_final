import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    CrudModal,
    EmptyState,
    PageIntro,
    Panel,
    PrimaryAction,
    SearchField,
    SecondaryAction,
    SelectField,
    StatusBadge,
} from './Partials/DeanShared';

const emptySupervisor = {
    name: '',
    email: '',
    department_id: '',
    is_active: true,
};

export default function Supervisors({ supervisors, departments, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [department, setDepartment] = useState(filters.department || '');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingSupervisor, setEditingSupervisor] = useState(null);

    const form = useForm(emptySupervisor);

    const applyFilters = (nextSearch = search, nextDepartment = department) => {
        router.get(route('dean.supervisors.index'), { search: nextSearch, department: nextDepartment }, { preserveState: true, replace: true });
    };

    const openEdit = (supervisor) => {
        setEditingSupervisor(supervisor);
        form.setData({
            name: supervisor.name || '',
            email: supervisor.email || '',
            department_id: supervisor.department_id || '',
            is_active: Boolean(supervisor.is_active),
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingSupervisor(null);
        form.reset();
        form.clearErrors();
    };

    const submit = (event) => {
        event.preventDefault();

        form.put(route('dean.supervisors.update', editingSupervisor.id), {
            preserveScroll: true,
            onSuccess: closeModal,
        });
    };

    const destroySupervisor = (supervisor) => {
        if (!window.confirm(`Delete supervisor ${supervisor.name}?`)) {
            return;
        }

        router.delete(route('dean.supervisors.destroy', supervisor.id), { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Supervisors" />

            <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
                <PageIntro
                    eyebrow="Management"
                    title="Supervisors"
                    description="Monitor assigned supervisors and manage their department assignments."
                />

                <Panel title="Supervisor Directory" description="Search, filter, and maintain supervisor records">
                    <div className="mb-5 flex flex-col gap-3 md:flex-row">
                        <SearchField
                            value={search}
                            onChange={(value) => {
                                setSearch(value);
                                applyFilters(value, department);
                            }}
                            placeholder="Search supervisors..."
                        />
                        <SelectField
                            value={department}
                            onChange={(value) => {
                                setDepartment(value);
                                applyFilters(search, value);
                            }}
                            options={departments}
                            placeholder="All Departments"
                        />
                    </div>

                    {supervisors.length === 0 ? (
                        <EmptyState title="No supervisors found" description="Adjust the current filters." />
                    ) : (
                        <div className="grid gap-4 lg:grid-cols-2">
                            {supervisors.map((supervisor) => (
                                <div key={supervisor.id} className="rounded-2xl border border-gray-200 p-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-lg font-semibold text-gray-900">{supervisor.name}</p>
                                            <p className="text-sm text-gray-500">{supervisor.email}</p>
                                            <p className="mt-1 text-sm text-gray-500">{supervisor.department || 'No department'}</p>
                                        </div>
                                        <StatusBadge status={supervisor.is_active ? 'Active' : 'Inactive'} />
                                    </div>

                                    <div className="mt-5 grid grid-cols-4 gap-3 text-center">
                                        <div className="rounded-xl bg-blue-50 px-3 py-2">
                                            <p className="text-lg font-semibold text-blue-700">{supervisor.interns_count}</p>
                                            <p className="text-xs text-blue-600">Interns</p>
                                        </div>
                                        <div className="rounded-xl bg-green-50 px-3 py-2">
                                            <p className="text-lg font-semibold text-green-700">{supervisor.approved_count}</p>
                                            <p className="text-xs text-green-600">Approved</p>
                                        </div>
                                        <div className="rounded-xl bg-amber-50 px-3 py-2">
                                            <p className="text-lg font-semibold text-amber-700">{supervisor.pending_count}</p>
                                            <p className="text-xs text-amber-600">Pending</p>
                                        </div>
                                        <div className="rounded-xl bg-red-50 px-3 py-2">
                                            <p className="text-lg font-semibold text-red-700">{supervisor.rejected_count}</p>
                                            <p className="text-xs text-red-600">Rejected</p>
                                        </div>
                                    </div>

                                    <div className="mt-5">
                                        <div className="mb-1 flex items-center justify-between text-sm">
                                            <span className="font-medium text-gray-700">Approval Rate</span>
                                            <span className="font-semibold text-gray-900">{supervisor.approval_rate}%</span>
                                        </div>
                                        <div className="h-2 rounded-full bg-gray-100">
                                            <div className="h-2 rounded-full bg-green-500" style={{ width: `${Math.min(supervisor.approval_rate, 100)}%` }} />
                                        </div>
                                    </div>

                                    <div className="mt-5 flex gap-3">
                                        <SecondaryAction onClick={() => openEdit(supervisor)} className="flex-1">Edit</SecondaryAction>
                                        <button
                                            onClick={() => destroySupervisor(supervisor)}
                                            className="flex-1 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-100"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Panel>
            </div>

            <CrudModal open={modalOpen} title="Edit Supervisor" onClose={closeModal}>
                <form onSubmit={submit} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="space-y-2 text-sm font-medium text-gray-700">
                            <span>Name</span>
                            <input
                                value={form.data.name}
                                onChange={(event) => form.setData('name', event.target.value)}
                                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                            />
                        </label>
                        <label className="space-y-2 text-sm font-medium text-gray-700">
                            <span>Email</span>
                            <input
                                value={form.data.email}
                                onChange={(event) => form.setData('email', event.target.value)}
                                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                            />
                        </label>
                    </div>

                    <label className="space-y-2 text-sm font-medium text-gray-700">
                        <span>Department</span>
                        <select
                            value={form.data.department_id}
                            onChange={(event) => form.setData('department_id', event.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="">Select department</option>
                            {departments.map((option) => (
                                <option key={option.id} value={option.id}>{option.name}</option>
                            ))}
                        </select>
                    </label>

                    <label className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700">
                        <input
                            type="checkbox"
                            checked={form.data.is_active}
                            onChange={(event) => form.setData('is_active', event.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        Mark this supervisor as active
                    </label>

                    <div className="flex justify-end gap-3 pt-2">
                        <SecondaryAction onClick={closeModal}>Cancel</SecondaryAction>
                        <PrimaryAction type="submit" disabled={form.processing}>
                            {form.processing ? 'Saving...' : 'Update Supervisor'}
                        </PrimaryAction>
                    </div>
                </form>
            </CrudModal>
        </AuthenticatedLayout>
    );
}
