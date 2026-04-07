import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';

// Status badge component for intern progress
function ProgressBadge({ rate }) {
    let color = 'gray';
    let label = 'No Activity';

    if (rate >= 80) {
        color = 'green';
        label = 'Excellent';
    } else if (rate >= 60) {
        color = 'blue';
        label = 'Good';
    } else if (rate >= 40) {
        color = 'yellow';
        label = 'Average';
    } else if (rate > 0) {
        color = 'orange';
        label = 'Needs Attention';
    }

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-${color}-100 text-${color}-800`}>
            {label}
        </span>
    );
}

// Search input component
function SearchInput({ value, onChange, placeholder }) {
    return (
        <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="block w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm placeholder-gray-400 focus:border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-300"
                placeholder={placeholder}
            />
        </div>
    );
}

// Filter dropdown component
function FilterDropdown({ options, value, onChange, label }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
                {label}
                <svg className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                <div className="absolute right-0 z-10 mt-1 w-48 rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                                value === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// Stat Card component
function StatCard({ title, value, icon: Icon, trend, trendLabel, color = 'blue' }) {
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">{value?.toLocaleString() ?? 0}</p>
                    {trend !== undefined && (
                        <div className="mt-2 flex items-center gap-1">
                            <span className={`text-xs font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {trend >= 0 ? `↑ ${trend}%` : `↓ ${Math.abs(trend)}%`}
                            </span>
                            {trendLabel && <span className="text-xs text-gray-400">{trendLabel}</span>}
                        </div>
                    )}
                </div>
                {Icon && (
                    <div className={`rounded-xl bg-${color}-50 p-2.5 text-${color}-500 transition-colors group-hover:bg-${color}-100`}>
                        <Icon />
                    </div>
                )}
            </div>
        </div>
    );
}

