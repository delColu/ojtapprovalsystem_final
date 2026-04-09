import React from 'react';
import { Link } from '@inertiajs/react';
import {
    AcademicCapIcon,
    ArrowRightIcon,
    CheckBadgeIcon,
    ClipboardDocumentListIcon,
    ClockIcon,
    DocumentCheckIcon,
    SparklesIcon,
    UserGroupIcon,
} from '@heroicons/react/24/outline';

const features = [
    {
        title: 'Report Submission',
        description:
            'Submit weekly progress reports with file attachments and keep every requirement organized in one place.',
        icon: ClipboardDocumentListIcon,
    },
    {
        title: 'Multi-role Access',
        description:
            'Designed for students, supervisors, deans, and administrators with clear role-based workflows.',
        icon: UserGroupIcon,
    },
    {
        title: 'Approval Workflow',
        description:
            'Move submissions smoothly from checking to validation with a more transparent approval experience.',
        icon: DocumentCheckIcon,
    },
    {
        title: 'Progress Monitoring',
        description:
            'Track internship activity, report status, and pending tasks from a centralized academic platform.',
        icon: ClockIcon,
    },
];

const stats = [
    { value: '4', label: 'User Roles' },
    { value: '24/7', label: 'Platform Access' },
    { value: '100%', label: 'Digital Tracking' },
    { value: 'Real-time', label: 'Workflow Visibility' },
];

const highlights = [
    'Cleaner student submission experience',
    'Guided supervisor review flow',
    'Centralized internship documentation',
];

