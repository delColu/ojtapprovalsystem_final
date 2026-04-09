import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

function InputField({ label, children }) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                {label}
            </span>
            {children}
        </label>
    );
}

function StatCard({ label, value, accent, trend }) {
    return (
        <div className="rounded-lg border border-slate-500/80 bg-gradient-to-b from-slate-800/95 to-slate-900/95 p-3 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.9)] ring-1 ring-white/5">
            <div className={`h-1.5 w-8 rounded-full bg-gradient-to-r ${accent}`} />
            <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
            <div className="mt-1 flex items-baseline gap-2">
                <p className="text-xl font-semibold tracking-tight text-white">{value}</p>
                {trend && <span className="text-[10px] font-medium text-emerald-400">{trend}</span>}
            </div>
        </div>
    );
}

function StatusBadge({ folder }) {
    if (folder.is_closed_for_submission) {
        return (
            <span className="rounded-full border border-rose-500/30 bg-rose-500/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-300">
                Closed
            </span>
        );
    }

    if (folder.is_temporarily_reopened) {
        return (
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Reopened
            </span>
        );
    }

    return (
        <span className="rounded-full border border-cyan-500/30 bg-cyan-500/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
            Open
        </span>
    );
}

const inputClass =
    'w-full rounded-lg border-2 border-slate-600 bg-slate-800/80 px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20';

const actionButtonClass =
    'inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-medium transition';

