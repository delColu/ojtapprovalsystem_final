import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    CrudModal,
    EmptyState,
    PageIntro,
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

            <div className="space-y-8 bg-[#0077b6] px-4 pt-6 pb-0 sm:px-6 lg:px-8">
                <PageIntro
                    eyebrow="Management"
                    title="Supervisors"
                    description="Monitor assigned supervisors and manage their department assignments."
                />

                {/* Filter Section - No Card */}
                <div className="flex flex-col gap-3 md:flex-row">
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

                {/* Supervisors Cards */}
                {supervisors.length === 0 ? (
                    <div className="rounded-2xl bg-white/95 p-12 text-center backdrop-blur-sm">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                            <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="mt-4 text-lg font-semibold text-gray-900">No supervisors found</h3>
                        <p className="mt-1 text-gray-600">Adjust the current filters to see more results.</p>
                    </div>
                ) : (
                    <div className="grid gap-4 lg:grid-cols-2">
                        {supervisors.map((supervisor, index) => (
                            <div
                                key={supervisor.id}
                                className="rounded-2xl border border-sky-200/70 bg-gradient-to-br from-white via-sky-50/80 to-cyan-50/80 p-5 shadow-sm ring-1 ring-sky-100/80 transition-all duration-300 hover:border-sky-300 hover:shadow-[0_18px_40px_-28px_rgba(2,132,199,0.35)]"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-sky-200 bg-gradient-to-br from-sky-100 to-cyan-100 text-sm font-semibold text-sky-700 shadow-inner">
                                            {supervisor.name?.charAt(0).toUpperCase() || 'S'}
                                        </div>
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="text-base font-semibold tracking-tight text-slate-900">{supervisor.name}</p>
                                                <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-700">
                                                    #{String(index + 1).padStart(2, '0')}
                                                </span>
                                            </div>
                                            <p className="mt-1 text-xs text-slate-500">{supervisor.email}</p>
                                            <p className="mt-2 text-sm text-slate-600">Department: {supervisor.department || 'Unassigned'}</p>
                                            <p className="mt-1 text-sm text-slate-600">Company: {supervisor.company || 'No company assigned'}</p>
                                        </div>
                                    </div>
                                    <StatusBadge status={supervisor.is_active ? 'Active' : 'Inactive'} />
                                </div>

                                <div className="mt-5 grid grid-cols-4 gap-3 text-center">
                                    <div className="rounded-xl border border-slate-200 bg-white/80 p-3">
                                        <p className="text-xl font-semibold text-slate-900">{supervisor.interns_count}</p>
                                        <p className="text-xs text-slate-500">Interns</p>
                                    </div>
                                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-3">
                                        <p className="text-xl font-semibold text-emerald-700">{supervisor.approved_count}</p>
                                        <p className="text-xs text-emerald-600">Approved</p>
                                    </div>
                                    <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3">
                                        <p className="text-xl font-semibold text-amber-700">{supervisor.pending_count}</p>
                                        <p className="text-xs text-amber-600">Pending</p>
                                    </div>
                                    <div className="rounded-xl border border-red-200 bg-red-50/80 p-3">
                                        <p className="text-xl font-semibold text-red-700">{supervisor.rejected_count}</p>
                                        <p className="text-xs text-red-600">Rejected</p>
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <div className="mb-1 flex items-center justify-between text-sm">
                                        <span className="font-medium text-gray-700">Approval Rate</span>
                                        <span className="font-semibold text-gray-900">{supervisor.approval_rate}%</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-gray-100">
                                        <div
                                            className="h-2 rounded-full bg-[#0077b6]"
                                            style={{ width: `${Math.min(supervisor.approval_rate, 100)}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="mt-5 flex gap-3">
                                    <button
                                        onClick={() => openEdit(supervisor)}
                                        className="flex-1 rounded-xl bg-[#0077b6] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#005f8c]"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => destroySupervisor(supervisor)}
                                        className="flex-1 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <CrudModal open={modalOpen} title="Edit Supervisor" onClose={closeModal}>
                <form onSubmit={submit} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="space-y-2 text-sm font-medium text-gray-700">
                            <span>Name</span>
                            <input
                                value={form.data.name}
                                onChange={(event) => form.setData('name', event.target.value)}
                                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-[#0077b6] focus:ring-2 focus:ring-[#0077b6]/20"
                            />
                        </label>
                        <label className="space-y-2 text-sm font-medium text-gray-700">
                            <span>Email</span>
                            <input
                                value={form.data.email}
                                onChange={(event) => form.setData('email', event.target.value)}
                                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-[#0077b6] focus:ring-2 focus:ring-[#0077b6]/20"
                            />
                        </label>
                    </div>

                    <label className="space-y-2 text-sm font-medium text-gray-700">
                        <span>Department</span>
                        <select
                            value={form.data.department_id}
                            onChange={(event) => form.setData('department_id', event.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-[#0077b6] focus:ring-2 focus:ring-[#0077b6]/20"
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
                            className="rounded border-gray-300 text-[#0077b6] focus:ring-[#0077b6]"
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
