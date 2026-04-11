import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { CrudModal, EmptyState, PageIntro, Panel, PrimaryAction, SecondaryAction, SearchField, SelectField, StatusBadge } from './Partials/AdminShared';

const emptyCompany = {
    name: '',
    address: '',
    is_active: true,
};

export default function Company({ companies: initialCompanies }) {
    const [statusFilter, setStatusFilter] = useState('');
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);
    const form = useForm(emptyCompany);

    const filteredCompanies = useMemo(() => {
        return initialCompanies.filter((company) => {
            const matchesSearch = !search || [company.name, company.address].some((value) => String(value || '').toLowerCase().includes(search.toLowerCase()));
            const matchesStatus = !statusFilter || company.status.toLowerCase() === statusFilter.toLowerCase();

            return matchesSearch && matchesStatus;
        });
    }, [initialCompanies, search, statusFilter]);

    const openCreate = () => {
        setEditingCompany(null);
        form.reset();
        form.setData({ ...emptyCompany });
        setModalOpen(true);
    };

    const openEdit = (company) => {
        setEditingCompany(company);
        form.setData({
            name: company.name || '',
            address: company.address || '',
            is_active: company.status === 'Active',
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingCompany(null);
        form.reset();
        form.clearErrors();
    };

    const submit = (event) => {
        event.preventDefault();
        const options = { preserveScroll: true, onSuccess: closeModal };

        if (editingCompany) {
            form.put(`/admin/companies/${editingCompany.id}`, options);
            return;
        }

        form.post('/admin/companies', options);
    };

    const destroyCompany = (company) => {
        if (!window.confirm(`Delete company "${company.name}"? This may affect user assignments.`)) {
            return;
        }

        router.delete(`/admin/companies/${company.id}`, { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Companies" />

            <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
                <PageIntro
                    eyebrow="Management"
                    title="Company Management"
                    description="Manage company records used for user assignments, registration, and company previews."
                    action={<PrimaryAction onClick={openCreate}>Add Company</PrimaryAction>}
                />

                <Panel title="All Companies" description={`${filteredCompanies.length} companies found`}>
                    <div className="mb-5 flex flex-col gap-3 xl:flex-row">
                        <SearchField value={search} onChange={setSearch} placeholder="Search companies by name or address..." />
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

                    {filteredCompanies.length === 0 ? (
                        <EmptyState title="No companies found" description="Try different filters or add a new company." action={<PrimaryAction onClick={openCreate}>Add Company</PrimaryAction>} />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
                                        <th className="px-3 pb-3 font-semibold">Company Name</th>
                                        <th className="px-3 pb-3 font-semibold">Address</th>
                                        <th className="px-3 pb-3 font-semibold">Status</th>
                                        <th className="px-3 pb-3 font-semibold">Created</th>
                                        <th className="px-3 pb-3 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredCompanies.map((company) => (
                                        <tr key={company.id}>
                                            <td className="px-3 py-4">
                                                <p className="font-semibold text-gray-900">{company.name}</p>
                                            </td>
                                            <td className="px-3 py-4 text-sm text-gray-600 max-w-xs truncate" title={company.address}>{company.address || 'No address'}</td>
                                            <td className="px-3 py-4 whitespace-nowrap">
                                                <StatusBadge status={company.status} />
                                            </td>
                                            <td className="px-3 py-4 text-sm text-gray-600 whitespace-nowrap">{company.created_at}</td>
                                            <td className="px-3 py-4 whitespace-nowrap">
                                                <div className="flex justify-end gap-2">
                                                    <SecondaryAction onClick={() => openEdit(company)} className="px-3 py-2">Edit</SecondaryAction>
                                                    <button
                                                        onClick={() => destroyCompany(company)}
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

            <CrudModal open={modalOpen} title={editingCompany ? 'Edit Company' : 'Add Company'} onClose={closeModal}>
                <form onSubmit={submit} className="space-y-4">
                    <label className="space-y-2 text-sm font-medium text-gray-700">
                        <span>Name *</span>
                        <input
                            value={form.data.name}
                            onChange={(e) => form.setData('name', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-[#0077b6] focus:ring-2 focus:ring-[#0077b6]/20"
                            required
                        />
                    </label>
                    <label className="space-y-2 text-sm font-medium text-gray-700">
                        <span>Address</span>
                        <input
                            value={form.data.address}
                            onChange={(e) => form.setData('address', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-[#0077b6] focus:ring-2 focus:ring-[#0077b6]/20"
                        />
                    </label>
                    <label className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700">
                        <input
                            type="checkbox"
                            checked={form.data.is_active}
                            onChange={(e) => form.setData('is_active', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        Mark this company as active (visible in registration and assignments)
                    </label>
                    <div className="flex justify-end gap-3">
                        <SecondaryAction onClick={closeModal}>Cancel</SecondaryAction>
                        <PrimaryAction type="submit" disabled={form.processing}>
                            {form.processing ? 'Saving...' : editingCompany ? 'Update Company' : 'Create Company'}
                        </PrimaryAction>
                    </div>
                </form>
            </CrudModal>
        </AuthenticatedLayout>
    );
}

