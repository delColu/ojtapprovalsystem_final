export default function StatusBadge({ status }) {
    const styles = {
        pending: 'bg-yellow-100 text-yellow-800',
        approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
        forwarded: 'bg-blue-100 text-blue-800',
    };

    return (
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
            {status}
        </span>
    );
}
