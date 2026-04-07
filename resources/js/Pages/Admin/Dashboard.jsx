// resources/js/Pages/Admin/Dashboard.jsx
import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { UserPlusIcon, DocumentTextIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { Bar } from 'react-chartjs-2';

export default function Dashboard({ stats, submissions, interns }) {
    const [showAddUser, setShowAddUser] = useState(false);
    const { data, setData, post, processing, reset } = useForm({
        name: '',
        email: '',
        role_id: '',
        department: '',
        company: '',
        student_id: ''
    });

    const handleAddUser = (e) => {
        e.preventDefault();
        post(route('admin.users.store'), {
            onSuccess: () => {
                reset();
                setShowAddUser(false);
            }
        });
    };

    const barData = {
        labels: ['Total Interns', 'Pending Review', 'Approved', 'Rejected'],
        datasets: [{
            label: 'Statistics',
            data: [stats.total_interns, stats.pending_review, stats.approved, stats.rejected],
            backgroundColor: ['#42A5F5', '#FFA726', '#66BB6A', '#EF5350'],
        }]
    };

    return (
        <AuthenticatedLayout>
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-sm text-gray-500">Total Interns</h3>
                            <p className="text-3xl font-bold text-blue-600">{stats.total_interns}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-sm text-gray-500">Pending Review</h3>
                            <p className="text-3xl font-bold text-yellow-600">{stats.pending_review}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-sm text-gray-500">Approved</h3>
                            <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-sm text-gray-500">Rejected</h3>
                            <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Chart */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold mb-4">Overview Statistics</h3>
                            <div className="h-80">
                                <Bar data={barData} options={{ maintainAspectRatio: false }} />
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => setShowAddUser(true)}
                                    className="w-full flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                                >
                                    <div className="flex items-center">
                                        <UserPlusIcon className="h-6 w-6 text-blue-600 mr-3" />
                                        <span className="font-medium">Add New User</span>
                                    </div>
                                    <span className="text-blue-600">→</span>
                                </button>
                                <Link
                                    href={route('admin.users.export-pdf')}
                                    className="w-full flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition"
                                >
                                    <div className="flex items-center">
                                        <DocumentTextIcon className="h-6 w-6 text-green-600 mr-3" />
                                        <span className="font-medium">Export Users to PDF</span>
                                    </div>
                                    <span className="text-green-600">→</span>
                                </Link>
                                <Link
                                    href={route('admin.reports.index')}
                                    className="w-full flex items-center justify-between p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition"
                                >
                                    <div className="flex items-center">
                                        <ChartBarIcon className="h-6 w-6 text-purple-600 mr-3" />
                                        <span className="font-medium">View All Reports</span>
                                    </div>
                                    <span className="text-purple-600">→</span>
                                </Link>
                            </div>
                        </div>

                        {/* Recent Submissions */}
                        <div className="bg-white rounded-lg shadow-sm p-6 col-span-2">
                            <h3 className="text-lg font-semibold mb-4">Recent Submissions</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Intern</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Report Title</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Folder</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supervisor</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {submissions.map((submission) => (
                                            <tr key={submission.id}>
                                                <td className="px-6 py-4">{submission.student.name}</td>
                                                <td className="px-6 py-4">{submission.title}</td>
                                                <td className="px-6 py-4">{submission.folder.name}</td>
                                                <td className="px-6 py-4">{submission.supervisor?.name || '-'}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                                        submission.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                        submission.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {submission.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">{new Date(submission.created_at).toLocaleDateString()}</td>
                                                <td className="px-6 py-4">
                                                    <Link
                                                        href={route('submissions.download-pdf', submission.id)}
                                                        className="text-blue-600 hover:text-blue-800 mr-2"
                                                    >
                                                        Download PDF
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add User Modal */}
            {showAddUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-4">Add New User</h2>
                        <form onSubmit={handleAddUser}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Role</label>
                                <select
                                    value={data.role_id}
                                    onChange={e => setData('role_id', e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2"
                                    required
                                >
                                    <option value="">Select Role</option>
                                    <option value="1">Admin</option>
                                    <option value="2">Dean</option>
                                    <option value="3">Supervisor</option>
                                    <option value="4">Student</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Department/Company</label>
                                <input
                                    type="text"
                                    value={data.department}
                                    onChange={e => setData('department', e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddUser(false)}
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    {processing ? 'Adding...' : 'Add User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
