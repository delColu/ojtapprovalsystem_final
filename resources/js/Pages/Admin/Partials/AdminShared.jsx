import { Link } from '@inertiajs/react';

export function PageIntro({ eyebrow = 'Admin Panel', title, description, action }) {
    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-indigo-200/80 bg-gradient-to-r from-slate-900 via-indigo-900 to-violet-800 p-6 shadow-lg shadow-indigo-200/50 md:flex-row md:items-start md:justify-between">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-200">{eyebrow}</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">{title}</h1>
                {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-200">{description}</p> : null}
            </div>
            {action}
        </div>
    );
}

export function Panel({ title, description, children, action, className = '' }) {
    return (
        <section className={`overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-md shadow-slate-200/50 ring-1 ring-white/60 ${className}`}>
            {(title || action) ? (
                <div className="border-b border-indigo-100 bg-gradient-to-r from-slate-50 via-indigo-50 to-violet-50 px-4 py-3">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                            {title ? <h2 className="text-base font-semibold text-slate-900">{title}</h2> : null}
                            {description ? <p className="mt-0.5 text-xs text-slate-500">{description}</p> : null}
                        </div>
                        {action}
                    </div>
                </div>
            ) : null}
            <div className="p-3">{children}</div>
        </section>
    );
}

export function StatCard({ label, value, tone = 'blue', caption }) {
    const tones = {
        blue: 'border-indigo-200 bg-indigo-50 text-indigo-700',
        amber: 'border-amber-200 bg-amber-50 text-amber-700',
        green: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        red: 'border-rose-200 bg-rose-50 text-rose-700',
    };

    return (
        <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-indigo-50/40 p-5 shadow-sm ring-1 ring-slate-100">
            <div className={`inline-flex rounded-xl border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${tones[tone] || tones.blue}`}>
                {label}
            </div>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
            {caption ? <p className="mt-1 text-xs text-slate-500">{caption}</p> : null}
        </div>
    );
}

export function StatusBadge({ status }) {
    const normalized = String(status || '').toLowerCase();

    const styles = {
        approved: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200',
        rejected: 'bg-rose-100 text-rose-700 ring-1 ring-rose-200',
        pending: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200',
        forwarded: 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200',
        active: 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200',
        inactive: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
    };

    return (
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[normalized] || 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'}`}>
            {status}
        </span>
    );
}

export function SearchField({ value, onChange, placeholder }) {
    return (
        <div className="relative min-w-[220px] flex-1">
            <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m1.6-5.65a7.25 7.25 0 11-14.5 0 7.25 7.25 0 0114.5 0z" />
            </svg>
            <input
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
        </div>
    );
}

export function SelectField({ value, onChange, options, placeholder = 'Select option' }) {
    return (
        <select
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="min-w-[160px] rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
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
            className={`rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-300/40 transition hover:from-indigo-700 hover:to-violet-700 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
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
            className={`rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 ${className}`}
        >
            {children}
        </button>
    );
}

export function ActionLink({ href, children }) {
    return (
        <Link href={href} className="text-sm font-medium text-indigo-700 transition hover:text-violet-700">
            {children}
        </Link>
    );
}

export function CrudModal({ open, title, children, onClose, width = 'max-w-2xl' }) {
    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm">
            <div className={`w-full ${width} rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20`}>
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                    <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                    <button onClick={onClose} className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
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
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/95 px-6 py-10 text-center backdrop-blur-sm">
            <div className="rounded-full bg-indigo-50 p-3">
                <svg className="h-6 w-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12h6m-3-3v6m9 0a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h4l2-2h2l2 2h4a2 2 0 012 2v10z" />
                </svg>
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-900">{title}</p>
            <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>
    );
}
