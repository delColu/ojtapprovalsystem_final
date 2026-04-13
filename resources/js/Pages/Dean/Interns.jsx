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

const emptyIntern = {
    name: '',
    email: '',
    student_id: '',
    department_id: '',
    company_id: '',
    is_active: true,
};

export default function Interns({ interns, departments, companies, filters }) {
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
            company_id: intern.company_id || '',
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

            <div className="space-y-8 bg-[#0077b6] px-4 py-6 sm:px-6 lg:px-8">
                <PageIntro
                    eyebrow="Management"
                    title="Interns"
                    description="Manage all enrolled OJT students in the dean's departments."
                />

                {/* Filter Section - No Card */}
                <div className="flex flex-col gap-3 xl:flex-row">
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
                        placeholder="All Status"
                    />
                </div>

                {/* Interns Table */}
                {interns.length === 0 ? (
                    <div className="rounded-2xl bg-white/95 p-12 text-center backdrop-blur-sm">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                            <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="mt-4 text-lg font-semibold text-gray-900">No interns found</h3>
                        <p className="mt-1 text-gray-600">Widen the filters to see more results.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-2xl bg-white/95 shadow-sm backdrop-blur-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-[#0077b6]/10">
                                <tr className="text-left text-xs uppercase tracking-wide text-gray-600">
                                    <th className="px-4 py-3 font-semibold">#</th>
                                    <th className="px-4 py-3 font-semibold">Name</th>
                                    <th className="px-4 py-3 font-semibold">Student ID</th>
                                    <th className="px-4 py-3 font-semibold">Department</th>
                                    <th className="px-4 py-3 font-semibold">Company</th>
                                    <th className="px-4 py-3 font-semibold text-center">Submissions</th>
                                    <th className="px-4 py-3 font-semibold text-center">Approved</th>
                                    <th className="px-4 py-3 font-semibold text-center">Status</th>
                                    <th className="px-4 py-3 font-semibold text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {interns.map((intern, index) => (
                                    <tr key={intern.id} className="transition hover:bg-[#0077b6]/5">
                                        <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                                        <td className="px-4 py-3">
                                            <p className="font-semibold text-gray-900">{intern.name}</p>
                                            <p className="text-xs text-gray-500">{intern.email}</p>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{intern.student_id || '—'}</td>
                                            <td className="px-4 py-3">
                                                <p className="text-sm text-gray-800">{intern.department || 'Unassigned'}</p>
                                            </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{intern.company || '—'}</td>
                                        <td className="px-4 py-3 text-center text-sm font-semibold text-gray-700">{intern.submitted || 0}</td>
                                        <td className="px-4 py-3 text-center text-sm font-semibold text-emerald-600">{intern.approved || 0}</td>
                                        <td className="px-4 py-3 text-center">
                                            <StatusBadge status={intern.status} />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => openEdit(intern)}
                                                    className="rounded-lg bg-[#0077b6] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#005f8c]"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => destroyIntern(intern)}
                                                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100"
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
            </div>

            <CrudModal open={modalOpen} title="Edit Intern" onClose={closeModal}>
                <form onSubmit={submit} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="space-y-2 text-sm font-medium text-gray-700">
                            <span>Name</span>
                            <input value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-[#0077b6] focus:ring-2 focus:ring-[#0077b6]/20" />
                        </label>
                        <label className="space-y-2 text-sm font-medium text-gray-700">
                            <span>Email</span>
                            <input value={form.data.email} onChange={(event) => form.setData('email', event.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-[#0077b6] focus:ring-2 focus:ring-[#0077b6]/20" />
                        </label>
                        <label className="space-y-2 text-sm font-medium text-gray-700">
                            <span>Student ID</span>
                            <input value={form.data.student_id} onChange={(event) => form.setData('student_id', event.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-[#0077b6] focus:ring-2 focus:ring-[#0077b6]/20" />
                        </label>
                        <label className="space-y-2 text-sm font-medium text-gray-700">
                            <span>Company</span>
                            <select
                                value={form.data.company_id}
                                onChange={(event) => form.setData('company_id', event.target.value)}
                                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-[#0077b6] focus:ring-2 focus:ring-[#0077b6]/20"
                            >
                                <option value="">Select company</option>
                                {companies.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 block">Department</label>
                            <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 bg-gray-50">
                                <p className="text-sm font-medium text-gray-900">
                                    {editingIntern?.department || 'Unassigned'}
                                </p>
                                <input
                                    type="hidden"
                                    value={form.data.department_id || ''}
                                />
                            </div>
                        </div>
                    </div>

                    <label className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700">
                        <input
                            type="checkbox"
                            checked={form.data.is_active}
                            onChange={(event) => form.setData('is_active', event.target.checked)}
                            className="rounded border-gray-300 text-[#0077b6] focus:ring-[#0077b6]"
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
