import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    EnvelopeIcon,
    LockClosedIcon,
    ShieldCheckIcon,
    SparklesIcon,
} from '@heroicons/react/24/outline';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    // Compact input styles
    const inputClass =
        'mt-1 block w-full rounded-lg border border-rose-100 bg-rose-50/40 px-3 py-2 text-sm text-slate-900 outline-none transition-all duration-150 placeholder:text-rose-300 focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100 hover:border-rose-200 hover:bg-white';

    const iconInputClass = `${inputClass} pl-9`;

    return (
        <>
            <Head title="Log in" />

            <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-50 via-white to-pink-50 flex items-center justify-center px-4 py-8">
                {/* Decorative background blobs - simplified */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -left-32 -top-32 h-[480px] w-[480px] rounded-full bg-rose-200/20 blur-[80px]" />
                    <div className="absolute -bottom-40 -right-20 h-[520px] w-[520px] rounded-full bg-pink-200/20 blur-[100px]" />
                </div>

                <div className="relative w-full max-w-sm">
                    {/* Top nav row - Compact */}
                    <div className="mb-4 flex items-center justify-between">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-white/80 px-3 py-1 text-xs font-semibold text-rose-700 shadow-sm backdrop-blur-sm transition hover:border-rose-300 hover:bg-white"
                        >
                            <ArrowLeftIcon className="h-3 w-3" />
                            Back
                        </Link>

                        <div className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-white/70 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-rose-600 backdrop-blur-sm">
                            <SparklesIcon className="h-2.5 w-2.5" />
                            Secure
                        </div>
                    </div>

                    {/* Main Card - Compact */}
                    <div className="overflow-hidden rounded-xl border border-rose-100 bg-white shadow-lg shadow-rose-200/30">
                        {/* Card header - Compact */}
                        <div className="relative overflow-hidden bg-gradient-to-br from-rose-700 via-rose-600 to-pink-600 px-5 py-4">
                            <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full border border-white/10" />

                            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-rose-200">
                                Welcome back
                            </p>
                            <h1 className="mt-1 text-xl font-bold tracking-tight text-white">
                                Log in
                            </h1>
                            <p className="mt-0.5 text-xs text-rose-100/70">
                                Manage reports and approvals.
                            </p>
                        </div>

                        {/* Form body - Compact */}
                        <div className="px-5 py-5">
                            {/* Status message - Compact */}
                            {status && (
                                <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
                                    {status}
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-4">
                                {/* Email */}
                                <div>
                                    <InputLabel
                                        htmlFor="email"
                                        value="Email"
                                        className="text-xs font-semibold text-slate-600"
                                    />
                                    <div className="relative">
                                        <EnvelopeIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-rose-300" />
                                        <TextInput
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className={iconInputClass}
                                            autoComplete="username"
                                            isFocused
                                            placeholder="name@example.com"
                                            onChange={(e) => setData('email', e.target.value)}
                                        />
                                    </div>
                                    <InputError message={errors.email} className="mt-1 text-xs" />
                                </div>

                                {/* Password */}
                                <div>
                                    <div className="flex items-center justify-between">
                                        <InputLabel
                                            htmlFor="password"
                                            value="Password"
                                            className="text-xs font-semibold text-slate-600"
                                        />
                                        {canResetPassword && (
                                            <Link
                                                href={route('password.request')}
                                                className="text-[10px] font-semibold text-rose-500 transition hover:text-rose-700"
                                            >
                                                Forgot?
                                            </Link>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <LockClosedIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-rose-300" />
                                        <TextInput
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            className={iconInputClass}
                                            autoComplete="current-password"
                                            placeholder="Enter password"
                                            onChange={(e) => setData('password', e.target.value)}
                                        />
                                    </div>
                                    <InputError message={errors.password} className="mt-1 text-xs" />
                                </div>

                                {/* Remember me row - Compact */}
                                <div className="flex items-center justify-between rounded-lg border border-rose-100 bg-rose-50/50 px-3 py-2">
                                    <label className="flex cursor-pointer items-center gap-2">
                                        <Checkbox
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                            className="h-3 w-3 rounded border-rose-300 text-rose-600 focus:ring-rose-200"
                                        />
                                        <span className="text-xs font-medium text-slate-600">
                                            Remember me
                                        </span>
                                    </label>
                                    <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-rose-400">
                                        <ShieldCheckIcon className="h-3 w-3" />
                                        Secure
                                    </div>
                                </div>

                                {/* Submit Button - Compact */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                            </svg>
                                            Signing in...
                                        </>
                                    ) : (
                                        <>
                                            Log in
                                            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-white/20">
                                                <ArrowRightIcon className="h-3 w-3" />
                                            </span>
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Info strip - Compact */}
                            <div className="mt-4 rounded-lg border border-rose-100 bg-gradient-to-br from-rose-50 to-pink-50/60 px-3 py-2.5">
                                <p className="text-[9px] font-bold uppercase tracking-wider text-rose-400">
                                    Professional workflow
                                </p>
                                <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                                    Streamlined dashboard for reports and approvals.
                                </p>
                            </div>

                            {/* Register link */}
                            <p className="mt-4 text-center text-xs text-slate-400">
                                Don't have an account?{' '}
                                <Link
                                    href={route('register')}
                                    className="font-semibold text-rose-500 transition hover:text-rose-700"
                                >
                                    Create one
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Footer note - Compact */}
                    <p className="mt-4 text-center text-[10px] text-rose-300/80">
                        By logging in, you agree to our{' '}
                        <a href="#" className="underline hover:text-rose-500">Terms</a>
                        {' '}and{' '}
                        <a href="#" className="underline hover:text-rose-500">Privacy</a>.
                    </p>
                </div>
            </div>
        </>
    );
}
