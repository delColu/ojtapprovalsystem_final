import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    CrudModal,
    EmptyState,
    PageIntro,
    Panel,
    PrimaryAction,
    SecondaryAction,
    StatusBadge,
} from './Partials/DeanShared';

const emptyDepartment = {
    name: '',
    company: '',
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

            <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
                <PageIntro
                    eyebrow="Management"
                    title="Departments"
                    description="Maintain department and company records used by interns and supervisors."
                />

                <Panel title="Department Records" description="Department-level OJT performance">
                    {departments.length === 0 ? (
                        <EmptyState title="No departments found" description="No departments available." />
                    ) : (
                        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                            {departments.map((department) => (
                                <div key={department.id} className="rounded-2xl border border-gray-200 p-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-lg font-semibold text-gray-900">{department.name}</p>
                                            <p className="text-sm text-gray-500">{department.company || 'No company assigned'}</p>
                                            <p className="mt-1 text-xs text-gray-500">{department.supervisor_name}</p>
                                        </div>
                                        <StatusBadge status={department.is_active ? 'Active' : 'Inactive'} />
                                    </div>

                                    <div className="mt-5">
                                        <div className="mb-1 flex items-center justify-between text-sm">
                                            <span className="font-medium text-gray-700">Approval Rate</span>
                                            <span className="font-semibold text-gray-900">{department.approval_rate}%</span>
                                        </div>
                                        <div className="h-2 rounded-full bg-gray-100">
                                            <div className="h-2 rounded-full bg-green-500" style={{ width: `${Math.min(department.approval_rate, 100)}%` }} />
                                        </div>
                                    </div>

                                    <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                                        <div className="rounded-xl bg-blue-50 px-3 py-2">
                                            <p className="text-lg font-semibold text-blue-700">{department.interns_count}</p>
                                            <p className="text-xs text-blue-600">Interns</p>
                                        </div>
                                        <div className="rounded-xl bg-green-50 px-3 py-2">
                                            <p className="text-lg font-semibold text-green-700">{department.approved_count}</p>
                                            <p className="text-xs text-green-600">Approved</p>
                                        </div>
                                        <div className="rounded-xl bg-amber-50 px-3 py-2">
                                            <p className="text-lg font-semibold text-amber-700">{department.pending_count}</p>
                                            <p className="text-xs text-amber-600">Pending</p>
                                        </div>
                                    </div>

                                    <div className="mt-5 flex gap-3">
                                        <SecondaryAction onClick={() => openEdit(department)} className="flex-1">Edit</SecondaryAction>
                                        <button
                                            onClick={() => destroyDepartment(department)}
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

            <CrudModal open={modalOpen} title="Edit Department" onClose={closeModal}>
                <form onSubmit={submit} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="space-y-2 text-sm font-medium text-gray-700">
                            <span>Department Name</span>
                            <input value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100" />
                        </label>
                        <label className="space-y-2 text-sm font-medium text-gray-700">
                            <span>Company</span>
                            <input value={form.data.company} onChange={(event) => form.setData('company', event.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100" />
                        </label>
                    </div>

                    <label className="space-y-2 text-sm font-medium text-gray-700">
                        <span>Description</span>
                        <textarea value={form.data.description} onChange={(event) => form.setData('description', event.target.value)} rows="4" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100" />
                    </label>

                    <label className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700">
                        <input
                            type="checkbox"
                            checked={form.data.is_active}
                            onChange={(event) => form.setData('is_active', event.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
