import { Link } from '@inertiajs/react';

export function PageIntro({ eyebrow = 'Dean Panel', title, description, action }) {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">{eyebrow}</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">{title}</h1>
                {description ? <p className="mt-2 max-w-3xl text-sm text-gray-500">{description}</p> : null}
            </div>
            {action}
        </div>
    );
}

export function Panel({ title, description, children, action, className = '' }) {
    return (
        <section className={`overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm ${className}`}>
            {(title || action) ? (
                <div className="border-b border-gray-100 bg-gray-50/70 px-5 py-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            {title ? <h2 className="text-lg font-semibold text-gray-900">{title}</h2> : null}
                            {description ? <p className="mt-1 text-xs text-gray-500">{description}</p> : null}
                        </div>
                        {action}
                    </div>
                </div>
            ) : null}
            <div className="p-5">{children}</div>
        </section>
    );
}

export function StatCard({ label, value, tone = 'blue', caption }) {
    const tones = {
        blue: 'text-blue-600 bg-blue-50',
        amber: 'text-amber-600 bg-amber-50',
        green: 'text-green-600 bg-green-50',
        red: 'text-red-600 bg-red-50',
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className={`inline-flex rounded-xl px-3 py-1 text-xs font-semibold uppercase tracking-wide ${tones[tone] || tones.blue}`}>
                {label}
            </div>
            <p className="mt-4 text-4xl font-semibold tracking-tight text-gray-900">{value}</p>
            {caption ? <p className="mt-2 text-sm text-gray-500">{caption}</p> : null}
        </div>
    );
}

export function StatusBadge({ status }) {
    const normalized = String(status || '').toLowerCase();

    const styles = {
        approved: 'bg-green-100 text-green-700',
        rejected: 'bg-red-100 text-red-700',
        pending: 'bg-amber-100 text-amber-700',
        forwarded: 'bg-blue-100 text-blue-700',
        active: 'bg-blue-100 text-blue-700',
        inactive: 'bg-gray-100 text-gray-700',
    };

    return (
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[normalized] || 'bg-gray-100 text-gray-700'}`}>
            {status}
        </span>
    );
}

export function SearchField({ value, onChange, placeholder }) {
    return (
        <div className="relative flex-1 min-w-[220px]">
            <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m1.6-5.65a7.25 7.25 0 11-14.5 0 7.25 7.25 0 0114.5 0z" />
            </svg>
            <input
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            />
        </div>
    );
}

export function SelectField({ value, onChange, options, placeholder = 'Select option' }) {
    return (
        <select
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="min-w-[160px] rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
        >
            <option value="">{placeholder}</option>
            {options.map((option) => (
                <option key={option.id ?? option.value} value={option.id ?? option.value}>
                    {option.name ?? option.label}
                </option>
            ))}
        </select>
    );
}

export function PrimaryAction({ children, onClick, type = 'button', className = '', disabled = false }) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
        >
            {children}
        </button>
    );
}

export function SecondaryAction({ children, onClick, type = 'button', className = '' }) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 ${className}`}
        >
            {children}
        </button>
    );
}

export function ActionLink({ href, children }) {
    return (
        <Link href={href} className="text-sm font-medium text-blue-600 transition hover:text-blue-700">
            {children}
        </Link>
    );
}

export function CrudModal({ open, title, children, onClose, width = 'max-w-2xl' }) {
    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-6">
            <div className={`w-full ${width} rounded-3xl bg-white shadow-2xl`}>
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <button onClick={onClose} className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="px-6 py-5">{children}</div>
            </div>
        </div>
    );
}

export function EmptyState({ title, description }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 px-6 py-14 text-center">
            <div className="rounded-full bg-gray-100 p-3">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12h6m-3-3v6m9 0a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h4l2-2h2l2 2h4a2 2 0 012 2v10z" />
                </svg>
            </div>
            <p className="mt-4 text-sm font-semibold text-gray-900">{title}</p>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
    );
}
