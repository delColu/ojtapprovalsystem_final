// resources/js/Pages/Student/Dashboard.jsx
import React, { useState } from 'react';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    DocumentIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    FolderIcon,
    ArrowDownTrayIcon,
    EyeIcon
} from '@heroicons/react/24/outline';

export default function Dashboard({ stats, recentReports, availableFolders, notifications }) {
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [selectedReport, setSelectedReport] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);

    // Get the logged in user's name
    const { auth } = usePage().props;
    const userName = auth?.user?.name || 'User';

    const { data, setData, post, processing, reset } = useForm({
        folder_id: '',
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        file: null
    });

    // Provide default values if props are undefined
    const dashboardStats = stats || {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0
    };

    const reports = recentReports || [];
    const folders = availableFolders || [];

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
                setShowSubmitModal(false);
                setSelectedFolder(null);
            }
        });
    };

    const openSubmitModal = (folder) => {
        setSelectedFolder(folder);
        setData('folder_id', folder.id);
        setShowSubmitModal(true);
    };

    const openViewModal = (report) => {
        setSelectedReport(report);
        setShowViewModal(true);
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'approved': return <CheckCircleIcon className="h-4 w-4" />;
            case 'rejected': return <XCircleIcon className="h-4 w-4" />;
            default: return <ClockIcon className="h-4 w-4" />;
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Student Dashboard | CAST OJT System" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Welcome Banner with Username */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg mb-8 p-8 text-white">
                        <h1 className="text-3xl font-bold mb-2">
                            Welcome Back, {userName}! 👋
                        </h1>
                        <p className="text-blue-100">Track your OJT progress and manage your submissions efficiently</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Total Reports</p>
                                    <p className="text-3xl font-bold text-gray-900">{dashboardStats.total}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <DocumentIcon className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Pending</p>
                                    <p className="text-3xl font-bold text-yellow-600">{dashboardStats.pending}</p>
                                </div>
                                <div className="p-3 bg-yellow-100 rounded-full">
                                    <ClockIcon className="h-6 w-6 text-yellow-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Approved</p>
                                    <p className="text-3xl font-bold text-green-600">{dashboardStats.approved}</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-full">
                                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Rejected</p>
                                    <p className="text-3xl font-bold text-red-600">{dashboardStats.rejected}</p>
                                </div>
                                <div className="p-3 bg-red-100 rounded-full">
                                    <XCircleIcon className="h-6 w-6 text-red-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Recent Reports */}
                        <div className="bg-white rounded-xl shadow-sm">
                            <div className="p-6 border-b">
                                <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
                                <p className="text-sm text-gray-500 mt-1">Your latest submissions</p>
                            </div>
                            <div className="p-6">
                                {reports.length > 0 ? (
                                    <div className="space-y-4">
                                        {reports.map((report) => (
                                            <div
                                                key={report.id}
                                                className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                                                onClick={() => openViewModal(report)}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            <DocumentIcon className="h-4 w-4 text-gray-400" />
                                                            <h4 className="font-semibold text-gray-900">{report.title}</h4>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mb-2">{report.folder_name}</p>
                                                        <div className="flex items-center justify-between">
                                                            <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs rounded-full ${getStatusColor(report.status)}`}>
                                                                {getStatusIcon(report.status)}
                                                                <span>{report.status}</span>
                                                            </span>
                                                            <span className="text-xs text-gray-500">{report.created_at}</span>
                                                        </div>
                                                    </div>
                                                    <Link
                                                        href={`/submissions/${report.id}/download-pdf`}
                                                        className="text-blue-600 hover:text-blue-800 ml-4"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <ArrowDownTrayIcon className="h-5 w-5" />
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <DocumentIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500">No reports yet</p>
                                        <p className="text-sm text-gray-400">Submit your first report from available folders</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Available Folders */}
                        <div className="bg-white rounded-xl shadow-sm">
                            <div className="p-6 border-b">
                                <h3 className="text-lg font-semibold text-gray-900">Available Folders</h3>
                                <p className="text-sm text-gray-500 mt-1">Submit your reports to these folders</p>
                            </div>
                            <div className="p-6">
                                {folders.length > 0 ? (
                                    <div className="space-y-4">
                                        {folders.map((folder) => (
                                            <div key={folder.id} className="border rounded-lg p-4 hover:shadow-md transition-all">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            <FolderIcon className="h-5 w-5 text-blue-500" />
                                                            <h4 className="font-semibold text-gray-900">{folder.name}</h4>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mb-2">{folder.description}</p>
                                                        <div className="flex items-center justify-between">
                                                            <div className="text-xs text-gray-500">
                                                                <span>Due: {folder.due_date}</span>
                                                                <span className="mx-2">•</span>
                                                                <span>Supervisor: {folder.supervisor_name}</span>
                                                            </div>
                                                            <button
                                                                onClick={() => openSubmitModal(folder)}
                                                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm transition-colors"
                                                            >
                                                                Submit Report
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <FolderIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500">No available folders</p>
                                        <p className="text-sm text-gray-400">Check back later for new submission folders</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit Report Modal */}
            {showSubmitModal && selectedFolder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b">
                            <h2 className="text-2xl font-bold text-gray-900">Submit Report</h2>
                            <p className="text-sm text-gray-600 mt-1">Folder: {selectedFolder.name}</p>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter report title"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                                <textarea
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    rows="4"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Describe your report details..."
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                                <input
                                    type="date"
                                    value={data.date}
                                    onChange={e => setData('date', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
                                <input
                                    type="file"
                                    onChange={e => setData('file', e.target.files[0])}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    accept=".pdf,.doc,.docx,.txt"
                                />
                                <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX, TXT (Max 10MB)</p>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowSubmitModal(false);
                                        setSelectedFolder(null);
                                        reset();
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                >
                                    {processing ? 'Submitting...' : 'Submit Report'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Report Modal */}
            {showViewModal && selectedReport && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{selectedReport.title}</h2>
                                    <p className="text-sm text-gray-600 mt-1">{selectedReport.folder_name}</p>
                                </div>
                                <span className={`inline-flex items-center space-x-1 px-3 py-1 text-sm rounded-full ${getStatusColor(selectedReport.status)}`}>
                                    {getStatusIcon(selectedReport.status)}
                                    <span>{selectedReport.status}</span>
                                </span>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                                <p className="text-gray-600">{selectedReport.description}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Submission Date</h4>
                                <p className="text-gray-600">{selectedReport.created_at}</p>
                            </div>
                            {selectedReport.feedback && (
                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <h4 className="text-sm font-medium text-yellow-800 mb-2">Feedback</h4>
                                    <p className="text-yellow-700">{selectedReport.feedback}</p>
                                </div>
                            )}
                        </div>
                        <div className="p-6 border-t flex justify-end">
                            <button
                                onClick={() => setShowViewModal(false)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
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