export default function Tasks({ folders = [] }) {
    const [editingFolder, setEditingFolder] = useState(null);
    const createFolderForm = useForm({ name: '', description: '', due_date: '' });
    const editFolderForm = useForm({ name: '', description: '', due_date: '' });

    const submitCreateFolder = (event) => {
        event.preventDefault();
        createFolderForm.post('/folders', {
            onSuccess: () => createFolderForm.reset(),
        });
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

    const toggleReopen = (folder) => {
        router.post(route('folders.toggle-reopen', folder.id));
    };

    const stats = useMemo(() => {
        const total = folders.length;
        const closed = folders.filter((folder) => folder.is_closed_for_submission).length;
        const reopened = folders.filter((folder) => folder.is_temporarily_reopened).length;
        const open = total - closed;
        const reports = folders.reduce((sum, folder) => sum + (folder.submissions_count || 0), 0);

        return { total, closed, reopened, open, reports };
    }, [folders]);

    return (
        <AuthenticatedLayout>
            <Head title="Supervisor Tasks" />

            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-6 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl space-y-6">
                    <div className="border-b-2 border-slate-700 pb-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div className="space-y-2">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-400">
                                    Supervisor Workspace
                                </p>
                                <div className="space-y-1">
                                    <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                                        Tasks
                                    </h1>
                                    <p className="max-w-xl text-sm text-slate-400">
                                        Create, organize, and manage task folders with the same streamlined card layout.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-2">
                                <StatCard
                                    label="Total Folders"
                                    value={stats.total}
                                    accent="from-slate-500 to-slate-600"
                                />
                                <StatCard
                                    label="Open"
                                    value={stats.open}
                                    accent="from-cyan-600 to-blue-500"
                                />
                                <StatCard
                                    label="Closed"
                                    value={stats.closed}
                                    accent="from-rose-500 to-pink-500"
                                />
                                <StatCard
                                    label="Reports"
                                    value={stats.reports}
                                    accent="from-emerald-500 to-teal-400"
                                    trend={stats.reopened > 0 ? `${stats.reopened} reopened` : null}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
                        <section className="rounded-lg border border-slate-500/80 bg-gradient-to-b from-slate-800/95 to-slate-900/95 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.9)] ring-1 ring-white/5">
                            <div className="border-b border-slate-600/80 bg-white/[0.02] px-4 py-3">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                                    Folder Builder
                                </p>
                                <h2 className="mt-1 text-lg font-semibold tracking-tight text-white">Create Folder</h2>
                                <p className="mt-0.5 text-xs text-slate-400">Set up a task space for intern submissions.</p>
                            </div>

                            <form onSubmit={submitCreateFolder} className="space-y-4 p-4">
                                <InputField label="Folder Name">
                                    <input
                                        type="text"
                                        value={createFolderForm.data.name}
                                        onChange={(event) => createFolderForm.setData('name', event.target.value)}
                                        placeholder="Weekly Accomplishment"
                                        className={inputClass}
                                    />
                                </InputField>

                                <InputField label="Description">
                                    <textarea
                                        value={createFolderForm.data.description}
                                        onChange={(event) => createFolderForm.setData('description', event.target.value)}
                                        placeholder="Short task notes"
                                        rows={4}
                                        className={`${inputClass} resize-none`}
                                    />
                                </InputField>

                                <InputField label="Deadline">
                                    <input
                                        type="date"
                                        value={createFolderForm.data.due_date}
                                        onChange={(event) => createFolderForm.setData('due_date', event.target.value)}
                                        className={inputClass}
                                    />
                                </InputField>

                                <button
                                    type="submit"
                                    disabled={createFolderForm.processing}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-700 disabled:opacity-50"
                                >
                                    {createFolderForm.processing ? 'Creating...' : 'Create Folder'}
                                </button>
                            </form>
                        </section>

                        <section className="space-y-3">
                            <div className="grid gap-2 rounded-lg border border-slate-500/80 bg-gradient-to-b from-slate-800/95 to-slate-900/95 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.9)] ring-1 ring-white/5 md:grid-cols-[1.25fr_1.1fr_0.9fr_0.85fr]">
                                <div>Task Folder</div>
                                <div>Details</div>
                                <div className="md:text-center">Reports</div>
                                <div className="md:text-center">Status</div>
                            </div>

                            {folders.length === 0 ? (
                                <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-500/80 bg-slate-800/60 px-6 text-center shadow-[0_18px_40px_-28px_rgba(15,23,42,0.9)] ring-1 ring-white/5">
                                    <div className="rounded-lg border border-slate-500/80 bg-slate-700/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-300 shadow-sm">
                                        No Folders
                                    </div>
                                    <p className="mt-3 text-sm font-medium text-slate-400">No task folders created yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {folders.map((folder, index) => {
                                        const isEditing = editingFolder === folder.id;

                                        return (
                                            <div
                                                key={folder.id}
                                                className="rounded-lg border border-slate-500/80 bg-gradient-to-b from-slate-800/88 to-slate-900/82 px-4 py-3 text-left shadow-[0_18px_40px_-28px_rgba(15,23,42,0.9)] ring-1 ring-white/5 transition-all duration-300 hover:border-cyan-500/45 hover:shadow-[0_22px_44px_-26px_rgba(6,182,212,0.2)]"
                                            >
                                                <div className="grid gap-3 md:grid-cols-[1.25fr_1.1fr_0.9fr_0.85fr] md:items-start">
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-cyan-500/20 bg-gradient-to-br from-cyan-500/18 to-indigo-500/18 text-sm font-semibold text-cyan-300 shadow-inner shadow-cyan-950/20">
                                                                {folder.name?.charAt(0).toUpperCase() || 'F'}
                                                            </div>
                                                            <div className="min-w-0">
                                                                {isEditing ? (
                                                                    <input
                                                                        type="text"
                                                                        value={editFolderForm.data.name}
                                                                        onChange={(event) => editFolderForm.setData('name', event.target.value)}
                                                                        className={inputClass}
                                                                    />
                                                                ) : (
                                                                    <div className="flex items-center gap-2">
                                                                        <p className="truncate text-sm font-semibold tracking-tight text-white">
                                                                            {folder.name}
                                                                        </p>
                                                                        <span className="hidden sm:inline-flex rounded-full border border-slate-500/80 bg-slate-700/85 px-2 py-0.5 text-[9px] font-semibold text-slate-300 shadow-sm">
                                                                            #{String(index + 1).padStart(2, '0')}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                {!isEditing && (
                                                                    <p className="mt-0.5 text-[11px] text-slate-400">
                                                                        Due: {folder.due_date || 'No due date'}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="rounded-lg border border-slate-500/80 bg-slate-800/65 p-3 ring-1 ring-white/5">
                                                            <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                                                                Description
                                                            </p>
                                                            {isEditing ? (
                                                                <textarea
                                                                    rows={3}
                                                                    value={editFolderForm.data.description}
                                                                    onChange={(event) => editFolderForm.setData('description', event.target.value)}
                                                                    className={`${inputClass} resize-none`}
                                                                />
                                                            ) : (
                                                                <p className="text-xs leading-5 text-slate-300">
                                                                    {folder.description || 'No description'}
                                                                </p>
                                                            )}
                                                        </div>

                                                        {isEditing && (
                                                            <div className="rounded-lg border border-slate-500/80 bg-slate-800/65 p-3 ring-1 ring-white/5">
                                                                <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                                                                    Due Date
                                                                </p>
                                                                <input
                                                                    type="date"
                                                                    value={editFolderForm.data.due_date || ''}
                                                                    onChange={(event) => editFolderForm.setData('due_date', event.target.value)}
                                                                    className={inputClass}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center justify-start md:justify-center">
                                                        <span className="inline-flex h-7 min-w-[42px] items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-600 px-2.5 text-xs font-semibold text-white shadow-[0_10px_24px_-14px_rgba(6,182,212,0.8)]">
                                                            {folder.submissions_count || 0}
                                                        </span>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between gap-2 md:flex-col md:items-center md:justify-center">
                                                            <StatusBadge folder={folder} />
                                                        </div>

                                                        <div className="flex flex-wrap gap-1.5 md:justify-center">
                                                            {isEditing ? (
                                                                <>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => submitFolderUpdate(folder.id)}
                                                                        className={`${actionButtonClass} bg-cyan-600 text-white hover:bg-cyan-700`}
                                                                    >
                                                                        Save
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setEditingFolder(null)}
                                                                        className={`${actionButtonClass} border border-slate-500/80 bg-slate-700/90 text-slate-300 hover:bg-slate-600`}
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => startEditingFolder(folder)}
                                                                        className={`${actionButtonClass} border border-slate-500/80 bg-slate-700/90 text-slate-300 hover:bg-slate-600`}
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                    {folder.is_closed_for_submission && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => toggleReopen(folder)}
                                                                            className={`${actionButtonClass} border border-emerald-500/30 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30`}
                                                                        >
                                                                            Reopen
                                                                        </button>
                                                                    )}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => deleteFolder(folder)}
                                                                        className={`${actionButtonClass} border border-rose-500/30 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30`}
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {folders.length > 0 && (
                                <div className="flex items-center justify-between rounded-lg border border-slate-500/80 bg-gradient-to-b from-slate-800/95 to-slate-900/95 px-4 py-2.5 text-xs text-slate-400 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.9)] ring-1 ring-white/5">
                                    <span>Showing {folders.length} task folders</span>
                                    <span className="text-[11px]">Total reports: {stats.reports}</span>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
