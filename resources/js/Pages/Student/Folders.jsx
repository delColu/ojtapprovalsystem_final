import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowRightIcon,
    CalendarDaysIcon,
    FolderIcon,
    UserCircleIcon,
} from '@heroicons/react/24/outline';

function FolderCard({ folder }) {
    return (
        <div className="rounded-xl border border-slate-500/50 bg-gradient-to-r from-slate-900/80 to-slate-800/70 p-4 shadow-[0_12px_24px_-20px_rgba(15,23,42,0.9)] ring-1 ring-white/10 transition duration-300 hover:border-rose-500/50 hover:from-slate-900 hover:to-slate-800">
            <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                    <FolderIcon className="mt-0.5 h-5 w-5 text-rose-400" />
                    <div className="min-w-0 flex-1">
                        <h3 className="truncate text-base font-semibold text-white">
                            {folder.name}
                        </h3>
                        {folder.description && (
                            <p className="mt-1 line-clamp-2 text-sm text-slate-400">
                                {folder.description}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5 rounded-md border border-slate-500/40 bg-slate-800/90 px-3 py-1.5 text-slate-300 ring-1 ring-white/10">
                        <UserCircleIcon className="h-3.5 w-3.5 text-rose-400" />
                        <span className="text-xs">{folder.supervisor_name || 'Not assigned'}</span>
                    </div>

                    <div className="flex items-center gap-1.5 rounded-md border border-slate-500/40 bg-slate-800/90 px-3 py-1.5 text-slate-300 ring-1 ring-white/10">
                        <CalendarDaysIcon className="h-3.5 w-3.5 text-rose-400" />
                        <span className="text-xs">{folder.due_date || 'No due date'}</span>
                    </div>
                </div>

                <div className="flex">
                    <Link
                        href={route('submit-reports')}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-rose-500/40 bg-gradient-to-r from-rose-600 to-pink-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_-14px_rgba(244,63,94,0.8)] transition duration-300 hover:from-rose-500 hover:to-pink-500 hover:shadow-[0_14px_28px_-14px_rgba(244,63,94,0.95)]"
                    >
                        Submit Another Report
                        <ArrowRightIcon className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function Folders({ folders = [] }) {
    const totalFolders = folders.length;
    const foldersWithDueDate = folders.filter((folder) => folder.due_date).length;
    const foldersWithoutDueDate = totalFolders - foldersWithDueDate;

    return (
        <AuthenticatedLayout>
            <Head title="Folders | CAST OJT System" />

            <div className="min-h-[calc(100vh-88px)] bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        {/* Stats Cards */}
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="rounded-xl border border-slate-500/50 bg-gradient-to-br from-slate-800/85 via-slate-800/70 to-slate-900/85 p-4 shadow-[0_14px_30px_-18px_rgba(15,23,42,0.85)] backdrop-blur-sm ring-1 ring-white/10 transition duration-300 hover:border-slate-400/60 hover:shadow-[0_18px_36px_-18px_rgba(15,23,42,0.95)] hover:bg-slate-800">
                                <p className="text-sm text-slate-400">Total Folders</p>
                                <p className="mt-2 text-3xl font-bold text-white">{totalFolders}</p>
                                <p className="text-xs text-slate-500">Available submissions</p>
                            </div>
                            <div className="rounded-xl border border-slate-500/50 bg-gradient-to-br from-slate-800/85 via-slate-800/70 to-slate-900/85 p-4 shadow-[0_14px_30px_-18px_rgba(15,23,42,0.85)] backdrop-blur-sm ring-1 ring-white/10 transition duration-300 hover:border-slate-400/60 hover:shadow-[0_18px_36px_-18px_rgba(15,23,42,0.95)] hover:bg-slate-800">
                                <p className="text-sm text-slate-400">With Due Date</p>
                                <p className="mt-2 text-3xl font-bold text-white">{foldersWithDueDate}</p>
                                <p className="text-xs text-slate-500">Scheduled deadlines</p>
                            </div>
                            <div className="rounded-xl border border-slate-500/50 bg-gradient-to-br from-slate-800/85 via-slate-800/70 to-slate-900/85 p-4 shadow-[0_14px_30px_-18px_rgba(15,23,42,0.85)] backdrop-blur-sm ring-1 ring-white/10 transition duration-300 hover:border-slate-400/60 hover:shadow-[0_18px_36px_-18px_rgba(15,23,42,0.95)] hover:bg-slate-800">
                                <p className="text-sm text-slate-400">Open Folders</p>
                                <p className="mt-2 text-3xl font-bold text-white">{foldersWithoutDueDate}</p>
                                <p className="text-xs text-slate-500">No due date set</p>
                            </div>
                        </div>

                        {/* Folders List */}
                        {folders.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-rose-500/30 bg-rose-500/5 px-6 py-12 text-center">
                                <FolderIcon className="mx-auto h-12 w-12 text-rose-400/50" />
                                <h2 className="mt-3 text-lg font-semibold text-white">No folders yet</h2>
                                <p className="mt-1 text-sm text-slate-400">Check back later for available folders.</p>
                            </div>
                        ) : (
                            <div className="rounded-xl border border-slate-500/50 bg-gradient-to-br from-slate-800/80 via-slate-800/70 to-slate-900/85 p-5 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.9)] backdrop-blur-sm ring-1 ring-white/10">
                                <div className="space-y-4">
                                    {folders.map((folder) => (
                                        <FolderCard key={folder.id} folder={folder} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
