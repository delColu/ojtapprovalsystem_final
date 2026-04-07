import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Tasks({ folders = [] }) {
    const [editingFolder, setEditingFolder] = useState(null);
    const createFolderForm = useForm({ name: '', description: '', due_date: '' });
    const editFolderForm = useForm({ name: '', description: '', due_date: '' });

    const submitCreateFolder = (event) => {
        event.preventDefault();
        createFolderForm.post('/folders');
    };

    const startEditingFolder = (folder) => {
        setEditingFolder(folder.id);
        editFolderForm.setData({
            name: folder.name ?? '',
            description: folder.description ?? '',
            due_date: folder.due_date ?? '',
        });
    };

    const submitFolderUpdate = (folderId) => {
        editFolderForm.put(`/folders/${folderId}`, {
            onSuccess: () => setEditingFolder(null),
        });
    };

    const deleteFolder = (folder) => {
        if (window.confirm(`Delete folder "${folder.name}"?`)) {
            editFolderForm.delete(`/folders/${folder.id}`);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Supervisor Tasks" />
            <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
                <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-900">Create Folder</h2>
                    <form onSubmit={submitCreateFolder} className="mt-5 space-y-4">
                        <input type="text" value={createFolderForm.data.name} onChange={(event) => createFolderForm.setData('name', event.target.value)} placeholder="Folder Name" className="w-full rounded-xl border border-gray-300 px-4 py-3" />
                        <textarea value={createFolderForm.data.description} onChange={(event) => createFolderForm.setData('description', event.target.value)} placeholder="Description" rows={4} className="w-full rounded-xl border border-gray-300 px-4 py-3" />
                        <input type="date" value={createFolderForm.data.due_date} onChange={(event) => createFolderForm.setData('due_date', event.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3" />
                        <button type="submit" className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white">Create Folder</button>
                    </form>
                </section>

                <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
                            <p className="text-sm text-gray-500">Folder management with edit and delete actions.</p>
                        </div>
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">{folders.length} folders</span>
                    </div>
                    {folders.length === 0 ? (
                        <p className="rounded-2xl bg-gray-50 px-4 py-5 text-sm text-gray-500">No folders created yet.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Folder Name</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Description</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Due Date</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Assigned Reports</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {folders.map((folder) => (
                                        <tr key={folder.id}>
                                            <td className="px-4 py-4 text-sm font-medium text-gray-900">
                                                {editingFolder === folder.id ? <input type="text" value={editFolderForm.data.name} onChange={(event) => editFolderForm.setData('name', event.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2" /> : folder.name}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-600">
                                                {editingFolder === folder.id ? <textarea rows={3} value={editFolderForm.data.description} onChange={(event) => editFolderForm.setData('description', event.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2" /> : (folder.description || 'No description')}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-600">
                                                {editingFolder === folder.id ? <input type="date" value={editFolderForm.data.due_date || ''} onChange={(event) => editFolderForm.setData('due_date', event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2" /> : (folder.due_date || 'No due date')}
                                            </td>
                                            <td className="px-4 py-4 text-sm font-medium text-gray-700">{folder.submissions_count}</td>
                                            <td className="px-4 py-4 text-right text-sm">
                                                <div className="flex justify-end gap-2">
                                                    {editingFolder === folder.id ? (
                                                        <>
                                                            <button type="button" onClick={() => submitFolderUpdate(folder.id)} className="rounded-lg bg-gray-900 px-3 py-2 text-white">Save</button>
                                                            <button type="button" onClick={() => setEditingFolder(null)} className="rounded-lg border border-gray-300 px-3 py-2 text-gray-700">Cancel</button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button type="button" onClick={() => startEditingFolder(folder)} className="rounded-lg border border-gray-300 px-3 py-2 text-gray-700">Edit</button>
                                                            <button type="button" onClick={() => deleteFolder(folder)} className="rounded-lg border border-red-200 px-3 py-2 text-red-600">Delete</button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
