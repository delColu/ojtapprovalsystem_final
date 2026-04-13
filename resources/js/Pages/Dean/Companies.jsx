import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    EmptyState,
    PageIntro,
    SearchField,
    StatusBadge,
} from './Partials/DeanShared';

export default function Companies({ companies, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [partneredOnly, setPartneredOnly] = useState(filters.partnered_only || false);

    const applyFilters = (nextSearch = search, nextPartnered = partneredOnly) => {
        router.get(
            route('dean.companies.index'),
            {
                search: nextSearch,
                partnered_only: nextPartnered,
            },
            { preserveState: true, replace: true }
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Companies" />

            <div className="space-y-8 bg-[#0077b6] px-4 py-6 sm:px-6 lg:px-8">
                <PageIntro
                    eyebrow="Management"
                    title="Partnered Companies"
                    description="View and monitor all companies affiliated with your institution."
                />

                {/* Filters */}
                <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
                    <SearchField
                        value={search}
                        onChange={(value) => {
                            setSearch(value);
                            applyFilters(value, partneredOnly);
                        }}
                        placeholder="Search companies..."
                    />

                    <label className="flex items-center gap-3 rounded-xl bg-white/90 px-4 py-2.5 text-sm text-gray-700 shadow-sm backdrop-blur-sm">
                        <input
                            type="checkbox"
                            checked={partneredOnly}
                            onChange={(e) => {
                                const value = e.target.checked;
                                setPartneredOnly(value);
                                applyFilters(search, value);
                            }}
                            className="rounded border-gray-300 text-[#0077b6] focus:ring-[#0077b6]"
                        />
                        Partnered Only
                    </label>
                </div>

                {/* Table / Empty State */}
                {companies.length === 0 ? (
                    <EmptyState
                        title="No companies found"
                        description="Try adjusting your filters to see more results."
                    />
                ) : (
                    <div className="overflow-x-auto rounded-2xl bg-white/95 shadow-sm backdrop-blur-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-[#0077b6]/10">
                                <tr className="text-left text-xs uppercase tracking-wide text-gray-600">
                                    <th className="px-4 py-3 font-semibold">#</th>
                                    <th className="px-4 py-3 font-semibold">Company</th>
                                    <th className="px-4 py-3 font-semibold">Address</th>
                                    <th className="px-4 py-3 font-semibold text-center">Students</th>
                                    <th className="px-4 py-3 font-semibold text-center">Status</th>
                                    <th className="px-4 py-3 font-semibold">Created</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {companies.map((company, index) => (
                                    <tr key={company.id} className="transition hover:bg-[#0077b6]/5">
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {index + 1}
                                        </td>

                                        <td className="px-4 py-3">
                                            <p className="font-semibold text-gray-900">
                                                {company.name}
                                            </p>
                                        </td>

                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {company.address || '—'}
                                        </td>

                                        <td className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                                            {company.student_count || 0}
                                        </td>

                                        <td className="px-4 py-3 text-center">
                                            <StatusBadge status={company.status} />
                                        </td>

                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {company.created_at}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Footer */}
                        <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                            Showing <span className="font-semibold">{companies.length}</span> companies
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
