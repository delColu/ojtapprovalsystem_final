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

const emptyIntern = {
    name: '',
    email: '',
    student_id: '',
    department_id: '',
    supervisor_id: '',
    company: '',
    is_active: true,
};

export default function Interns({ interns, departments, supervisors, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [department, setDepartment] = useState(filters.department || '');
    const [status, setStatus] = useState(filters.status || '');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingIntern, setEditingIntern] = useState(null);

    const form = useForm(emptyIntern);

    const applyFilters = (nextSearch = search, nextDepartment = department, nextStatus = status) => {
        router.get(route('dean.interns.index'), { search: nextSearch, department: nextDepartment, status: nextStatus }, { preserveState: true, replace: true });
    };

    const openEdit = (intern) => {
        setEditingIntern(intern);
        form.setData({
            name: intern.name || '',
            email: intern.email || '',
            student_id: intern.student_id || '',
            department_id: intern.department_id || '',
            supervisor_id: intern.supervisor_id || '',
            company: intern.company || '',
            is_active: Boolean(intern.is_active),
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingIntern(null);
        form.reset();
        form.clearErrors();
    };

    const submit = (event) => {
        event.preventDefault();

        form.put(route('dean.interns.update', editingIntern.id), {
            preserveScroll: true,
            onSuccess: closeModal,
        });
    };

    const destroyIntern = (intern) => {
        if (!window.confirm(`Delete intern ${intern.name}?`)) {
            return;
        }

        router.delete(route('dean.interns.destroy', intern.id), { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Interns" />

            <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
                <PageIntro
                    eyebrow="Management"
                    title="Interns"
                    description="Manage all enrolled OJT students in the dean's departments."
                />

                <Panel title="All Interns" description="Filter by department and active status">
                    <div className="mb-5 flex flex-col gap-3 xl:flex-row">
                        <SearchField
                            value={search}
                            onChange={(value) => {
                                setSearch(value);
                                applyFilters(value, department, status);
                            }}
                            placeholder="Search by name, student ID, or email..."
                        />
                        <SelectField
                            value={department}
                            onChange={(value) => {
                                setDepartment(value);
                                applyFilters(search, value, status);
                            }}
                            options={departments}
                            placeholder="All Departments"
                        />
                        <SelectField
                            value={status}
                            onChange={(value) => {
                                setStatus(value);
                                applyFilters(search, department, value);
                            }}
                            options={[
                                { value: 'active', label: 'Active' },
                                { value: 'inactive', label: 'Inactive' },
                            ]}
                            placeholder="All Statuses"
                        />
                    </div>

                    {interns.length === 0 ? (
                        <EmptyState title="No interns found" description="Widen the filters." />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
                                        <th className="pb-3 pr-4 font-semibold">Intern</th>
                                        <th className="pb-3 pr-4 font-semibold">Department</th>
                                        <th className="pb-3 pr-4 font-semibold">Supervisor</th>
                                        <th className="pb-3 pr-4 font-semibold">Submitted</th>
                                        <th className="pb-3 pr-4 font-semibold">Approved</th>
                                        <th className="pb-3 pr-4 font-semibold">Status</th>
                                        <th className="pb-3 font-semibold text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {interns.map((intern) => (
                                        <tr key={intern.id}>
                                            <td className="py-4 pr-4">
                                                <p className="font-semibold text-gray-900">{intern.name}</p>
                                                <p className="text-xs text-gray-500">{intern.student_id || intern.email}</p>
                                            </td>
                                            <td className="py-4 pr-4 text-sm text-gray-600">{intern.department || 'Unassigned'}</td>
                                            <td className="py-4 pr-4 text-sm text-gray-600">{intern.supervisor_name}</td>
                                            <td className="py-4 pr-4 text-sm text-gray-600">{intern.submitted}</td>
                                            <td className="py-4 pr-4 text-sm text-gray-600">{intern.approved}</td>
                                            <td className="py-4 pr-4">
                                                <StatusBadge status={intern.status} />
                                            </td>
                                            <td className="py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <SecondaryAction onClick={() => openEdit(intern)} className="px-3 py-2">Edit</SecondaryAction>
                                                    <button
                                                        onClick={() => destroyIntern(intern)}
                                                        className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
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
                </Panel>
            </div>

            <CrudModal open={modalOpen} title="Edit Intern" onClose={closeModal}>
                <form onSubmit={submit} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="space-y-2 text-sm font-medium text-gray-700">
                            <span>Name</span>
                            <input value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100" />
                        </label>
                        <label className="space-y-2 text-sm font-medium text-gray-700">
                            <span>Email</span>
                            <input value={form.data.email} onChange={(event) => form.setData('email', event.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100" />
                        </label>
                        <label className="space-y-2 text-sm font-medium text-gray-700">
                            <span>Student ID</span>
                            <input value={form.data.student_id} onChange={(event) => form.setData('student_id', event.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100" />
                        </label>
                        <label className="space-y-2 text-sm font-medium text-gray-700">
                            <span>Company</span>
                            <input value={form.data.company} onChange={(event) => form.setData('company', event.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100" />
                        </label>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="space-y-2 text-sm font-medium text-gray-700">
                            <span>Department</span>
                            <select value={form.data.department_id} onChange={(event) => form.setData('department_id', event.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100">
                                <option value="">Select department</option>
                                {departments.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
                            </select>
                        </label>
                        <label className="space-y-2 text-sm font-medium text-gray-700">
                            <span>Supervisor</span>
                            <select value={form.data.supervisor_id} onChange={(event) => form.setData('supervisor_id', event.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100">
                                <option value="">Unassigned</option>
                                {supervisors.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
                            </select>
                        </label>
                    </div>

                    <label className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700">
                        <input
                            type="checkbox"
                            checked={form.data.is_active}
                            onChange={(event) => form.setData('is_active', event.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        Mark this intern as active
                    </label>

                    <div className="flex justify-end gap-3 pt-2">
                        <SecondaryAction onClick={closeModal}>Cancel</SecondaryAction>
                        <PrimaryAction type="submit" disabled={form.processing}>
                            {form.processing ? 'Saving...' : 'Update Intern'}
                        </PrimaryAction>
                    </div>
                </form>
            </CrudModal>
        </AuthenticatedLayout>
    );
}
