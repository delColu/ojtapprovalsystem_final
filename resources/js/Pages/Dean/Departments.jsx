import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    CrudModal,
    EmptyState,
    PageIntro,
    PrimaryAction,
    SecondaryAction,
    StatusBadge,
} from './Partials/DeanShared';

const emptyDepartment = {
    name: '',
    company: '',
    address: '',
    description: '',
    is_active: true,
};

export default function Departments({ departments }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState(null);
    const form = useForm(emptyDepartment);

    const openEdit = (department) => {
        setEditingDepartment(department);
        form.setData({
            name: department.name || '',
            company: department.company || '',
            address: department.address || '',
            description: department.description || '',
            is_active: Boolean(department.is_active),
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingDepartment(null);
        form.reset();
        form.clearErrors();
    };

    const submit = (event) => {
        event.preventDefault();

        form.put(route('dean.departments.update', editingDepartment.id), {
            preserveScroll: true,
            onSuccess: closeModal,
        });
    };

    const destroyDepartment = (department) => {
        if (!window.confirm(`Delete department ${department.name}?`)) {
            return;
        }

        router.delete(route('dean.departments.destroy', department.id), { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Departments" />

            <div className="space-y-8 bg-[#0077b6] px-4 py-6 sm:px-6 lg:px-8">
                <PageIntro
                    eyebrow="Management"
                    title="Departments"
                    description="Maintain department and company records used by interns and supervisors."
                />

                {/* Department Cards */}
                {departments.length === 0 ? (
                    <EmptyState title="No departments found" description="No departments available." />
                ) : (
                    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                        {departments.map((department, index) => (
                            <div
                                key={department.id}
                                className="rounded-2xl border border-sky-200/70 bg-gradient-to-br from-white via-sky-50/80 to-cyan-50/80 p-5 shadow-sm ring-1 ring-sky-100/80 transition-all duration-300 hover:border-sky-300 hover:shadow-[0_18px_40px_-28px_rgba(2,132,199,0.35)]"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-sky-200 bg-gradient-to-br from-sky-100 to-cyan-100 text-sm font-semibold text-sky-700 shadow-inner">
                                            {department.name?.charAt(0).toUpperCase() || 'D'}
                                        </div>
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="text-base font-semibold tracking-tight text-slate-900">{department.name}</p>
                                                <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-700">
                                                    #{String(index + 1).padStart(2, '0')}
                                                </span>
                                            </div>
                                            <p className="mt-1 text-xs text-slate-500">{department.company || 'No company assigned'}</p>
                                            <p className="mt-2 text-sm text-slate-600">{department.address || 'No company address set'}</p>
                                            <p className="mt-1 text-sm text-slate-600">{department.supervisor_name || 'No supervisor assigned'}</p>
                                        </div>
                                    </div>
                                    <StatusBadge status={department.is_active ? 'Active' : 'Inactive'} />
                                </div>

                                <div className="mt-5">
                                    <div className="mb-1 flex items-center justify-between text-sm">
                                        <span className="font-medium text-gray-700">Approval Rate</span>
                                        <span className="font-semibold text-gray-900">{department.approval_rate}%</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-gray-100">
                                        <div
                                            className="h-2 rounded-full bg-[#0077b6]"
                                            style={{ width: `${Math.min(department.approval_rate, 100)}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                                    <div className="rounded-xl border border-slate-200 bg-white/80 p-3">
                                        <p className="text-lg font-semibold text-slate-900">{department.interns_count}</p>
                                        <p className="text-xs text-slate-500">Interns</p>
                                    </div>
                                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-3">
                                        <p className="text-lg font-semibold text-emerald-700">{department.approved_count}</p>
                                        <p className="text-xs text-emerald-600">Approved</p>
                                    </div>
                                    <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3">
                                        <p className="text-lg font-semibold text-amber-700">{department.pending_count}</p>
                                        <p className="text-xs text-amber-600">Pending</p>
                                    </div>
                                </div>

                                <div className="mt-5 flex gap-3">
                                    <button
                                        onClick={() => openEdit(department)}
                                        className="flex-1 rounded-xl bg-[#0077b6] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#005f8c]"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => destroyDepartment(department)}
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

            <CrudModal open={modalOpen} title="Edit Department" onClose={closeModal}>
                <form onSubmit={submit} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="space-y-2 text-sm font-medium text-gray-700">
                            <span>Department Name</span>
                            <input value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-[#0077b6] focus:ring-2 focus:ring-[#0077b6]/20" />
                        </label>
                        <label className="space-y-2 text-sm font-medium text-gray-700">
                            <span>Company</span>
                            <input value={form.data.company} onChange={(event) => form.setData('company', event.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-[#0077b6] focus:ring-2 focus:ring-[#0077b6]/20" />
                        </label>
                    </div>

                    <label className="space-y-2 text-sm font-medium text-gray-700">
                        <span>Company Address</span>
                        <input value={form.data.address} onChange={(event) => form.setData('address', event.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-[#0077b6] focus:ring-2 focus:ring-[#0077b6]/20" />
                    </label>

                    <label className="space-y-2 text-sm font-medium text-gray-700">
                        <span>Description</span>
                        <textarea value={form.data.description} onChange={(event) => form.setData('description', event.target.value)} rows="4" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-[#0077b6] focus:ring-2 focus:ring-[#0077b6]/20" />
                    </label>

                    <label className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700">
                        <input
                            type="checkbox"
                            checked={form.data.is_active}
                            onChange={(event) => form.setData('is_active', event.target.checked)}
                            className="rounded border-gray-300 text-[#0077b6] focus:ring-[#0077b6]"
                        />
                        Mark this department as active
                    </label>

                    <div className="flex justify-end gap-3 pt-2">
                        <SecondaryAction onClick={closeModal}>Cancel</SecondaryAction>
                        <PrimaryAction type="submit" disabled={form.processing}>
                            {form.processing ? 'Saving...' : 'Update Department'}
                        </PrimaryAction>
                    </div>
                </form>
            </CrudModal>
        </AuthenticatedLayout>
    );
}
