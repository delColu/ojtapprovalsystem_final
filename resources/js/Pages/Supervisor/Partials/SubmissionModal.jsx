import StatusBadge from './StatusBadge';

export default function SubmissionModal({ submission, onClose, children }) {
    if (!submission) return null;

    const uploadedFileName = submission.file_name || (submission.file_path ? submission.file_path.split('/').pop() : null);
    const previewTarget = (uploadedFileName || submission.file_path || '').toLowerCase();
    const isPdf = previewTarget.endsWith('.pdf');
    const isImage = ['.png', '.jpg', '.jpeg', '.gif', '.webp'].some((extension) => previewTarget.endsWith(extension));
    const isText = ['.txt', '.md', '.csv'].some((extension) => previewTarget.endsWith(extension));
    const canPreviewInline = isPdf || isImage || isText;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h3 className="text-2xl font-semibold text-gray-900">{submission.title}</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {submission.student?.name || 'Unknown student'} | {submission.folder?.name || 'No folder'}
                        </p>
                    </div>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700">
                        x
                    </button>
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                    <div className="rounded-2xl bg-gray-50 p-4">
                        <p className="text-xs uppercase tracking-wide text-gray-400">Status</p>
                        <div className="mt-2"><StatusBadge status={submission.status} /></div>
                    </div>
                    <div className="rounded-2xl bg-gray-50 p-4">
                        <p className="text-xs uppercase tracking-wide text-gray-400">Date Submitted</p>
                        <p className="mt-2 text-sm text-gray-700">
                            {submission.submitted_at || (submission.created_at ? new Date(submission.created_at).toLocaleString() : 'N/A')}
                        </p>
                    </div>
                </div>

                <div className="mt-5">
                    <p className="mb-2 text-sm font-semibold text-gray-900">Description</p>
                    <div className="rounded-2xl bg-gray-50 p-4 text-sm leading-6 text-gray-700">
                        {submission.description || 'No description provided.'}
                    </div>
                </div>

                <div className="mt-5">
                    <p className="mb-2 text-sm font-semibold text-gray-900">Feedback / Comments</p>
                    <div className="rounded-2xl bg-gray-50 p-4 text-sm leading-6 text-gray-700">
                        {submission.feedback || 'No feedback yet.'}
                    </div>
                </div>

                {submission.file_path && (
                    <div className="mt-5">
                        <p className="mb-2 text-sm font-semibold text-gray-900">Student Uploaded File</p>
                        <div className="space-y-3 rounded-2xl bg-gray-50 p-4">
                            <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
                                <p className="font-semibold text-gray-900">Attached file from the intern</p>
                                <p className="mt-1 break-all text-gray-600">{uploadedFileName}</p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <a
                                    href={route('submissions.file', submission.id)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700"
                                >
                                    Open File
                                </a>
                                <a
                                    href={route('submissions.file.download', submission.id)}
                                    className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700"
                                >
                                    Download File
                                </a>
                            </div>

                            {isImage ? (
                                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-3">
                                    <img
                                        src={route('submissions.file', submission.id)}
                                        alt="Student uploaded file preview"
                                        className="max-h-[560px] w-full rounded-xl object-contain"
                                    />
                                </div>
                            ) : canPreviewInline ? (
                                <iframe
                                    src={route('submissions.file', submission.id)}
                                    title="Student uploaded file preview"
                                    className="h-[560px] w-full rounded-2xl border border-gray-200 bg-white"
                                />
                            ) : (
                                <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500">
                                    This is still the exact uploaded file from the intern. If your browser cannot preview this file type here, use <strong>Open File</strong> to view the original attachment or <strong>Download File</strong> to save it.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {(submission.supervisor_approved_at || submission.forwarded_to_dean_at || submission.dean_reviewed_at) && (
                    <div className="mt-5 rounded-2xl bg-gray-50 p-4 text-sm text-gray-700">
                        {submission.supervisor?.name && (
                            <p>Supervisor proof: {submission.supervisor.name} {submission.supervisor_approved_at ? `on ${submission.supervisor_approved_at}` : ''}</p>
                        )}
                        {submission.forwarded_to_dean_at && (
                            <p className="mt-1">Forwarded to dean: {submission.forwarded_to_dean_at}</p>
                        )}
                        {submission.dean?.name && (
                            <p className="mt-1">Dean review: {submission.dean.name} {submission.dean_reviewed_at ? `on ${submission.dean_reviewed_at}` : ''}</p>
                        )}
                    </div>
                )}

                <div className="mt-6 flex flex-wrap justify-end gap-3">
                    {children}
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
