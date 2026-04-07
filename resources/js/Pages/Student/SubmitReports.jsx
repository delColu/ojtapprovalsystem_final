import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    FolderIcon,
    DocumentIcon,
    PaperAirplaneIcon,
    XMarkIcon,
    ChevronDownIcon
} from '@heroicons/react/24/outline';

export default function SubmitReports({ availableFolders }) {
    const { auth } = usePage().props;
    const [showPreview, setShowPreview] = useState(false);
    const [isFolderOpen, setIsFolderOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        folder_id: '',
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        file: null
    });

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
            }
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
        if (!data.folder_id) return 'Choose a folder';
        const folder = availableFolders?.find(f => f.id === data.folder_id);
        return folder ? folder.name : 'Choose a folder';
    };

    const handleClear = () => {
        reset();
        setData('folder_id', '');
        setData('title', '');
        setData('description', '');
        setData('date', new Date().toISOString().split('T')[0]);
        setData('file', null);
    };

    const folders = availableFolders || [];

    return (
        <AuthenticatedLayout>
            <Head title="Submit Reports | CAST OJT System" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-gray-200">
                            <h1 className="text-xl font-semibold text-gray-900">Report Details</h1>
                            <p className="text-sm text-gray-500 mt-1">Fill in the details and upload your report file</p>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Select Folder */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Folder <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setIsFolderOpen(!isFolderOpen)}
                                        className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <span className={data.folder_id ? 'text-gray-900' : 'text-gray-400'}>
                                            {getSelectedFolderName()}
                                        </span>
                                        <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                                    </button>

                                    {isFolderOpen && folders.length > 0 && (
                                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                            {folders.map((folder) => (
                                                <div
                                                    key={folder.id}
                                                    onClick={() => selectFolder(folder)}
                                                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                                                >
                                                    <div className="flex items-start space-x-3">
                                                        <FolderIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-gray-900">{folder.name}</p>
                                                            <p className="text-xs text-gray-500">{folder.description}</p>
                                                            <div className="flex items-center gap-3 mt-1">
                                                                <span className="text-xs text-gray-400">Due: {folder.due_date}</span>
                                                                <span className="text-xs text-gray-400">Supervisor: {folder.supervisor_name}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {errors.folder_id && <p className="text-red-500 text-xs mt-1">{errors.folder_id}</p>}
                            </div>

                            {/* Report Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Report Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Week 1 Progress Report"
                                    required
                                />
                                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    rows="4"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    placeholder="Briefly describe your activities and accomplishments..."
                                    required
                                />
                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={data.date}
                                        onChange={e => setData('date', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />

                                </div>
                            </div>

                            {/* File Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Upload a file
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer"
                                     onClick={() => document.getElementById('file-upload').click()}>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="file-upload"
                                        accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                                    />
                                    <DocumentIcon className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600">
                                        {data.file ? data.file.name : 'Click to upload or drag and drop'}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX, TXT, JPG, PNG (Max 10MB)</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={processing || !data.folder_id}
                                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Submitting...' : 'Submit Report'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Clear
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Preview Modal */}
            {showPreview && data.folder_id && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-900">Preview Report</h2>
                            <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-gray-600">
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1">
                                    <h3 className="text-sm font-medium text-gray-500">Folder</h3>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-900">{getSelectedFolderName()}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1">
                                    <h3 className="text-sm font-medium text-gray-500">Title</h3>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-900">{data.title || 'Not provided'}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1">
                                    <h3 className="text-sm font-medium text-gray-500">Description</h3>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{data.description || 'Not provided'}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1">
                                    <h3 className="text-sm font-medium text-gray-500">Date</h3>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-900">{data.date || 'Not provided'}</p>
                                </div>
                            </div>
                            {data.file && (
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-1">
                                        <h3 className="text-sm font-medium text-gray-500">Attached File</h3>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm text-gray-900">{data.file.name}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-6 border-t flex justify-end">
                            <button onClick={() => setShowPreview(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
