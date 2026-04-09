import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { CrudModal, EmptyState, PageIntro, Panel, PrimaryAction, SecondaryAction, SelectField, StatusBadge } from './Partials/AdminShared';

const emptyTask = {
    name: '',
    description: '',
    due_date: '',
    supervisor_id: '',
};

export default function Tasks({ tasks, departments, companies, filters, supervisors }) {
    const [status, setStatus] = useState(filters.status || '');
    const [department, setDepartment] = useState(filters.department || '');
    const [company, setCompany] = useState(filters.company || '');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const form = useForm(emptyTask);

    const applyFilters = (nextStatus = status, nextDepartment = department, nextCompany = company) => {
        router.get(route('admin.tasks.index'), { status: nextStatus, department: nextDepartment, company: nextCompany }, { preserveState: true, replace: true });
    };

    const openCreate = () => {
        setEditingTask(null);
        form.setData(emptyTask);
        setModalOpen(true);
    };

    const openEdit = (task) => {
        setEditingTask(task);
        form.setData({
            name: task.title || '',
            description: task.description || '',
            due_date: task.due_date_raw || '',
            supervisor_id: task.supervisor_id || '',
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingTask(null);
        form.reset();
        form.clearErrors();
    };

    const submit = (event) => {
        event.preventDefault();

        const options = { preserveScroll: true, onSuccess: closeModal };

        if (editingTask) {
            form.put(route('admin.tasks.update', editingTask.id), options);
            return;
        }

        form.post(route('admin.tasks.store'), options);
    };

    const destroyTask = (task) => {
        if (!window.confirm(`Delete task ${task.title}?`)) {
            return;
        }

        router.delete(route('admin.tasks.destroy', task.id), { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="All Tasks" />

            <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
                <PageIntro
                    eyebrow="Management"
                    title="Task Management"
                    description="Track and manage all assigned tasks across departments."
                    action={<PrimaryAction onClick={openCreate}>New Task</PrimaryAction>}
                />

                <Panel title="All Tasks" description="Filter tasks by status, department, and company">
                    <div className="mb-5 flex flex-col gap-3 xl:flex-row">
                        <SelectField value={status} onChange={(value) => { setStatus(value); applyFilters(value, department, company); }} options={[
                            { value: 'completed', label: 'Completed' },
                            { value: 'in_progress', label: 'In Progress' },
                            { value: 'pending', label: 'Pending' },
                            { value: 'overdue', label: 'Overdue' },
                        ]} placeholder="All" />
                        <SelectField value={department} onChange={(value) => { setDepartment(value); applyFilters(status, value, company); }} options={departments.map((name) => ({ value: name, label: name }))} placeholder="Department" />
                        <SelectField value={company} onChange={(value) => { setCompany(value); applyFilters(status, department, value); }} options={companies.map((name) => ({ value: name, label: name }))} placeholder="Company" />
                    </div>

                    {tasks.length === 0 ? (
                        <EmptyState title="No tasks found" description="Create a task or adjust the filters." />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
                                        <th className="pb-3 pr-4 font-semibold">Task Title</th>
                                        <th className="pb-3 pr-4 font-semibold">Assigned To</th>
                                        <th className="pb-3 pr-4 font-semibold">Company</th>
                                        <th className="pb-3 pr-4 font-semibold">Due Date</th>
                                        <th className="pb-3 pr-4 font-semibold">Status</th>
                                        <th className="pb-3 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {tasks.map((task) => (
                                        <tr key={task.id}>
                                            <td className="py-4 pr-4">
                                                <p className="font-semibold text-gray-900">{task.title}</p>
                                                <p className="text-xs text-gray-500">{task.description || 'No description'}</p>
                                            </td>
                                            <td className="py-4 pr-4 text-sm text-gray-600">{task.assigned_to}</td>
                                            <td className="py-4 pr-4 text-sm text-gray-600">{task.company}</td>
                                            <td className="py-4 pr-4 text-sm text-gray-600">{task.due_date}</td>
                                            <td className="py-4 pr-4"><StatusBadge status={task.status} /></td>
                                            <td className="py-4">
                                                <div className="flex justify-end gap-2">
                                                    <SecondaryAction onClick={() => openEdit(task)} className="px-3 py-2">Edit</SecondaryAction>
                                                    <button onClick={() => destroyTask(task)} className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100">Delete</button>
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

            <CrudModal open={modalOpen} title={editingTask ? 'Edit Task' : 'Add Task'} onClose={closeModal}>
                <form onSubmit={submit} className="space-y-4">
                    <label className="space-y-2 text-sm font-medium text-gray-700">
                        <span>Task Title</span>
                        <input value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100" />
                    </label>
                    <label className="space-y-2 text-sm font-medium text-gray-700">
                        <span>Description</span>
                        <textarea value={form.data.description} onChange={(event) => form.setData('description', event.target.value)} rows="4" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100" />
                    </label>
                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="space-y-2 text-sm font-medium text-gray-700">
                            <span>Supervisor</span>
                            <select value={form.data.supervisor_id} onChange={(event) => form.setData('supervisor_id', event.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100">
                                <option value="">Select supervisor</option>
                                {supervisors.map((supervisor) => <option key={supervisor.id} value={supervisor.id}>{supervisor.name}</option>)}
                            </select>
                        </label>
                        <label className="space-y-2 text-sm font-medium text-gray-700">
                            <span>Due Date</span>
                            <input type="date" value={form.data.due_date} onChange={(event) => form.setData('due_date', event.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100" />
                        </label>
                    </div>
                    <div className="flex justify-end gap-3">
                        <SecondaryAction onClick={closeModal}>Cancel</SecondaryAction>
                        <PrimaryAction type="submit" disabled={form.processing}>{form.processing ? 'Saving...' : editingTask ? 'Update Task' : 'Create Task'}</PrimaryAction>
                    </div>
                </form>
            </CrudModal>
        </AuthenticatedLayout>
    );
}
