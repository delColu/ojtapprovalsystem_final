import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    BuildingOffice2Icon,
    EnvelopeIcon,
    IdentificationIcon,
    LockClosedIcon,
    MapPinIcon,
    UserIcon,
    ArrowRightOnRectangleIcon,
    MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

export default function Register({ companies = [] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        student_id: '',
        department: '',
        company: '',
        password: '',
        password_confirmation: '',
    });

    const activeCompany = companies.find((c) => c.company === data.company);

    const filledFields = [
        data.name,
        data.email,
        data.department,
        data.password,
        data.password_confirmation,
    ].filter(Boolean).length;

    const progress = Math.min(Math.round((filledFields / 5) * 100), 100);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    // Compact input styles
    const inputBase =
        'mt-1 block w-full rounded-lg border border-rose-100 bg-rose-50/40 px-3 py-2 text-sm text-slate-900 outline-none transition-all duration-150 placeholder:text-rose-300 focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100 hover:border-rose-200 hover:bg-white';

    const iconInput = `${inputBase} pl-9`;

    return (
        <>
            <Head title="Register" />

            <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-50 via-white to-pink-50 flex items-center justify-center px-4 py-8">
                {/* Decorative background blobs - simplified */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -left-32 -top-32 h-[480px] w-[480px] rounded-full bg-rose-200/20 blur-[80px]" />
                    <div className="absolute -bottom-40 -right-20 h-[520px] w-[520px] rounded-full bg-pink-200/20 blur-[100px]" />
                </div>

                <div className="relative w-full max-w-xl">
                    {/* Main Card - Compact */}
                    <div className="overflow-hidden rounded-xl border border-rose-100 bg-white shadow-lg shadow-rose-200/30">
                        {/* Header - Compact */}
                        <div className="relative overflow-hidden bg-gradient-to-br from-rose-700 via-rose-600 to-pink-600 px-6 py-5">
                            <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full border border-white/10" />

                            {/* Badge */}
                            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-200" />
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-white/80">
                                    Student Portal
                                </span>
                            </div>

                            <h1 className="text-2xl font-bold tracking-tight text-white">
                                Create account
                            </h1>
                            <p className="mt-1 text-sm text-white/60">
                                Access company placements and student services.
                            </p>

                            {/* Progress bar - Compact */}
                            <div className="mt-4">
                                <div className="mb-1 flex items-center justify-between">
                                    <span className="text-[9px] font-semibold uppercase tracking-wider text-white/40">
                                        Completion
                                    </span>
                                    <span className="text-[9px] font-semibold text-white/60">
                                        {progress}%
                                    </span>
                                </div>
                                <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-rose-200 to-pink-100 transition-all duration-500"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Form body - Compact spacing */}
                        <form onSubmit={submit} className="px-6 py-6 space-y-5">
                            {/* Personal Info Section */}
                            <div>
                                <SectionLabel>Personal information</SectionLabel>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    {/* Name */}
                                    <div>
                                        <InputLabel htmlFor="name" value="Full name" className="text-xs font-semibold text-slate-600" />
                                        <div className="relative">
                                            <UserIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-rose-300" />
                                            <TextInput
                                                id="name"
                                                name="name"
                                                value={data.name}
                                                className={iconInput}
                                                autoComplete="name"
                                                isFocused
                                                placeholder="e.g. Maria Santos"
                                                onChange={(e) => setData('name', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <InputError message={errors.name} className="mt-1 text-xs" />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <InputLabel htmlFor="email" value="Email" className="text-xs font-semibold text-slate-600" />
                                        <div className="relative">
                                            <EnvelopeIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-rose-300" />
                                            <TextInput
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={data.email}
                                                className={iconInput}
                                                autoComplete="username"
                                                placeholder="you@school.edu"
                                                onChange={(e) => setData('email', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <InputError message={errors.email} className="mt-1 text-xs" />
                                    </div>

                                    {/* Student ID */}
                                    <div>
                                        <InputLabel htmlFor="student_id" value="Student ID" className="text-xs font-semibold text-slate-600" />
                                        <div className="relative">
                                            <IdentificationIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-rose-300" />
                                            <TextInput
                                                id="student_id"
                                                name="student_id"
                                                value={data.student_id}
                                                className={iconInput}
                                                autoComplete="off"
                                                placeholder="STU-000000"
                                                onChange={(e) => setData('student_id', e.target.value)}
                                            />
                                        </div>
                                        <InputError message={errors.student_id} className="mt-1 text-xs" />
                                    </div>

                                    {/* Department */}
                                    <div>
                                        <InputLabel htmlFor="department" value="Department" className="text-xs font-semibold text-slate-600" />
                                        <TextInput
                                            id="department"
                                            name="department"
                                            value={data.department}
                                            className={inputBase}
                                            placeholder="e.g. Computer Science"
                                            onChange={(e) => setData('department', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.department} className="mt-1 text-xs" />
                                    </div>
                                </div>
                            </div>

                            {/* Company Section - Compact */}
                            <div className="rounded-lg border border-rose-100 bg-gradient-to-br from-rose-50/40 via-white to-pink-50/30 overflow-hidden">
                                <div className="flex items-center gap-2 border-b border-rose-100 px-4 py-3">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-rose-600 to-pink-600">
                                        <BuildingOffice2Icon className="h-3.5 w-3.5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">Company placement</p>
                                        <p className="text-xs text-slate-500">Select your company</p>
                                    </div>
                                </div>

                                <div className="px-4 py-3 space-y-3">
                                    <div>
                                        <InputLabel htmlFor="company" value="Company name" className="text-xs font-semibold text-slate-600" />

                                        {companies.length > 0 ? (
                                            <div className="relative">
                                                <MagnifyingGlassIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-rose-300" />
                                                <select
                                                    id="company"
                                                    name="company"
                                                    value={data.company}
                                                    className={`${iconInput} cursor-pointer`}
                                                    onChange={(e) => setData('company', e.target.value)}
                                                    required
                                                >
                                                    <option value="">Select a company…</option>
                                                    {companies.map((c) => (
                                                        <option key={c.id} value={c.company}>
                                                            {c.company}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        ) : (
                                            <TextInput
                                                id="company"
                                                name="company"
                                                value={data.company}
                                                className={inputBase}
                                                placeholder="Enter company name"
                                                onChange={(e) => setData('company', e.target.value)}
                                            />
                                        )}

                                        <InputError message={errors.company} className="mt-1 text-xs" />
                                    </div>

                                    {/* Company preview cards - Compact */}
                                    {activeCompany && (
                                        <div className="grid gap-2 sm:grid-cols-2">
                                            <PreviewCard
                                                icon={<BuildingOffice2Icon className="h-3.5 w-3.5 text-rose-600" />}
                                                iconBg="bg-rose-100"
                                                label="Company"
                                                value={activeCompany.company}
                                            />
                                            <PreviewCard
                                                icon={<MapPinIcon className="h-3.5 w-3.5 text-pink-600" />}
                                                iconBg="bg-pink-100"
                                                label="Address"
                                                value={activeCompany.address || 'No address on file'}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Password Section */}
                            <div>
                                <SectionLabel>Set your password</SectionLabel>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div>
                                        <InputLabel htmlFor="password" value="Password" className="text-xs font-semibold text-slate-600" />
                                        <div className="relative">
                                            <LockClosedIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-rose-300" />
                                            <TextInput
                                                id="password"
                                                type="password"
                                                name="password"
                                                value={data.password}
                                                className={iconInput}
                                                autoComplete="new-password"
                                                placeholder="Min. 8 characters"
                                                onChange={(e) => setData('password', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <InputError message={errors.password} className="mt-1 text-xs" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="password_confirmation" value="Confirm password" className="text-xs font-semibold text-slate-600" />
                                        <div className="relative">
                                            <LockClosedIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-rose-300" />
                                            <TextInput
                                                id="password_confirmation"
                                                type="password"
                                                name="password_confirmation"
                                                value={data.password_confirmation}
                                                className={iconInput}
                                                autoComplete="new-password"
                                                placeholder="Re-enter password"
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <InputError message={errors.password_confirmation} className="mt-1 text-xs" />
                                    </div>
                                </div>
                            </div>

                            {/* Footer - Compact */}
                            <div className="flex flex-col-reverse gap-3 border-t border-rose-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                                <Link
                                    href={route('login')}
                                    className="inline-flex items-center gap-1 text-sm font-semibold text-rose-500 transition hover:text-rose-700"
                                >
                                    <ArrowRightOnRectangleIcon className="h-3.5 w-3.5" />
                                    Already have an account?
                                </Link>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                            </svg>
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            Create account
                                            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-white/20 text-xs">
                                                →
                                            </span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Footer note - Compact */}
                    <p className="mt-4 text-center text-[10px] text-rose-300/80">
                        By registering, you agree to the{' '}
                        <a href="#" className="underline hover:text-rose-500">Terms</a>
                        {' '}and{' '}
                        <a href="#" className="underline hover:text-rose-500">Privacy</a>.
                    </p>
                </div>
            </div>
        </>
    );
}

/* ── Compact helper components ── */

function SectionLabel({ children }) {
    return (
        <div className="mb-3 flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300">
                {children}
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-rose-200 to-transparent" />
        </div>
    );
}

function PreviewCard({ icon, iconBg, label, value }) {
    return (
        <div className="flex items-start gap-2 rounded-lg border border-rose-100 bg-white px-3 py-2 shadow-sm">
            <div className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md ${iconBg}`}>
                {icon}
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-[9px] font-bold uppercase tracking-wider text-rose-300">{label}</p>
                <p className="mt-0.5 truncate text-xs font-medium text-slate-800">{value}</p>
            </div>
        </div>
    );
}
