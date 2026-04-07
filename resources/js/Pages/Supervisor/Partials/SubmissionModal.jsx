import StatusBadge from './StatusBadge';

export default function SubmissionModal({ submission, onClose, children }) {
    if (!submission) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
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
