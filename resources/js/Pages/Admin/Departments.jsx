import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { CrudModal, EmptyState, PageIntro, Panel, PrimaryAction, SecondaryAction, SearchField, SelectField, StatusBadge } from './Partials/AdminShared';

const emptyDepartment = {
    name: '',
    address: '',
    is_active: true,
};

export default function Departments({ departments: initialDepartments }) {
    const [statusFilter, setStatusFilter] = useState('');
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState(null);
    const form = useForm(emptyDepartment);

    const filteredDepartments = useMemo(() => {
        return initialDepartments.filter((department) => {
            const matchesSearch = !search || [department.name, department.address].some((value) => String(value || '').toLowerCase().includes(search.toLowerCase()));
            const matchesStatus = !statusFilter || department.status.toLowerCase() === statusFilter.toLowerCase();

            return matchesSearch && matchesStatus;
        });
    }, [initialDepartments, search, statusFilter]);

    const openCreate = () => {
        setEditingDepartment(null);
        form.reset();
        form.setData({ ...emptyDepartment });
        setModalOpen(true);
    };

    const openEdit = (department) => {
        setEditingDepartment(department);
        form.setData({
            name: department.name || '',
            address: department.address || '',
            is_active: department.status === 'Active',
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
        const options = { preserveScroll: true, onSuccess: closeModal };

        if (editingDepartment) {
            form.put(`/admin/departments/${editingDepartment.id}`, options);
            return;
        }

        form.post('/admin/departments', options);
    };

    const destroyDepartment = (department) => {
        if (!window.confirm(`Delete department "${department.name}"? This may affect user assignments.`)) {
            return;
        }

        router.delete(`/admin/departments/${department.id}`, { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Departments" />

            <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
                <PageIntro
                    eyebrow="Management"
                    title="Department Management"
                    description="Manage department records used for user assignments and organization."
                    action={<PrimaryAction onClick={openCreate}>Add Department</PrimaryAction>}
                />

                <Panel title="All Departments" description={`${filteredDepartments.length} departments found`}>
                    <div className="mb-5 flex flex-col gap-3 xl:flex-row">
                        <SearchField value={search} onChange={setSearch} placeholder="Search departments by name or address..." />
                        <SelectField
                            value={statusFilter}
                            onChange={setStatusFilter}
                            options={[
                                { value: 'active', label: 'Active' },
                                { value: 'inactive', label: 'Inactive' },
                            ]}
                            placeholder="All Status"
                        />
                    </div>

                    {filteredDepartments.length === 0 ? (
                        <EmptyState title="No departments found" description="Try different filters or add a new department." action={<PrimaryAction onClick={openCreate}>Add Department</PrimaryAction>} />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
                                        <th className="px-3 pb-3 font-semibold">Department Name</th>
                                        <th className="px-3 pb-3 font-semibold">Address</th>
                                        <th className="px-3 pb-3 font-semibold">Status</th>
                                        <th className="px-3 pb-3 font-semibold">Created</th>
                                        <th className="px-3 pb-3 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredDepartments.map((department) => (
                                        <tr key={department.id}>
                                            <td className="px-3 py-4">
                                                <p className="font-semibold text-gray-900">{department.name}</p>
                                            </td>
                                            <td className="px-3 py-4 text-sm text-gray-600 max-w-xs truncate" title={department.address}>{department.address || 'No address'}</td>
                                            <td className="px-3 py-4 whitespace-nowrap">
                                                <StatusBadge status={department.status} />
                                            </td>
                                            <td className="px-3 py-4 text-sm text-gray-600 whitespace-nowrap">{department.created_at}</td>
                                            <td className="px-3 py-4 whitespace-nowrap">
                                                <div className="flex justify-end gap-2">
                                                    <SecondaryAction onClick={() => openEdit(department)} className="px-3 py-2">Edit</SecondaryAction>
                                                    <button
                                                        onClick={() => destroyDepartment(department)}
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

            <CrudModal open={modalOpen} title={editingDepartment ? 'Edit Department' : 'Add Department'} onClose={closeModal}>
                <form onSubmit={submit} className="space-y-4">
                    <label className="space-y-2 text-sm font-medium text-gray-700">
                        <span>Name *</span>
                        <input
                            value={form.data.name}
                            onChange={(e) => form.setData('name', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                            required
                        />
                    </label>
                    <label className="space-y-2 text-sm font-medium text-gray-700">
                        <span>Address</span>
                        <input
                            value={form.data.address}
                            onChange={(e) => form.setData('address', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                        />
                    </label>
                    <label className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700">
                        <input
                            type="checkbox"
                            checked={form.data.is_active}
                            onChange={(e) => form.setData('is_active', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        Mark this department as active (visible in assignments)
                    </label>
                    <div className="flex justify-end gap-3">
                        <SecondaryAction onClick={closeModal}>Cancel</SecondaryAction>
                        <PrimaryAction type="submit" disabled={form.processing}>
                            {form.processing ? 'Saving...' : editingDepartment ? 'Update Department' : 'Create Department'}
                        </PrimaryAction>
                    </div>
                </form>
            </CrudModal>
        </AuthenticatedLayout>
    );
}
