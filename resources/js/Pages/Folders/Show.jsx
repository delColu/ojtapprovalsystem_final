import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FolderIcon, ArrowLeftIcon, DocumentIcon } from '@heroicons/react/24/outline';

export default function Show({ folder, submissions, canEdit }) {
    return (
        <AuthenticatedLayout>
            <Head title={`${folder.name} | CAST OJT System`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center gap-4">
                        <Link href="/folders" className="text-gray-500 hover:text-gray-700">
                            <ArrowLeftIcon className="h-5 w-5" />
                        </Link>
                        <div className="flex items-center gap-2">
                            <FolderIcon className="h-8 w-8 text-blue-500" />
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{folder.name}</h2>
                                {folder.description && (
                                    <p className="text-sm text-gray-500 mt-1">{folder.description}</p>
                                )}
                            </div>
                        </div>
                        {canEdit && (
                            <Link
                                href={`/folders/${folder.id}/edit`}
                                className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Edit Folder
                            </Link>
                        )}
                    </div>

                    {/* Submissions List */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="font-semibold text-gray-900">Submissions</h3>
                        </div>

                        {submissions.length === 0 ? (
                            <div className="p-12 text-center">
                                <DocumentIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No submissions yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {submissions.map((submission) => (
                                    <div key={submission.id} className="p-4 hover:bg-gray-50">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium text-gray-900">{submission.title}</p>
                                                <p className="text-sm text-gray-500">by {submission.user?.name}</p>
                                            </div>
                                            <Link
                                                href={`/submissions/${submission.id}`}
                                                className="text-blue-600 hover:text-blue-700 text-sm"
                                            >
                                                View →
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
