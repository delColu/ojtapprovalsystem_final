import React, { useMemo, useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    CalendarDaysIcon,
    ChevronDownIcon,
    DocumentCheckIcon,
    DocumentIcon,
    FolderIcon,
    PaperAirplaneIcon,
    UserCircleIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';

export default function SubmitReports({ availableFolders }) {
    const { auth } = usePage().props;
    const userName = auth?.user?.name || 'Student';
    const [showPreview, setShowPreview] = useState(false);
    const [isFolderOpen, setIsFolderOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        folder_id: '',
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        file: null,
    });

    const folders = availableFolders || [];

    const selectedFolder = useMemo(
        () => folders.find((folder) => String(folder.id) === String(data.folder_id)) || null,
        [folders, data.folder_id]
    );

    const completionScore = useMemo(() => {
        let score = 0;
        if (data.folder_id) score += 25;
        if (data.title.trim()) score += 25;
        if (data.description.trim()) score += 25;
        if (data.file) score += 25;
        return score;
    }, [data.folder_id, data.title, data.description, data.file]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('folder_id', data.folder_id);
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('date', data.date);
        if (data.file) {
            formData.append('file', data.file);
        }

        post('/submissions', {
            data: formData,
            onSuccess: () => {
                reset();
                setData('folder_id', '');
                setData('title', '');
                setData('description', '');
                setData('date', new Date().toISOString().split('T')[0]);
                setData('file', null);
                setShowPreview(false);
                setIsFolderOpen(false);
            },
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const maxSize = 10 * 1024 * 1024;
            if (file.size > maxSize) {
                alert('File size must be less than 10MB');
                return;
            }
            setData('file', file);
        }
    };

    const selectFolder = (folder) => {
        setData('folder_id', folder.id);
        setIsFolderOpen(false);
    };

    const getSelectedFolderName = () => {
        if (!data.folder_id) return 'Select folder';
        return selectedFolder ? selectedFolder.name : 'Select folder';
    };

    const handleClear = () => {
        reset();
        setData('folder_id', '');
        setData('title', '');
        setData('description', '');
        setData('date', new Date().toISOString().split('T')[0]);
        setData('file', null);
        setShowPreview(false);
        setIsFolderOpen(false);
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return '0 KB';
        const kb = bytes / 1024;
        if (kb < 1024) return `${kb.toFixed(1)} KB`;
        return `${(kb / 1024).toFixed(2)} MB`;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Submit Reports | CAST OJT System" />

            <div className="min-h-[calc(100vh-88px)] bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900">
                <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
                    <div className="overflow-hidden rounded-2xl border border-slate-500/60 bg-slate-900/65 shadow-[0_24px_70px_rgba(15,23,42,0.4)] backdrop-blur ring-1 ring-white/10">
                        <div className="grid lg:grid-cols-[1fr_0.9fr]">
                            <div className="border-b border-slate-500/40 p-5 sm:p-6 lg:border-b-0 lg:border-r lg:border-slate-500/40">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-rose-400">
                                            Submit Report
                                        </p>
                                        <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">
                                            Submission Form
                                        </h1>
                                    </div>


                                </div>

                                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-800/80 ring-1 ring-white/10">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 transition-all duration-500"
                                        style={{ width: `${completionScore}%` }}
                                    />
                                </div>

                                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                                            Folder <span className="text-rose-500">*</span>
                                        </label>

                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setIsFolderOpen(!isFolderOpen)}
                                                className="flex w-full items-center justify-between rounded-xl border border-slate-500/50 bg-gradient-to-br from-slate-800/85 to-slate-900/85 px-3 py-3 text-left text-slate-200 transition duration-300 hover:border-rose-500/50 hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-rose-500/10"
                                            >
                                                <div className="flex min-w-0 items-center gap-2">
                                                    <div className="rounded-lg border border-slate-500/40 bg-slate-800/90 p-1.5 text-rose-400 shadow-sm ring-1 ring-white/10">
                                                        <FolderIcon className="h-4 w-4" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className={`truncate text-sm font-semibold ${data.folder_id ? 'text-white' : 'text-slate-500'}`}>
                                                            {getSelectedFolderName()}
                                                        </p>
                                                        <p className="mt-0.5 text-[10px] text-slate-500">
                                                            {selectedFolder
                                                                ? `${selectedFolder.supervisor_name || 'No supervisor'} • ${selectedFolder.due_date || 'No due date'}`
                                                                : 'Choose destination'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <ChevronDownIcon className={`h-4 w-4 text-slate-500 transition ${isFolderOpen ? 'rotate-180' : ''}`} />
                                            </button>

                                            {isFolderOpen && folders.length > 0 && (
                                                <div className="absolute z-20 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-500/50 bg-slate-900/95 p-1 shadow-2xl shadow-black/30 ring-1 ring-white/10">
                                                    {folders.map((folder) => (
                                                        <button
                                                            key={folder.id}
                                                            type="button"
                                                            onClick={() => selectFolder(folder)}
                                                            className="w-full rounded-lg px-3 py-2 text-left transition hover:bg-rose-500/10"
                                                        >
                                                            <p className="text-sm font-semibold text-white">{folder.name}</p>
                                                            <p className="mt-0.5 text-[10px] text-slate-400">
                                                                {folder.supervisor_name || 'No supervisor'} • {folder.due_date || 'No due date'}
                                                            </p>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}

                                            {isFolderOpen && folders.length === 0 && (
                                                <div className="absolute z-20 mt-2 w-full rounded-xl border border-slate-500/50 bg-slate-900/95 p-3 shadow-lg ring-1 ring-white/10">
                                                    <p className="text-xs text-slate-400">No folders available.</p>
                                                </div>
                                            )}
                                        </div>

                                        {errors.folder_id && <p className="mt-1 text-[10px] text-red-500">{errors.folder_id}</p>}
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                                            Title <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            className="w-full rounded-xl border border-slate-500/50 bg-gradient-to-br from-slate-800/85 to-slate-900/85 px-3 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-rose-500/40 focus:bg-slate-800 focus:ring-4 focus:ring-rose-500/10"
                                            placeholder="Weekly Accomplishment Report"
                                            required
                                        />
                                        {errors.title && <p className="mt-1 text-[10px] text-red-500">{errors.title}</p>}
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                                            Summary <span className="text-rose-500">*</span>
                                        </label>
                                        <textarea
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            rows="4"
                                            className="w-full resize-none rounded-xl border border-slate-500/50 bg-gradient-to-br from-slate-800/85 to-slate-900/85 px-3 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-rose-500/40 focus:bg-slate-800 focus:ring-4 focus:ring-rose-500/10"
                                            placeholder="Write a short report summary..."
                                            required
                                        />
                                        {errors.description && <p className="mt-1 text-[10px] text-red-500">{errors.description}</p>}
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                                                Date
                                            </label>
                                            <div className="relative">
                                                <CalendarDaysIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                                                <input
                                                    type="date"
                                                    value={data.date}
                                                    onChange={(e) => setData('date', e.target.value)}
                                                    className="w-full rounded-xl border border-slate-500/50 bg-gradient-to-br from-slate-800/85 to-slate-900/85 py-3 pl-9 pr-3 text-sm text-slate-200 outline-none transition focus:border-rose-500/40 focus:bg-slate-800 focus:ring-4 focus:ring-rose-500/10"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                                                Student
                                            </label>
                                            <div className="flex items-center gap-2 rounded-xl border border-slate-500/50 bg-gradient-to-br from-slate-800/85 to-slate-900/85 px-3 py-3 ring-1 ring-white/10">
                                                <div className="rounded-lg border border-slate-500/40 bg-slate-800/90 p-1.5 text-rose-400 shadow-sm ring-1 ring-white/10">
                                                    <UserCircleIcon className="h-4 w-4" />
                                                </div>
                                                <span className="truncate text-sm font-semibold text-white">{userName}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                                            File
                                        </label>

                                        <div
                                            className="cursor-pointer rounded-xl border-2 border-dashed border-rose-500/30 bg-gradient-to-br from-slate-800/80 to-slate-900/85 p-4 transition duration-300 hover:border-rose-500/50"
                                            onClick={() => document.getElementById('file-upload')?.click()}
                                        >
                                            <input
                                                type="file"
                                                onChange={handleFileChange}
                                                className="hidden"
                                                id="file-upload"
                                                accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                                            />

                                            <div className="flex flex-col items-center text-center">
                                                <div className="rounded-full border border-slate-500/40 bg-slate-800/90 p-2.5 text-rose-400 shadow-sm ring-1 ring-white/10">
                                                    <DocumentIcon className="h-5 w-5" />
                                                </div>
                                                <p className="mt-2 text-sm font-semibold text-white">
                                                    {data.file ? data.file.name : 'Choose file'}
                                                </p>
                                                <p className="mt-0.5 text-[10px] text-slate-500">
                                                    PDF, DOC, DOCX, TXT, JPG, PNG • Max 10MB
                                                </p>
                                            </div>
                                        </div>

                                        {data.file && (
                                            <div className="mt-2 flex items-center justify-between rounded-xl border border-emerald-500/35 bg-emerald-500/10 px-3 py-2 ring-1 ring-white/10">
                                                <div className="flex items-center gap-2">
                                                    <div className="rounded-lg border border-emerald-500/30 bg-slate-900/50 p-1.5 text-emerald-300">
                                                        <DocumentCheckIcon className="h-3.5 w-3.5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-emerald-100">{data.file.name}</p>
                                                        <p className="text-[10px] text-emerald-300">{formatFileSize(data.file.size)}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setData('file', null);
                                                    }}
                                                    className="rounded-lg border border-emerald-500/30 bg-slate-900/50 px-2 py-1 text-[10px] font-semibold text-emerald-200 transition hover:bg-emerald-500/15"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2 border-t border-slate-500/40 pt-4 sm:flex-row sm:justify-between">
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setShowPreview(true)}
                                                disabled={!data.folder_id && !data.title && !data.description && !data.file}
                                                className="inline-flex items-center justify-center rounded-xl border border-slate-500/50 bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-rose-500/40 hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                Preview
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleClear}
                                                className="inline-flex items-center justify-center rounded-xl border border-slate-500/50 bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:bg-slate-700"
                                            >
                                                Clear
                                            </button>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={processing || !data.folder_id}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-500/40 bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 px-5 py-2 text-xs font-semibold text-white shadow-[0_14px_30px_-16px_rgba(244,63,94,0.85)] transition hover:from-rose-700 hover:via-pink-700 hover:to-fuchsia-700 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <PaperAirplaneIcon className="h-3.5 w-3.5" />
                                            {processing ? 'Submitting...' : 'Submit'}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <div className="bg-[linear-gradient(180deg,rgba(15,23,42,0.88)_0%,rgba(15,23,42,0.78)_34%,rgba(30,41,59,0.92)_100%)] p-5 sm:p-6">
                                <div className="rounded-xl border border-slate-500/50 bg-slate-900/55 p-4 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.9)] backdrop-blur ring-1 ring-white/10">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-300">
                                        Preview Panel
                                    </p>

                                    <div className="mt-3 space-y-3">
                                        <div className="rounded-lg border border-slate-500/40 bg-slate-800/80 p-3 ring-1 ring-white/10">
                                            <p className="text-[10px] uppercase tracking-wide text-slate-500">Folder</p>
                                            <p className="mt-1 text-sm font-semibold text-white">
                                                {selectedFolder?.name || 'Not selected'}
                                            </p>
                                        </div>

                                        <div className="rounded-lg border border-slate-500/40 bg-slate-800/80 p-3 ring-1 ring-white/10">
                                            <p className="text-[10px] uppercase tracking-wide text-slate-500">Title</p>
                                            <p className="mt-1 text-sm font-semibold text-white">
                                                {data.title || 'Not provided'}
                                            </p>
                                        </div>

                                        <div className="rounded-lg border border-slate-500/40 bg-slate-800/80 p-3 ring-1 ring-white/10">
                                            <p className="text-[10px] uppercase tracking-wide text-slate-500">Date</p>
                                            <p className="mt-1 text-sm font-semibold text-white">
                                                {data.date || 'Not set'}
                                            </p>
                                        </div>

                                        <div className="rounded-lg border border-slate-500/40 bg-slate-800/80 p-3 ring-1 ring-white/10">
                                            <p className="text-[10px] uppercase tracking-wide text-slate-500">File</p>
                                            <p className="mt-1 text-sm font-semibold text-white">
                                                {data.file ? data.file.name : 'No file'}
                                            </p>
                                        </div>

                                        {selectedFolder && (
                                            <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 ring-1 ring-white/10">
                                                <p className="text-[10px] uppercase tracking-wide text-rose-300">Details</p>
                                                <div className="mt-1 space-y-0.5 text-xs text-slate-300">
                                                    <p>{selectedFolder.supervisor_name || 'No supervisor'}</p>
                                                    <p>{selectedFolder.due_date || 'No due date'}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showPreview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
                    <div className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-xl border border-slate-500/60 bg-slate-900 shadow-2xl shadow-black/40 ring-1 ring-white/10">
                        <div className="flex items-start justify-between border-b border-slate-500/40 px-5 py-4">
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-400">
                                    Preview
                                </p>
                                <h2 className="mt-1 text-xl font-bold text-white">Submission Summary</h2>
                            </div>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="rounded-xl p-1.5 text-slate-500 transition hover:bg-slate-800 hover:text-slate-300"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-3 p-5">
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-lg border border-slate-500/40 bg-slate-800/80 p-3 ring-1 ring-white/10">
                                    <p className="text-[10px] uppercase tracking-wide text-slate-500">Student</p>
                                    <p className="mt-1 text-sm font-semibold text-white">{userName}</p>
                                </div>
                                <div className="rounded-lg border border-slate-500/40 bg-slate-800/80 p-3 ring-1 ring-white/10">
                                    <p className="text-[10px] uppercase tracking-wide text-slate-500">Date</p>
                                    <p className="mt-1 text-sm font-semibold text-white">{data.date || 'Not provided'}</p>
                                </div>
                            </div>

                            <div className="rounded-lg border border-slate-500/40 bg-slate-800/80 p-3 ring-1 ring-white/10">
                                <p className="text-[10px] uppercase tracking-wide text-slate-500">Folder</p>
                                <p className="mt-1 text-sm font-semibold text-white">{getSelectedFolderName()}</p>
                            </div>

                            <div className="rounded-lg border border-slate-500/40 bg-slate-800/80 p-3 ring-1 ring-white/10">
                                <p className="text-[10px] uppercase tracking-wide text-slate-500">Title</p>
                                <p className="mt-1 text-sm font-semibold text-white">{data.title || 'Not provided'}</p>
                            </div>

                            <div className="rounded-lg border border-slate-500/40 bg-slate-800/80 p-3 ring-1 ring-white/10">
                                <p className="text-[10px] uppercase tracking-wide text-slate-500">Summary</p>
                                <p className="mt-1 whitespace-pre-wrap text-xs leading-6 text-slate-300">
                                    {data.description || 'Not provided'}
                                </p>
                            </div>

                            <div className="rounded-lg border border-emerald-500/35 bg-emerald-500/10 p-3 ring-1 ring-white/10">
                                <p className="text-[10px] uppercase tracking-wide text-emerald-300">File</p>
                                <p className="mt-1 text-sm font-semibold text-emerald-100">
                                    {data.file ? data.file.name : 'No file attached'}
                                </p>
                                {data.file && (
                                    <p className="mt-0.5 text-[10px] text-emerald-300">{formatFileSize(data.file.size)}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end border-t border-slate-500/40 px-5 py-4">
                            <button
                                onClick={() => setShowPreview(false)}
                                className="rounded-xl border border-rose-500/40 bg-gradient-to-r from-rose-600 to-pink-600 px-4 py-2 text-xs font-semibold text-white shadow-[0_14px_30px_-16px_rgba(244,63,94,0.85)] transition hover:from-rose-700 hover:to-pink-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
