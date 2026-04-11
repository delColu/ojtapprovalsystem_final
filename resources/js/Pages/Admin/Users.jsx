import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { CrudModal, EmptyState, PageIntro, Panel, PrimaryAction, SearchField, SecondaryAction, SelectField, StatusBadge } from './Partials/AdminShared';

const emptyUser = {
    name: '',
    email: '',
    role_id: '',
    department_id: '',
    company_id: '',
    student_id: '',
    is_active: true,
};

export default function Users({ users, roles, departments, companies = [] }) {
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [companyFilter, setCompanyFilter] = useState('');
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const form = useForm(emptyUser);
    const departmentOptions = useMemo(
        () => departments.map((department) => ({ value: department.name, label: department.name })),
        [departments],
    );

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const matchesSearch = !search || [user.name, user.email, user.department, user.company_name || user.company].some((value) => String(value || '').toLowerCase().includes(search.toLowerCase()));
            const matchesRole = !roleFilter || user.role === roleFilter;
            const matchesStatus = !statusFilter || user.status.toLowerCase() === statusFilter;
            const matchesDepartment = !departmentFilter || user.department === departmentFilter;
            const matchesCompany = !companyFilter || (user.company_name || user.company) === companyFilter;

            return matchesSearch && matchesRole && matchesStatus && matchesDepartment && matchesCompany;
        });
    }, [users, search, roleFilter, statusFilter, departmentFilter, companyFilter]);

    const openCreate = () => {
        setEditingUser(null);
        form.setData(emptyUser);
        setModalOpen(true);
    };

    const openEdit = (user) => {
        setEditingUser(user);
        const role = roles.find((item) => item.name === user.role);
        form.setData({
            name: user.name || '',
            email: user.email || '',
            role_id: role?.id || '',
            department_id: user.department_id || '',
            company_id: user.company_id || '',
            student_id: user.student_id || '',
            is_active: user.status === 'Active',
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingUser(null);
        form.reset();
        form.clearErrors();
    };

    const submit = (event) => {
        event.preventDefault();
        const options = { preserveScroll: true, onSuccess: closeModal };

        if (editingUser) {
            form.put(`/admin/users/${editingUser.id}`, options);
            return;
        }

        form.post('/admin/users', options);
    };

    const destroyUser = (user) => {
        if (!window.confirm(`Delete user ${user.name}?`)) {
            return;
        }

        router.delete(`/admin/users/${user.id}`, { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Users" />

            <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
                <PageIntro
                    eyebrow="Management"
                    title="User Management"
                    description="Manage all students, supervisors, deans, and admins in one place."
                    action={
                        <div className="flex gap-3">
                            <SecondaryAction onClick={() => window.location.assign(route('admin.users.export-pdf'))}>Export PDF</SecondaryAction>
                            <PrimaryAction onClick={openCreate}>Add User</PrimaryAction>
                        </div>
                    }
                />

                <Panel title="All Users" description={`${filteredUsers.length} user${filteredUsers.length === 1 ? '' : 's'} found`}>
                    <div className="mb-5 flex flex-col gap-3 xl:flex-row">
                        <SearchField value={search} onChange={setSearch} placeholder="Search users..." />
                        <SelectField value={roleFilter} onChange={setRoleFilter} options={roles.map((role) => ({ value: role.name, label: role.name.charAt(0).toUpperCase() + role.name.slice(1) }))} placeholder="All Roles" />
                        <SelectField value={statusFilter} onChange={setStatusFilter} options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} placeholder="All Status" />
                        <SelectField value={departmentFilter} onChange={setDepartmentFilter} options={departmentOptions} placeholder="Department" />
                <SelectField value={companyFilter} onChange={setCompanyFilter} options={companies.map((company) => ({ value: company.id.toString(), label: company.name }))} placeholder="Company" />
                    </div>

                    {filteredUsers.length === 0 ? (
                        <EmptyState title="No users found" description="Try different filters or add a new user." />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
                                        <th className="px-3 pb-3 font-semibold">User</th>
                                        <th className="px-3 pb-3 font-semibold">Role</th>
                                        <th className="px-3 pb-3 font-semibold">Dept</th>
                                        <th className="px-3 pb-3 font-semibold">Company</th>
                                        <th className="px-3 pb-3 font-semibold">Tasks</th>
                                        <th className="px-3 pb-3 font-semibold">Joined</th>
                                        <th className="px-3 pb-3 font-semibold">Status</th>
                                        <th className="px-3 pb-3 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id}>
                                            <td className="px-3 py-4 whitespace-nowrap">
                                                <p className="font-semibold text-gray-900">{user.name}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </td>
                                            <td className="px-3 py-4 text-sm capitalize text-gray-600 whitespace-nowrap">{user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}</td>
                                            <td className="px-3 py-4 text-sm text-gray-600 whitespace-nowrap">
                                                {user.department || 'N/A'}
                                            </td>
                                            <td className="px-3 py-4 text-sm text-gray-600 whitespace-nowrap">
{user.company_name || user.company || 'N/A'}
                                            </td>
                                            <td className="px-3 py-4 text-sm text-gray-600 whitespace-nowrap text-center">{user.tasks}</td>
                                            <td className="px-3 py-4 text-sm text-gray-600 whitespace-nowrap">{user.joined}</td>
                                            <td className="px-3 py-4 whitespace-nowrap"><StatusBadge status={user.status} /></td>
                                            <td className="px-3 py-4 whitespace-nowrap">
                                                <div className="flex justify-end gap-2">
                                                    <SecondaryAction onClick={() => openEdit(user)} className="px-3 py-2">Edit</SecondaryAction>
                                                    <button onClick={() => destroyUser(user)} className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100">Delete</button>
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

            <CrudModal open={modalOpen} title={editingUser ? 'Edit User' : 'Add User'} onClose={closeModal}>
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
                            <span>Role</span>
                            <select value={form.data.role_id} onChange={(event) => form.setData('role_id', event.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100">
                                <option value="">Select role</option>
                                {roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
                            </select>
                        </label>
                        <label className="space-y-2 text-sm font-medium text-gray-700">
                            <span>Department</span>
                            <select value={form.data.department_id} onChange={(event) => form.setData('department_id', event.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100">
                                <option value="">Select department</option>
                                {departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}
                            </select>
                        </label>
                        <label className="space-y-2 text-sm font-medium text-gray-700">
                            <span>Company</span>
                            <select value={form.data.company_id} onChange={(event) => form.setData('company_id', event.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100">
                                <option value="">Select company</option>
                                {companies.map((company) => (
                                    <option key={company.id} value={company.id}>
                                        {company.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                    {roles.find((role) => String(role.id) === String(form.data.role_id))?.name === 'student' && (
                        <label className="space-y-2 text-sm font-medium text-gray-700">
                            <span>Student ID</span>
                            <input value={form.data.student_id} onChange={(event) => form.setData('student_id', event.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100" />
                        </label>
                    )}
                    <label className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700">
                        <input type="checkbox" checked={form.data.is_active} onChange={(event) => form.setData('is_active', event.target.checked)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        Mark this user as active
                    </label>
                    <div className="flex justify-end gap-3">
                        <SecondaryAction onClick={closeModal}>Cancel</SecondaryAction>
                        <PrimaryAction type="submit" disabled={form.processing}>{form.processing ? 'Saving...' : editingUser ? 'Update User' : 'Create User'}</PrimaryAction>
                    </div>
                </form>
            </CrudModal>
        </AuthenticatedLayout>
    );
}