export default function Welcome() {
    return (
        <div className="min-h-screen overflow-hidden bg-[#fff8fb] text-[#26131d]">
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#ffe6f1_0%,transparent_32%),radial-gradient(circle_at_top_right,#ffd3e7_0%,transparent_28%),linear-gradient(180deg,#fffafc_0%,#fff3f8_45%,#ffffff_100%)]" />
                <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-[#f8c8dc]/50 blur-3xl" />
                <div className="absolute right-0 top-20 h-[28rem] w-[28rem] rounded-full bg-[#f9a8d4]/20 blur-3xl" />
                <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#fbcfe8]/35 blur-3xl" />
                <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,#db2777_1px,transparent_1px),linear-gradient(to_bottom,#db2777_1px,transparent_1px)] [background-size:80px_80px]" />
            </div>

            <nav className="sticky top-0 z-30 border-b border-[#f0d6e1] bg-white/80 backdrop-blur-2xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f472b6] via-[#db2777] to-[#831843] shadow-[0_18px_42px_rgba(190,24,93,0.28)]">
                            <AcademicCapIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="text-lg font-semibold tracking-tight text-[#341625]">
                                 OJT Tasks Approval System
                            </p>
                            <p className="text-xs uppercase tracking-[0.28em] text-[#b14478]">
                                Internship approval platform
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href={route('register')}
                            className="hidden rounded-full border border-[#ecd1dd] bg-white px-5 py-2.5 text-sm font-medium text-[#5a2640] shadow-sm transition hover:border-[#e7abc8] hover:bg-[#fff3f8] sm:inline-flex"
                        >
                            Register
                        </Link>
                        <Link
                            href={route('login')}
                            className="inline-flex items-center gap-2 rounded-full bg-[#111827] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(17,24,39,0.16)] transition hover:bg-[#1f2937]"
                        >
                            Login
                            <ArrowRightIcon className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </nav>

            <section className="relative">
                <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-24">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#f2cade] bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#be185d] shadow-[0_10px_24px_rgba(236,72,153,0.10)] backdrop-blur">
                            <SparklesIcon className="h-4 w-4" />
                            Digital OJT coordination
                        </div>

                        <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight text-[#24131d] sm:text-5xl lg:text-[4.1rem]">
                            Better workflow for internship reports, approvals, and academic tracking.
                        </h1>

                        <p className="mt-6 max-w-2xl text-base leading-8 text-[#674556] sm:text-lg">
                            Replace scattered paperwork with one organized platform for students,
                            supervisors, deans, and administrators. Review reports faster, track
                            progress clearly, and keep internship records centralized.
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link
                                href={route('login')}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#be185d] via-[#db2777] to-[#831843] px-7 py-4 text-sm font-semibold text-white shadow-[0_20px_50px_rgba(190,24,93,0.24)] transition hover:-translate-y-0.5 hover:brightness-105"
                            >
                                Get Started
                                <ArrowRightIcon className="h-4 w-4" />
                            </Link>
                            <Link
                                href={route('register')}
                                className="inline-flex items-center justify-center rounded-2xl border border-[#ecd1dd] bg-white/90 px-7 py-4 text-sm font-semibold text-[#5a2640] transition hover:bg-[#fff3f8]"
                            >
                                Create Account
                            </Link>
                        </div>

                        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {stats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="rounded-[1.5rem] border border-[#f2d9e4] bg-white/95 p-5 shadow-[0_14px_30px_rgba(190,24,93,0.08)] backdrop-blur"
                                >
                                    <div className="text-2xl font-black text-[#be185d]">
                                        {stat.value}
                                    </div>
                                    <div className="mt-2 text-sm text-[#6c485b]">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -top-8 right-6 z-10 rounded-2xl border border-[#f3d2e1] bg-white/95 px-4 py-3 shadow-[0_18px_40px_rgba(190,24,93,0.12)] backdrop-blur">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b14478]">
                                Active Monitoring
                            </p>
                            <p className="mt-1 text-sm font-semibold text-[#311520]">
                                Submission flow in one screen
                            </p>
                        </div>

                        <div className="overflow-hidden rounded-[2rem] border border-[#efd2df] bg-white/85 shadow-[0_32px_80px_rgba(190,24,93,0.16)] backdrop-blur-2xl">
                            <div className="border-b border-[#f0d8e3] bg-[linear-gradient(135deg,#1f1720_0%,#4a1832_45%,#831843_100%)] px-6 py-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] uppercase tracking-[0.24em] text-[#f6c6dd]">
                                            Dashboard Snapshot
                                        </p>
                                        <h2 className="mt-1 text-xl font-semibold text-white">
                                            Internship Overview
                                        </h2>
                                    </div>
                                    <span className="rounded-full border border-[#f3a6c9]/30 bg-[#f472b6]/15 px-3 py-1 text-[11px] font-semibold text-[#fbcfe8]">
                                        Live
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4 bg-[linear-gradient(180deg,#fffafe_0%,#fff4f8_100%)] p-6">
                                <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                                    <div className="rounded-[1.6rem] bg-gradient-to-br from-[#111827] via-[#4a1832] to-[#be185d] p-5 shadow-[0_18px_40px_rgba(17,24,39,0.16)]">
                                        <p className="text-xs uppercase tracking-[0.2em] text-white/75">
                                            Pending review
                                        </p>
                                        <p className="mt-2 text-3xl font-bold text-white">
                                            12 Reports
                                        </p>
                                        <p className="mt-1 text-sm text-white/80">
                                            Waiting for supervisor evaluation
                                        </p>

                                        <div className="mt-5 h-2 rounded-full bg-white/15">
                                            <div className="h-2 w-2/3 rounded-full bg-white" />
                                        </div>
                                    </div>

                                    <div className="grid gap-3">
                                        <div className="rounded-2xl border border-[#f0d8e3] bg-white p-4 shadow-sm">
                                            <p className="text-xs uppercase tracking-[0.16em] text-[#9d5d78]">
                                                Approved
                                            </p>
                                            <p className="mt-2 text-2xl font-bold text-[#30151f]">36</p>
                                        </div>
                                        <div className="rounded-2xl border border-[#f0d8e3] bg-white p-4 shadow-sm">
                                            <p className="text-xs uppercase tracking-[0.16em] text-[#9d5d78]">
                                                In Progress
                                            </p>
                                            <p className="mt-2 text-2xl font-bold text-[#30151f]">8</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-[1.6rem] border border-[#f0d8e3] bg-white p-5 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold text-[#30151f]">
                                            Workflow Highlights
                                        </p>
                                        <p className="text-xs font-medium text-[#be185d]">
                                            Updated
                                        </p>
                                    </div>

                                    <div className="mt-4 space-y-3">
                                        {highlights.map((item) => (
                                            <div
                                                key={item}
                                                className="flex items-center gap-3 rounded-2xl bg-[#fff7fb] px-3 py-2.5 text-sm text-[#6c485b]"
                                            >
                                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#ffe3ef] to-[#f8bfd8] text-[#a51753] shadow-sm">
                                                    <CheckBadgeIcon className="h-4 w-4" />
                                                </span>
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="absolute -bottom-6 left-6 z-10 rounded-2xl border border-[#f3d2e1] bg-white/95 px-4 py-3 shadow-[0_18px_40px_rgba(190,24,93,0.12)] backdrop-blur">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b14478]">
                                Academic Workflow
                            </p>
                            <p className="mt-1 text-sm font-semibold text-[#311520]">
                                Clear review path for each role
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
                <div className="grid gap-4 md:grid-cols-3">
                    {[
                        'Centralized internship documents',
                        'Faster report review coordination',
                        'Cleaner digital workflow for every role',
                    ].map((item) => (
                        <div
                            key={item}
                            className="rounded-2xl border border-[#f0d9e3] bg-white/90 px-5 py-4 text-sm font-medium text-[#5f3347] shadow-[0_12px_30px_rgba(190,24,93,0.06)] backdrop-blur"
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </section>

            <section className="border-y border-[#f1d9e4] bg-white/70 backdrop-blur-xl">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#be185d]">
                            Features
                        </p>
                        <p className="mt-4 text-3xl font-bold text-[#24131d] sm:text-4xl">
                            Tools that support the full OJT process
                        </p>
                        <p className="mt-4 text-base leading-7 text-[#6c485b]">
                            Built to reduce manual coordination and improve visibility
                            across reports, approvals, and academic internship tracking.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                        {features.map(({ title, description, icon: Icon }) => (
                            <div
                                key={title}
                                className="group relative overflow-hidden rounded-3xl border border-[#f0d9e3] bg-white p-6 shadow-[0_16px_40px_rgba(190,24,93,0.08)] transition duration-200 hover:-translate-y-1.5 hover:border-[#ebb1cd] hover:shadow-[0_20px_45px_rgba(190,24,93,0.14)]"
                            >
                                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#831843] via-[#db2777] to-[#f9a8d4]" />
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ffe2ee] via-[#f8c5db] to-[#f2a7cb] text-[#be185d] ring-1 ring-[#f1bfd6] transition group-hover:scale-105">
                                    <Icon className="h-7 w-7" />
                                </div>
                                <h3 className="mt-5 text-xl font-semibold text-[#311520]">
                                    {title}
                                </h3>
                                <p className="mt-3 text-sm leading-7 text-[#6d485a]">
                                    {description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-[2rem] border border-[#f0cadb] bg-[linear-gradient(135deg,#111827_0%,#4a1832_28%,#9d174d_62%,#ec4899_100%)] p-8 shadow-[0_30px_80px_rgba(157,23,77,0.28)] sm:p-10 lg:flex lg:items-center lg:justify-between">
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                    <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-[#fbcfe8]/20 blur-2xl" />

                    <div className="relative max-w-2xl">
                        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#fbcfe8]">
                            Get started
                        </p>
                        <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                            Access a smoother OJT approval experience
                        </h2>
                        <p className="mt-4 text-base leading-7 text-white/80">
                            Sign in to manage reports, monitor student progress, and keep
                            internship requirements organized from submission to approval.
                        </p>
                    </div>

                    <div className="relative mt-8 flex flex-col gap-3 sm:flex-row lg:mt-0">
                        <Link
                            href={route('login')}
                            className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-base font-semibold text-[#9d174d] transition hover:bg-[#fff2f8]"
                        >
                            Login Now
                        </Link>
                        <Link
                            href={route('register')}
                            className="inline-flex items-center justify-center rounded-2xl border border-white/50 bg-white/10 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/20"
                        >
                            Register Account
                        </Link>
                    </div>
                </div>
            </section>

            <footer className="border-t border-[#f0d6e1] bg-white/75 backdrop-blur-xl">
                <div className="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-[#6d485a] sm:px-6 lg:px-8">
                    &copy; {new Date().getFullYear()}  OJT Approval System. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
