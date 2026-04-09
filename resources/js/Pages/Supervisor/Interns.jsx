import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';

function ProgressBadge({ rate }) {
    if (rate >= 80) {
        return <span className="rounded-full border border-emerald-500/30 bg-emerald-500/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">Excellent</span>;
    }

    if (rate >= 60) {
        return <span className="rounded-full border border-blue-500/30 bg-blue-500/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-300">Good</span>;
    }

    if (rate >= 40) {
        return <span className="rounded-full border border-amber-500/30 bg-amber-500/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">Average</span>;
    }

    if (rate > 0) {
        return <span className="rounded-full border border-orange-500/30 bg-orange-500/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-300">Attention</span>;
    }

    return <span className="rounded-full border border-slate-600 bg-slate-700 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">No Activity</span>;
}

function SearchField({ value, onChange }) {
    return (
        <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-4.35-4.35m1.35-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input
                type="text"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder="Search intern..."
                className="w-full rounded-lg border-2 border-slate-600 bg-slate-800/80 py-2.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            />
        </div>
    );
}

function SelectField({ value, onChange, options }) {
    return (
        <div className="relative flex-1">
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="w-full appearance-none rounded-lg border-2 border-slate-600 bg-slate-800/80 px-4 py-2.5 pr-10 text-sm text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    );
}

function StatCard({ label, value, accent, trend }) {
    return (
        <div className="rounded-lg border border-slate-500/80 bg-gradient-to-b from-slate-800/95 to-slate-900/95 p-3 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.9)] ring-1 ring-white/5">
            <div className={`h-1.5 w-8 rounded-full bg-gradient-to-r ${accent}`} />
            <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
            <div className="mt-1 flex items-baseline gap-2">
                <p className="text-xl font-semibold tracking-tight text-white">{value}</p>
                {trend && (
                    <span className="text-[10px] font-medium text-emerald-400">{trend}</span>
                )}
            </div>
        </div>
    );
}

const Icons = {
    ArrowRight: ({ className = 'h-4 w-4' }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5l7 7-7 7" />
        </svg>
    ),
    Download: ({ className = 'h-4 w-4' }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
    ),
    Mail: ({ className = 'h-4 w-4' }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    ),
    Building: ({ className = 'h-4 w-4' }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
    ),
    Department: ({ className = 'h-4 w-4' }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    ),
    Close: ({ className = 'h-5 w-5' }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    ),
};

export default function Interns({ interns = [], approvalRate = 0, statistics = {} }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [filterDepartment, setFilterDepartment] = useState('all');
    const [selectedIntern, setSelectedIntern] = useState(null);

    const departments = useMemo(() => {
        const items = new Set(interns.map((intern) => intern.department).filter(Boolean));
        return [{ value: 'all', label: 'All Departments' }, ...Array.from(items).map((item) => ({ value: item, label: item }))];
    }, [interns]);

    const filteredInterns = useMemo(() => {
        let filtered = [...interns];

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (intern) =>
                    intern.name?.toLowerCase().includes(term) ||
                    intern.email?.toLowerCase().includes(term) ||
                    intern.student_id?.toLowerCase().includes(term) ||
                    intern.department?.toLowerCase().includes(term) ||
                    intern.company?.toLowerCase().includes(term),
            );
        }

        if (filterDepartment !== 'all') {
            filtered = filtered.filter((intern) => intern.department === filterDepartment);
        }

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
            }

            return aVal < bVal ? 1 : -1;
        });

        return filtered;
    }, [filterDepartment, interns, searchTerm, sortBy, sortOrder]);

    const activeInterns = interns.filter((intern) => (intern.submissions_count || 0) > 0).length;
    const totalSubmissions = interns.reduce((sum, intern) => sum + (intern.submissions_count || 0), 0);

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
            <svg className="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {sortOrder === 'asc' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                )}
            </svg>
        );
    };

    return (
        <>
            <AuthenticatedLayout>
                <Head title="Supervisor Interns" />

                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-6 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl space-y-6">
                        {/* Header Section */}
                        <div className="border-b-2 border-slate-700 pb-5">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                                <div className="space-y-2">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-400">
                                        Supervisor Directory
                                    </p>
                                    <div className="space-y-1">
                                        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                                            Interns
                                        </h1>
                                        <p className="max-w-xl text-sm text-slate-400">
                                            Manage and monitor all your supervised interns in one place.
                                        </p>
                                    </div>
                                </div>

                                {/* Stats Row */}
                                <div className="grid grid-cols-3 gap-2">
                                    <StatCard
                                        label="Total Interns"
                                        value={interns.length}
                                        accent="from-slate-500 to-slate-600"
                                    />
                                    <StatCard
                                        label="Active Interns"
                                        value={activeInterns}
                                        accent="from-blue-600 to-cyan-500"
                                        trend={`${activeInterns > 0 ? 'Active' : 'Inactive'}`}
                                    />
                                    <StatCard
                                        label="Approval Rate"
                                        value={`${approvalRate}%`}
                                        accent="from-emerald-500 to-teal-400"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Horizontal Filters Bar */}
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                                <SearchField value={searchTerm} onChange={setSearchTerm} />
                                <SelectField
                                    value={filterDepartment}
                                    onChange={setFilterDepartment}
                                    options={departments}
                                />
                            </div>
                            <a
                                href={route('supervisor.interns.export-pdf')}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-700 whitespace-nowrap"
                            >
                                <Icons.Download />
                                Export List
                            </a>
                        </div>

                        {/* Interns List */}
                        <section className="space-y-3">
                            {/* Table Header */}
                            <div className="grid gap-2 rounded-lg border border-slate-500/80 bg-gradient-to-b from-slate-800/95 to-slate-900/95 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.9)] ring-1 ring-white/5 md:grid-cols-[1.4fr_1.1fr_0.9fr_1fr_0.7fr_0.8fr]">
                                <button type="button" onClick={() => handleSort('name')} className="flex items-center text-left hover:text-cyan-400 transition">
                                    Intern <SortIcon field="name" />
                                </button>
                                <div>Contact</div>
                                <button type="button" onClick={() => handleSort('department')} className="flex items-center text-left hover:text-cyan-400 transition">
                                    Department <SortIcon field="department" />
                                </button>
                                <button type="button" onClick={() => handleSort('company')} className="flex items-center text-left hover:text-cyan-400 transition">
                                    Company <SortIcon field="company" />
                                </button>
                                <button type="button" onClick={() => handleSort('submissions_count')} className="flex items-center justify-start md:justify-center hover:text-cyan-400 transition">
                                    Reports <SortIcon field="submissions_count" />
                                </button>
                                <div className="md:text-center">Progress</div>
                            </div>

                            {/* Intern Cards */}
                            {filteredInterns.length === 0 ? (
                                <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-500/80 bg-slate-800/60 px-6 text-center shadow-[0_18px_40px_-28px_rgba(15,23,42,0.9)] ring-1 ring-white/5">
                                    <div className="rounded-lg border border-slate-500/80 bg-slate-700/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-300 shadow-sm">
                                        No Results
                                    </div>
                                    <p className="mt-3 text-sm font-medium text-slate-400">No interns found matching your criteria.</p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchTerm('');
                                            setFilterDepartment('all');
                                        }}
                                        className="mt-3 text-sm text-cyan-400 underline hover:text-cyan-300"
                                    >
                                        Clear filters
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {filteredInterns.map((intern, index) => {
                                        const submissionRate = statistics.total_submissions > 0
                                            ? Math.round(((intern.submissions_count || 0) / statistics.total_submissions) * 100)
                                            : 0;

                                        return (
                                            <button
                                                key={intern.id}
                                                type="button"
                                                onClick={() => setSelectedIntern(intern)}
                                                className="w-full rounded-lg border border-slate-500/80 bg-gradient-to-b from-slate-800/88 to-slate-900/82 px-4 py-3 text-left shadow-[0_18px_40px_-28px_rgba(15,23,42,0.9)] ring-1 ring-white/5 transition-all duration-300 hover:border-cyan-500/45 hover:shadow-[0_22px_44px_-26px_rgba(6,182,212,0.2)]"
                                            >
                                                <div className="grid gap-3 md:grid-cols-[1.4fr_1.1fr_0.9fr_1fr_0.7fr_0.8fr] md:items-center">
                                                    {/* Intern Info */}
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-cyan-500/20 bg-gradient-to-br from-cyan-500/18 to-indigo-500/18 text-sm font-semibold text-cyan-300 shadow-inner shadow-cyan-950/20">
                                                            {intern.name?.charAt(0).toUpperCase() || '?'}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <p className="truncate text-sm font-semibold tracking-tight text-white">
                                                                    {intern.name || 'Unnamed'}
                                                                </p>
                                                                <span className="hidden sm:inline-flex rounded-full border border-slate-500/80 bg-slate-700/85 px-2 py-0.5 text-[9px] font-semibold text-slate-300 shadow-sm">
                                                                    #{String(index + 1).padStart(2, '0')}
                                                                </span>
                                                            </div>
                                                            <p className="mt-0.5 text-[11px] text-slate-400">
                                                                ID: {intern.student_id || 'N/A'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Email */}
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-1.5 text-xs text-slate-300">
                                                            <Icons.Mail className="h-3 w-3 flex-shrink-0 text-slate-400" />
                                                            <span className="truncate text-xs">{intern.email || 'No email'}</span>
                                                        </div>
                                                    </div>

                                                    {/* Department */}
                                                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                                                        <Icons.Department className="h-3 w-3 flex-shrink-0 text-slate-400" />
                                                        <span className="text-xs">{intern.department || '—'}</span>
                                                    </div>

                                                    {/* Company */}
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-1.5 text-xs text-slate-300">
                                                            <Icons.Building className="h-3 w-3 flex-shrink-0 text-slate-400" />
                                                            <span className="truncate text-xs">{intern.company || '—'}</span>
                                                        </div>
                                                    </div>

                                                    {/* Reports Count */}
                                                    <div className="flex items-center justify-start md:justify-center">
                                                        <span className="inline-flex h-7 min-w-[42px] items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-600 px-2.5 text-xs font-semibold text-white shadow-[0_10px_24px_-14px_rgba(6,182,212,0.8)]">
                                                            {intern.submissions_count || 0}
                                                        </span>
                                                    </div>

                                                    {/* Progress Badge */}
                                                    <div className="flex items-center justify-between gap-2 md:justify-center">
                                                        <ProgressBadge rate={submissionRate} />
                                                        <span className="inline-flex items-center text-[11px] font-medium text-slate-400 md:hidden">
                                                            View
                                                            <Icons.ArrowRight className="ml-1 h-3 w-3" />
                                                        </span>
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Summary Footer */}
                            {filteredInterns.length > 0 && (
                                <div className="flex items-center justify-between rounded-lg border border-slate-500/80 bg-gradient-to-b from-slate-800/95 to-slate-900/95 px-4 py-2.5 text-xs text-slate-400 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.9)] ring-1 ring-white/5">
                                    <span>Showing {filteredInterns.length} of {interns.length} interns</span>
                                    <span className="text-[11px]">Total reports: {totalSubmissions}</span>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </AuthenticatedLayout>

            {/* Intern Details Modal */}
            {selectedIntern && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm"
                    onClick={() => setSelectedIntern(null)}
                >
                    <div
                        className="relative w-full max-w-lg overflow-hidden rounded-xl border border-slate-500/80 bg-gradient-to-b from-slate-800 to-slate-900 shadow-2xl ring-1 ring-white/5"
                        onClick={(event) => event.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-slate-600/80 bg-white/[0.02] px-5 py-4">
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-400">
                                    Intern Profile
                                </p>
                                <h3 className="mt-1 text-xl font-semibold tracking-tight text-white">
                                    {selectedIntern.name}
                                </h3>
                            </div>
                            <button
                                onClick={() => setSelectedIntern(null)}
                                className="rounded-full p-1 text-slate-400 transition hover:bg-slate-700 hover:text-slate-300"
                            >
                                <Icons.Close />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="grid gap-4 p-5 md:grid-cols-2">
                            <div className="space-y-3 rounded-lg border border-slate-500/80 bg-slate-800/65 p-4 ring-1 ring-white/5">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                                    Contact Information
                                </p>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <p className="text-xs font-medium text-slate-400">Email Address</p>
                                        <p className="mt-0.5 text-white text-sm">{selectedIntern.email || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-slate-400">Student ID</p>
                                        <p className="mt-0.5 text-white">{selectedIntern.student_id || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-slate-400">Department</p>
                                        <p className="mt-0.5 text-white">{selectedIntern.department || 'Not specified'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-4 shadow-[0_14px_28px_-22px_rgba(6,182,212,0.45)] ring-1 ring-cyan-400/10">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                                    Internship Overview
                                </p>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <p className="text-xs font-medium text-slate-400">Company Assignment</p>
                                        <p className="mt-0.5 text-white">{selectedIntern.company || 'Not assigned'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-slate-400">Reports Submitted</p>
                                        <p className="mt-0.5 text-2xl font-semibold text-cyan-400">{selectedIntern.submissions_count || 0}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-slate-400">Status</p>
                                        <span className="mt-1 inline-block rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
                                            {selectedIntern.status || 'Active'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-end border-t border-slate-600/80 bg-white/[0.02] px-5 py-3">
                            <button
                                type="button"
                                onClick={() => setSelectedIntern(null)}
                                className="rounded-lg bg-cyan-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-cyan-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