// Icons
const Icons = {
    Users: () => (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    ),
    Chart: () => (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    ),
    Check: () => (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    Mail: () => (
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    ),
    Building: () => (
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
    ),
    ChevronRight: () => (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
    ),
    Download: () => (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
    ),
};

export default function Interns({ interns = [], approvalRate = 0, statistics = {} }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [filterDepartment, setFilterDepartment] = useState('all');

    // Extract unique departments for filter
    const departments = useMemo(() => {
        const depts = new Set(interns.map(i => i.department).filter(Boolean));
        return [{ value: 'all', label: 'All Departments' }, ...Array.from(depts).map(d => ({ value: d, label: d }))];
    }, [interns]);

    // Filter and sort interns
    const filteredInterns = useMemo(() => {
        let filtered = [...interns];

        // Apply search
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(intern =>
                intern.name?.toLowerCase().includes(term) ||
                intern.email?.toLowerCase().includes(term) ||
                intern.student_id?.toLowerCase().includes(term) ||
                intern.department?.toLowerCase().includes(term) ||
                intern.company?.toLowerCase().includes(term)
            );
        }

        // Apply department filter
        if (filterDepartment !== 'all') {
            filtered = filtered.filter(intern => intern.department === filterDepartment);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let aVal = a[sortBy] || '';
            let bVal = b[sortBy] || '';

            if (sortBy === 'submissions_count') {
                aVal = a.submissions_count || 0;
                bVal = b.submissions_count || 0;
            }

            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (sortOrder === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

        return filtered;
    }, [interns, searchTerm, sortBy, sortOrder, filterDepartment]);

    // Calculate derived statistics
    const activeInterns = interns.filter(i => (i.submissions_count || 0) > 0).length;
    const totalSubmissions = interns.reduce((sum, i) => sum + (i.submissions_count || 0), 0);
    const avgSubmissionsPerIntern = interns.length > 0 ? (totalSubmissions / interns.length).toFixed(1) : 0;

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const SortIcon = ({ field }) => {
        if (sortBy !== field) return null;
        return (
            <svg className="ml-1 h-3 w-3 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {sortOrder === 'asc' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                )}
            </svg>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Supervisor Interns" />

            <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div>
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Management</p>
                        <span className="h-1 w-1 rounded-full bg-gray-300" />
                        <p className="text-xs text-gray-400">Supervised Interns</p>
                    </div>
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">Interns</h1>
                    <p className="mt-2 max-w-3xl text-sm text-gray-500">
                        Manage and monitor all interns under your supervision. Department refers to CAST, while company refers to the student's assigned company.
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard title="Total Interns" value={interns.length} icon={Icons.Users} color="blue" />
                    <StatCard title="Active Interns" value={activeInterns} trend={interns.length > 0 ? Math.round((activeInterns / interns.length) * 100) : 0} trendLabel="active rate" icon={Icons.Chart} color="green" />
                    <StatCard title="Approval Rate" value={approvalRate} icon={Icons.Check} color="purple" />
                    <StatCard title="Avg. Submissions" value={avgSubmissionsPerIntern} icon={Icons.Users} color="orange" />
                </div>

                {/* Intern List Section */}
                <section className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    {/* Header with actions */}
                    <div className="border-b border-gray-100 bg-gray-50/50 px-5 py-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Intern List</h2>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {filteredInterns.length} of {interns.length} intern{interns.length !== 1 ? 's' : ''} shown
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                <SearchInput
                                    value={searchTerm}
                                    onChange={setSearchTerm}
                                    placeholder="Search by name, email, ID, department, or company..."
                                />
                                <FilterDropdown
                                    options={departments}
                                    value={filterDepartment}
                                    onChange={setFilterDepartment}
                                    label="Department (CAST)"
                                />
                                <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    <Icons.Download />
                                    Export
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Interns Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        onClick={() => handleSort('name')}
                                        className="cursor-pointer px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-gray-700"
                                    >
                                        <div className="flex items-center">
                                            Intern <SortIcon field="name" />
                                        </div>
                                    </th>
                                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Contact
                                    </th>
                                    <th
                                        onClick={() => handleSort('department')}
                                        className="cursor-pointer px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-gray-700"
                                    >
                                        <div className="flex items-center">
                                            Department <SortIcon field="department" />
                                        </div>
                                    </th>
                                    <th
                                        onClick={() => handleSort('company')}
                                        className="cursor-pointer px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-gray-700"
                                    >
                                        <div className="flex items-center">
                                            Company Name <SortIcon field="company" />
                                        </div>
                                    </th>
                                    <th
                                        onClick={() => handleSort('submissions_count')}
                                        className="cursor-pointer px-5 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-gray-700"
                                    >
                                        <div className="flex items-center justify-center">
                                            Reports <SortIcon field="submissions_count" />
                                        </div>
                                    </th>
                                    <th className="px-5 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Progress
                                    </th>
                                    <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {filteredInterns.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-5 py-12 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="rounded-full bg-gray-100 p-3">
                                                    <Icons.Users />
                                                </div>
                                                <p className="mt-3 text-sm text-gray-500">No interns found</p>
                                                {searchTerm && (
                                                    <button
                                                        onClick={() => setSearchTerm('')}
                                                        className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                                                    >
                                                        Clear search
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredInterns.map((intern) => {
                                        const submissionRate = statistics.total_submissions > 0
                                            ? Math.round(((intern.submissions_count || 0) / statistics.total_submissions) * 100)
                                            : 0;

                                        return (
                                            <tr key={intern.id} className="group hover:bg-gray-50/50 transition-colors">
                                                <td className="whitespace-nowrap px-5 py-4">
                                                    <div className="flex items-center">
                                                        <div className="h-9 w-9 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-semibold">
                                                            {intern.name?.charAt(0).toUpperCase() || '?'}
                                                        </div>
                                                        <div className="ml-3">
                                                            <p className="text-sm font-medium text-gray-900">{intern.name || 'Unnamed'}</p>
                                                            <p className="text-xs text-gray-500">ID: {intern.student_id || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4">
                                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                                        <Icons.Mail />
                                                        <span className="truncate max-w-[180px]">{intern.email || 'No email'}</span>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                                                    {intern.department || '—'}
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4">
                                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                                        <Icons.Building />
                                                        <span className="truncate max-w-[150px]">{intern.company || '—'}</span>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 text-center">
                                                    <span className="inline-flex items-center justify-center rounded-full bg-blue-100 px-2.5 py-0.5 text-sm font-semibold text-blue-800">
                                                        {intern.submissions_count || 0}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4">
                                                    <div className="flex justify-center">
                                                        <ProgressBadge rate={submissionRate} />
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 text-right">
                                                    <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-400 opacity-0 transition-opacity group-hover:opacity-100">
                                                        View Details
                                                        <Icons.ChevronRight />
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer with pagination info */}
                    {filteredInterns.length > 0 && filteredInterns.length < interns.length && (
                        <div className="border-t border-gray-100 bg-gray-50/30 px-5 py-3 text-center">
                            <p className="text-xs text-gray-500">
                                Showing {filteredInterns.length} of {interns.length} interns
                                {searchTerm && ` matching "${searchTerm}"`}
                                {filterDepartment !== 'all' && ` in ${filterDepartment}`}
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
