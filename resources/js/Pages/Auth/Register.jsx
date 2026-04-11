import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    EnvelopeIcon,
    LockClosedIcon,
    UserIcon,
    ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const filledFields = [
        data.name,
        data.email,
        data.password,
        data.password_confirmation,
    ].filter(Boolean).length;

    const progress = Math.min(Math.round((filledFields / 4) * 100), 100);

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
                {/* Decorative background blobs */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -left-32 -top-32 h-[480px] w-[480px] rounded-full bg-rose-200/20 blur-[80px]" />
                    <div className="absolute -bottom-40 -right-20 h-[520px] w-[520px] rounded-full bg-pink-200/20 blur-[100px]" />
                </div>

                <div className="relative w-full max-w-md">
                    {/* Main Card */}
                    <div className="overflow-hidden rounded-xl border border-rose-100 bg-white shadow-lg shadow-rose-200/30">
                        {/* Header */}
                        <div className="relative overflow-hidden bg-gradient-to-br from-rose-700 via-rose-600 to-pink-600 px-6 py-6">
                            <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full border border-white/10" />

                            <h1 className="text-2xl font-bold tracking-tight text-white">
                                Create Account
                            </h1>
                            <p className="mt-1 text-sm text-white/70">
                                Join quickly with basic information.
                            </p>

                            {/* Progress bar */}
                            <div className="mt-4">
                                <div className="mb-1 flex items-center justify-between">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
                                        Progress
                                    </span>
                                    <span className="text-xs font-semibold text-white/70">
                                        {progress}%
                                    </span>
                                </div>
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-white/90 to-rose-100 transition-all duration-500"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={submit} className="px-6 py-8 space-y-6">
                            {/* Name & Email */}
                            <div>
                                <SectionLabel>Basic information</SectionLabel>
                                <div className="space-y-4">
                                    <div>
                                        <InputLabel htmlFor="name" value="Full Name" />
                                        <div className="mt-1 relative">
                                            <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-rose-400 pointer-events-none" />
                                            <TextInput
                                                id="name"
                                                name="name"
                                                value={data.name}
                                                className={iconInput}
                                                autoComplete="name"
                                                placeholder="Enter your full name"
                                                onChange={(e) => setData('name', e.target.value)}
                                                required
                                                isFocused={true}
                                            />
                                        </div>
                                        <InputError className="mt-2" message={errors.name} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="email" value="Email Address" />
                                        <div className="mt-1 relative">
                                            <EnvelopeIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-rose-400 pointer-events-none" />
                                            <TextInput
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={data.email}
                                                className={iconInput}
                                                autoComplete="username"
                                                placeholder="your@email.com"
                                                onChange={(e) => setData('email', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <InputError className="mt-2" message={errors.email} />
                                    </div>
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <SectionLabel>Secure your account</SectionLabel>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <InputLabel htmlFor="password" value="Password" />
                                        <div className="mt-1 relative">
                                            <LockClosedIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-rose-400 pointer-events-none" />
                                            <TextInput
                                                id="password"
                                                type="password"
                                                name="password"
                                                value={data.password}
                                                className={iconInput}
                                                autoComplete="new-password"
                                                placeholder="At least 8 characters"
                                                onChange={(e) => setData('password', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <InputError className="mt-2" message={errors.password} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                                        <div className="mt-1 relative">
                                            <LockClosedIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-rose-400 pointer-events-none" />
                                            <TextInput
                                                id="password_confirmation"
                                                type="password"
                                                name="password_confirmation"
                                                value={data.password_confirmation}
                                                className={iconInput}
                                                autoComplete="new-password"
                                                placeholder="Confirm your password"
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <InputError className="mt-2" message={errors.password_confirmation} />
                                    </div>
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <Link
                                    href={route('login')}
                                    className="w-full sm:w-auto text-center py-2.5 px-4 text-sm font-medium rounded-lg border border-rose-200 hover:border-rose-300 bg-white/50 hover:bg-white text-rose-700 hover:text-rose-900 transition-all"
                                >
                                    Already have account
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 py-2.5 px-4 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {processing ? (
                                        <span>Creating...</span>
                                    ) : (
                                        'Create Account'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

function SectionLabel({ children }) {
    return (
        <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 tracking-wide uppercase">{children}</h3>
            <div className="mt-1 h-px bg-gradient-to-r from-rose-200 to-transparent" />
        </div>
    );
}

