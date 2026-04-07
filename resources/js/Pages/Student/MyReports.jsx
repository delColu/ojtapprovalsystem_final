import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    DocumentIcon,
    EyeIcon,
    ArrowDownTrayIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

export default function MyReports({ reports, stats }) {
    const [selectedReport, setSelectedReport] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        <CheckCircleIcon className="h-3 w-3 mr-1" /> Approved
                    </span>
                );
            case 'rejected':
                return (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                        <XCircleIcon className="h-3 w-3 mr-1" /> Rejected
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                        <ClockIcon className="h-3 w-3 mr-1" /> Pending
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                        {status}
                    </span>
                );
        }
    };

    const viewReport = (report) => {
        setSelectedReport(report);
        setShowModal(true);
    };

    const filteredReports = reports.filter((report) => {
        const matchesSearch =
            searchTerm === '' ||
            report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.folder_name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || report.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <AuthenticatedLayout>
            <Head title="My Reports | CAST OJT System" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Search and Filter Section - at the top */}
                    <div className="mb-6">
                        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                            {/* Left side - Search Bar */}
                            <div className="relative flex-1 max-w-md">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search reports by title, description, or folder..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none bg-white"
                                />
                            </div>

                            {/* Right side - Status Filter with proper alignment */}
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-600 font-medium whitespace-nowrap">Filter by status:</span>
                                <div className="relative">
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="appearance-none px-4 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                    {/* Custom dropdown icon */}
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Active filters summary */}
                        {(searchTerm || statusFilter !== 'all') && (
                            <div className="mt-3 flex items-center justify-between">
                                <div className="text-xs text-gray-500">
                                    {filteredReports.length} report(s) found
                                </div>
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setStatusFilter('all');
                                    }}
                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Header Section - MOVED BELOW search bar */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">My Submitted Reports</h2>
                        <p className="text-sm text-gray-500 mt-1">Track and manage your weekly reports</p>
                    </div>

                    {/* Reports Cards Section */}
                    {reports.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                            <DocumentIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No reports submitted yet</p>
                            <Link href="/submit-reports" className="text-blue-600 hover:text-blue-700 mt-4 inline-block font-medium">
                                Submit your first report →
                            </Link>
                        </div>
                    ) : filteredReports.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                            <DocumentIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No reports match your search</p>
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setStatusFilter('all');
                                }}
                                className="text-blue-600 hover:text-blue-700 mt-4 font-medium"
                            >
                                Clear filters →
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredReports.map((report) => (
                                <div
                                    key={report.id}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col"
                                >
                                    {/* Card Header */}
                                    <div className="p-5 border-b border-gray-100">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                                                    {report.title}
                                                </h3>
                                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                                    <DocumentIcon className="h-3 w-3" />
                                                    {report.folder_name}
                                                </p>
                                            </div>
                                            <div className="ml-3">
                                                {getStatusBadge(report.status)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-5 flex-1">
                                        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                                            {report.description}
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <ClockIcon className="h-3.5 w-3.5" />
                                                <span>Submitted: {report.submitted_at}</span>
                                            </div>
                                        </div>
                                        {report.feedback && (
                                            <div className="mt-3 pt-3 border-t border-gray-100">
                                                <p className="text-xs text-gray-500 font-medium mb-1">Feedback:</p>
                                                <p className="text-xs text-gray-600 line-clamp-2">
                                                    {report.feedback}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Card Footer - Actions */}
                                    <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                                        <button
                                            onClick={() => viewReport(report)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
                                        >
                                            <EyeIcon className="h-4 w-4" />
                                            View Details
                                        </button>
                                        {report.file_path && (
                                            <a
                                                href={`/storage/${report.file_path}`}
                                                download
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                                            >
                                                <ArrowDownTrayIcon className="h-4 w-4" />
                                                Download
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && selectedReport && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-900">Report Details</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Title</h3>
                                <p className="mt-1 text-gray-900">{selectedReport.title}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Folder</h3>
                                <p className="mt-1 text-gray-700">{selectedReport.folder_name}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Description</h3>
                                <p className="mt-1 text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">{selectedReport.description}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Status</h3>
                                <div className="mt-2">{getStatusBadge(selectedReport.status)}</div>
                            </div>

                            {selectedReport.feedback && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Feedback</h3>
                                    <p className="mt-1 text-gray-700 bg-yellow-50 p-3 rounded-lg">{selectedReport.feedback}</p>
                                </div>
                            )}

                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Submitted Date</h3>
                                <p className="mt-1 text-gray-700">{selectedReport.submitted_at}</p>
                            </div>

                            {selectedReport.file_path && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Attached File</h3>
                                    <a
                                        href={`/storage/${selectedReport.file_path}`}
                                        download
                                        className="mt-1 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        <ArrowDownTrayIcon className="h-4 w-4" />
                                        Download File
                                    </a>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t bg-gray-50 flex justify-end">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
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
