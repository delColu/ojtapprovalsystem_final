// resources/js/Pages/Supervisor/Dashboard.jsx
import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FolderPlusIcon, EyeIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function Dashboard({ stats, interns, approvalRate, pendingSubmissions }) {
    const [showCreateFolder, setShowCreateFolder] = useState(false);
    const { data, setData, post, processing, reset } = useForm({
        name: '',
        description: '',
        due_date: ''
    });

    const handleCreateFolder = (e) => {
        e.preventDefault();
        post(route('folders.store'), {
            onSuccess: () => {
                reset();
                setShowCreateFolder(false);
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Supervisor Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-sm text-gray-500">Total Submissions</h3>
                            <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-sm text-gray-500">Pending Review</h3>
                            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-sm text-gray-500">Approved</h3>
                            <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-sm text-gray-500">Rejected</h3>
                            <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-sm text-gray-500">Interns</h3>
                            <p className="text-3xl font-bold text-purple-600">{interns}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Create Folder Section */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Create Submission Folder</h3>
                                <button
                                    onClick={() => setShowCreateFolder(true)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                                >
                                    <FolderPlusIcon className="h-5 w-5 mr-2" />
                                    Create Folder
                                </button>
                            </div>

                            <div className="mt-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-medium mb-2">Approval Rate</h4>
                                    <div className="w-full bg-gray-200 rounded-full h-4">
                                        <div
                                            className="bg-green-600 h-4 rounded-full"
                                            style={{ width: `${approvalRate}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2">{approvalRate.toFixed(1)}% Approval Rate</p>
                                </div>
                            </div>
                        </div>

                        {/* Pending Submissions */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold mb-4">Pending Submissions</h3>
                            <div className="space-y-4">
                                {pendingSubmissions.map((submission) => (
                                    <div key={submission.id} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-semibold">{submission.title}</h4>
                                                <p className="text-sm text-gray-600">Student: {submission.student.name}</p>
                                                <p className="text-sm text-gray-500 mt-1">{submission.description.substring(0, 100)}...</p>
                                            </div>
                                            <Link
                                                href={route('submissions.show', submission.id)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <EyeIcon className="h-5 w-5" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Folder Modal */}
            {showCreateFolder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-4">Create New Folder</h2>
                        <form onSubmit={handleCreateFolder}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Folder Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Description</label>
                                <textarea
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2"
                                    rows="3"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Due Date</label>
                                <input
                                    type="date"
                                    value={data.due_date}
                                    onChange={e => setData('due_date', e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateFolder(false)}
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    {processing ? 'Creating...' : 'Create Folder'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
