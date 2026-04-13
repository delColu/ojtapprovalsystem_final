// resources/js/Layouts/AuthenticatedLayout.jsx
import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

import {
    AcademicCapIcon,
    ArrowUpTrayIcon,
    BellIcon,
    BriefcaseIcon,
    BuildingLibraryIcon,
    ChartBarIcon,
    ChevronRightIcon,
    ClipboardDocumentListIcon,
    Cog6ToothIcon,
    DocumentIcon,
    FolderIcon,
    HomeIcon,
    SparklesIcon,
    Squares2X2Icon,
    TrashIcon,
    UserCircleIcon,
    UsersIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';

export default function AuthenticatedLayout({ header, children }) {
    const page = usePage();
    const { auth, notifications: sharedNotifications = [], unreadNotificationsCount = 0 } = page.props;
    const { url, component } = page;
    const user = auth?.user || {};
    const userRole = user?.role || 'student';
    const userName = user?.name || 'User';
    const userEmail = user?.email || '';
    const userInitial = userName ? userName.charAt(0).toUpperCase() : 'U';

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
    const notifications = sharedNotifications || [];
    const unreadCount = unreadNotificationsCount || 0;

    const getNotificationHref = (notification) => {
        switch (notification.type) {
            case 'folder_created':
            case 'folder_updated':
            case 'folder_reopened':
                return route('submit-reports');
            case 'folder_deleted':
            case 'folder_closed':
                return '/folders';
            case 'submission':
                return route('supervisor.submissions');
            case 'submission_forwarded':
                return route('dean.submissions.index');
            case 'status_update':
                return '/my-reports';
            default:
                return route('notifications.index');
        }
    };

    const handleNotificationClick = () => {
        if (notifications.length === 0) {
            alert('No notifications');
        } else {
            setShowNotificationDropdown(!showNotificationDropdown);
        }
    };

    const openNotification = (notification) => {
        router.post(route('notifications.read', notification.id), {}, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setShowNotificationDropdown(false);
                router.visit(getNotificationHref(notification));
            },
        });
    };

    const markAllAsRead = () => {
        setShowNotificationDropdown(false);
        router.post(route('notifications.mark-all-read'), {}, { preserveScroll: true, preserveState: true });
    };

    const deleteNotification = (notificationId) => {
        router.delete(route('notifications.destroy', notificationId), { preserveScroll: true, preserveState: true });
    };

    const getPageTitle = () => {
        if (component === 'Student/SubmitReports') return 'Submit Report';
        if (component === 'Supervisor/Dashboard') return 'Dashboard';
        if (component === 'Supervisor/Tasks') return 'Tasks';
        if (component === 'Supervisor/Interns') return 'Interns';
        if (component === 'Supervisor/Submissions') return 'Submissions';
        if (component === 'Supervisor/Reports') return 'Reports';
        if (component === 'Dean/Dashboard') return 'Dean Dashboard';
        if (component === 'Dean/Supervisors') return 'Supervisors';
        if (component === 'Dean/Interns') return 'Interns';
        if (component === 'Dean/Departments') return 'Departments';
        if (component === 'Dean/Submissions') return 'All Submissions';
if (component === 'Dean/Reports') return 'Reports';
        if (component === 'Dean/Companies') return 'Companies';
        if (component === 'Admin/Dashboard') return 'Dashboard';
        if (component === 'Admin/Users') return 'Users';
        if (component === 'Admin/Tasks') return 'All Tasks';
        if (component === 'Admin/Company') return 'Companies';
        if (component === 'Admin/ActivityLogs') return 'Activity Logs';
        if (component === 'Admin/Company') return 'Manage company records for user assignments, registration, and previews.';
        if (component === 'Notifications/Index') return 'Notifications';
        if (component === 'Student/MyReports') return 'My Reports';
        if (component === 'Student/Folders') return 'Report Folders';

        if (window.location.pathname === '/submit-reports') return 'Submit Report';
        if (window.location.pathname === '/my-reports') return 'My Reports';
        if (window.location.pathname === '/folders') return 'Report Folders';
        if (url && url.includes('/submit-reports')) return 'Submit Report';
        if (url && url.includes('/my-reports')) return 'My Reports';
        if (url && url.includes('/folders')) return 'Report Folders';

        return 'Student Dashboard';
    };

    const getPageDescription = () => {
        if (component === 'Student/Dashboard') return 'Track your internship progress, recent submissions, and available report folders.';
        if (component === 'Student/SubmitReports') return 'Upload and organize your latest report submission for supervisor review.';
        if (component === 'Student/MyReports') return 'Review submitted files, statuses, and feedback across your reports.';
        if (component === 'Student/Folders') return 'Browse active folders, deadlines, and assigned supervisors for submissions.';

        if (component === 'Supervisor/Dashboard') return 'Monitor intern progress, pending reviews, and key submission activity at a glance.';
        if (component === 'Supervisor/Tasks') return 'Manage report folders, deadlines, and task spaces for your interns.';
        if (component === 'Supervisor/Interns') return 'View assigned interns, their status, and overall submission performance.';
        if (component === 'Supervisor/Submissions') return 'Review incoming submissions and take action on pending intern work.';
        if (component === 'Supervisor/Reports') return 'Access reviewed reports, historical records, and submission outcomes.';

        if (component === 'Dean/Dashboard') return 'Oversee department performance, approvals, and report activity across supervisors and interns.';
        if (component === 'Dean/Supervisors') return 'Manage supervisor assignments, department coverage, and approval performance.';
        if (component === 'Dean/Interns') return 'Track intern records, status updates, and department-level activity.';
        if (component === 'Dean/Departments') return 'Review departments, company assignments, and linked supervisor coverage.';
        if (component === 'Dean/Submissions') return 'Evaluate forwarded submissions that are waiting for dean review and action.';
if (component === 'Dean/Reports') return 'Browse finalized report records, outcomes, and decision history.';
        if (component === 'Dean/Companies') return 'View companies partnered with your department based on student assignments.';

        if (component === 'Admin/Dashboard') return 'See platform-wide activity, user totals, and recent operational updates.';
        if (component === 'Admin/Users') return 'Manage user accounts, roles, departments, and account status across the system.';
        if (component === 'Admin/Tasks') return 'Oversee all created tasks, deadlines, and report folder activity.';
        if (component === 'Admin/Departments') return 'Manage department records used for user assignments and organization.';
        if (component === 'Admin/ActivityLogs') return 'Audit important actions and system events across every role.';

        if (component === 'Notifications/Index') return 'Review all recent alerts, updates, and workflow activity in one place.';

        if (url === '/dashboard') return 'Track your internship progress, recent submissions, and available report folders.';
        if (url === '/submit-reports') return 'Upload and organize your latest report submission for supervisor review.';
        if (url === '/my-reports') return 'Review submitted files, statuses, and feedback across your reports.';
        if (url === '/folders') return 'Browse active folders, deadlines, and assigned supervisors for submissions.';

        return 'Stay on top of your current workspace with the latest tools, records, and activity for this section.';
    };

    const pageTitle = getPageTitle();
    const pageDescription = getPageDescription();

    const getNavigation = () => {
        const navigation = {
            student: [
                { name: 'Dashboard', href: route('dashboard'), icon: HomeIcon },
                { name: 'Submit Reports', href: '/submit-reports', icon: ArrowUpTrayIcon },
                { name: 'My Reports', href: '/my-reports', icon: DocumentIcon },
                { name: 'Folders', href: '/folders', icon: FolderIcon },
            ],
            supervisor: [
                { name: 'Dashboard', href: route('supervisor.dashboard'), icon: HomeIcon },
                { name: 'Tasks', href: route('supervisor.tasks'), icon: FolderIcon },
                { name: 'Interns', href: route('supervisor.interns'), icon: UsersIcon },
                { name: 'Submissions', href: route('supervisor.submissions'), icon: DocumentIcon },
                { name: 'Reports', href: route('supervisor.reports'), icon: ChartBarIcon },
            ],
            dean: [
                { name: 'Dashboard', href: route('dean.dashboard'), icon: HomeIcon },
                { name: 'Supervisors', href: route('dean.supervisors.index'), icon: UsersIcon },
                { name: 'Interns', href: route('dean.interns.index'), icon: AcademicCapIcon },
                { name: 'Departments', href: route('dean.departments.index'), icon: BuildingLibraryIcon },
                { name: 'All Submissions', href: route('dean.submissions.index'), icon: ClipboardDocumentListIcon },
{ name: 'Reports', href: route('dean.reports.index'), icon: ChartBarIcon },
                { name: 'Companies', href: route('dean.companies.index'), icon: BriefcaseIcon },
            ],
            admin: [
                { name: 'Dashboard', href: route('admin.dashboard'), icon: HomeIcon },
                { name: 'Users', href: '/admin/users', icon: UsersIcon },
                { name: 'Departments', href: '/admin/departments', icon: BuildingLibraryIcon },
                { name: 'Companies', href: '/admin/companies', icon: BriefcaseIcon },
                { name: 'All Tasks', href: route('admin.tasks.index'), icon: ClipboardDocumentListIcon },
                { name: 'Activity Logs', href: route('admin.activity-logs.index'), icon: ChartBarIcon },
            ],
        };

        return navigation[userRole] || navigation.student;
    };

    const currentNavigation = getNavigation();

    const isActive = (href) => {
        if (href === route('dashboard') && url === '/dashboard') return true;
        if (href === route('supervisor.dashboard') && url === '/supervisor') return true;
        if (href === route('supervisor.tasks') && url === '/supervisor/tasks') return true;
        if (href === route('supervisor.interns') && url === '/supervisor/interns') return true;
        if (href === route('supervisor.submissions') && url === '/supervisor/submissions') return true;
        if (href === route('supervisor.reports') && url === '/supervisor/reports') return true;
        if (href === route('dean.dashboard') && url === '/dean/dashboard') return true;
        if (href === route('dean.supervisors.index') && url.startsWith('/dean/supervisors')) return true;
        if (href === route('dean.interns.index') && url.startsWith('/dean/interns')) return true;
        if (href === route('dean.departments.index') && url.startsWith('/dean/departments')) return true;
        if (href === route('dean.submissions.index') && url.startsWith('/dean/submissions')) return true;
if (href === route('dean.reports.index') && url.startsWith('/dean/reports')) return true;
        if (href === route('dean.companies.index') && url.startsWith('/dean/companies')) return true;
        if (href === route('admin.dashboard') && url === '/admin/dashboard') return true;
        if (href === '/admin/users' && url.startsWith('/admin/users')) return true;
        if (href === '/admin/companies' && url.startsWith('/admin/companies')) return true;
        if (href === route('admin.tasks.index') && url.startsWith('/admin/tasks')) return true;
        if (href === route('admin.activity-logs.index') && url.startsWith('/admin/activity-logs')) return true;
        if (href === '/admin/departments' && url.startsWith('/admin/departments')) return true;
        if (href === '/submit-reports' && (url === '/submit-reports' || component === 'Student/SubmitReports')) return true;
        if (href === '/my-reports' && (url === '/my-reports' || component === 'Student/MyReports')) return true;
        if (href === '/folders' && url === '/folders') return true;
        return false;
    };

    const roleMeta = useMemo(() => {
        const map = {
            admin: {
                label: 'Administrator',
                badge: 'bg-indigo-500/15 text-indigo-200 ring-1 ring-inset ring-indigo-300/20',
                panel: 'from-indigo-600/20 via-violet-500/10 to-transparent',
                accent: 'text-indigo-200',
                sidebar: 'bg-[linear-gradient(180deg,#0f172a_0%,#312e81_55%,#5b21b6_100%)]',
                activeNav: 'from-indigo-400/20 to-violet-300/10 ring-indigo-200/20',
                topbar: 'border-indigo-200/40 bg-[linear-gradient(135deg,rgba(255,255,255,0.62)_0%,rgba(238,242,255,0.52)_45%,rgba(245,243,255,0.46)_100%)]',
                topbarButton: 'border-indigo-200/45 bg-white/45 text-slate-700 hover:border-indigo-300/60 hover:bg-white/60 hover:text-indigo-950',
                topbarIcon: 'from-indigo-700 to-violet-600',
                icon: Squares2X2Icon,
            },
            supervisor: {
                label: 'Supervisor',
                badge: 'bg-sky-500/15 text-sky-200 ring-1 ring-inset ring-sky-300/20',
                panel: 'from-sky-600/20 via-cyan-500/10 to-transparent',
                accent: 'text-sky-200',
                sidebar: 'bg-[linear-gradient(180deg,#082f49_0%,#0f172a_100%)]',
                activeNav: 'from-sky-400/20 to-cyan-300/10 ring-sky-200/20',
                topbar: 'border-sky-200/40 bg-[linear-gradient(135deg,rgba(255,255,255,0.58)_0%,rgba(240,249,255,0.50)_45%,rgba(236,254,255,0.44)_100%)]',
                topbarButton: 'border-sky-200/45 bg-white/40 text-slate-700 hover:border-sky-300/60 hover:bg-white/55 hover:text-sky-950',
                topbarIcon: 'from-sky-700 to-cyan-600',
                icon: BriefcaseIcon,
            },
            dean: {
                label: 'Dean',
                badge: 'bg-sky-500/15 text-sky-200 ring-1 ring-inset ring-sky-300/20',
                panel: 'from-sky-600/20 via-cyan-500/10 to-transparent',
                accent: 'text-sky-200',
                sidebar: 'bg-[linear-gradient(180deg,#0b4f8a_0%,#0f172a_100%)]',
                activeNav: 'from-sky-400/20 to-cyan-300/10 ring-sky-200/20',
                topbar: 'border-sky-200/40 bg-[linear-gradient(135deg,rgba(255,255,255,0.58)_0%,rgba(240,249,255,0.50)_45%,rgba(236,254,255,0.44)_100%)]',
                topbarButton: 'border-sky-200/45 bg-white/40 text-slate-700 hover:border-sky-300/60 hover:bg-white/55 hover:text-sky-950',
                topbarIcon: 'from-sky-700 to-cyan-600',
                icon: BuildingLibraryIcon,
            },
            student: {
                label: 'Student',
                badge: 'bg-rose-500/15 text-rose-200 ring-1 ring-inset ring-rose-300/20',
                panel: 'from-rose-600/20 via-pink-500/10 to-transparent',
                accent: 'text-rose-200',
                sidebar: 'bg-[linear-gradient(180deg,#881337_0%,#0f172a_100%)]',
                activeNav: 'from-rose-400/20 to-pink-300/10 ring-rose-200/20',
                topbar: 'border-rose-200/40 bg-[linear-gradient(135deg,rgba(255,255,255,0.58)_0%,rgba(255,241,242,0.50)_45%,rgba(253,242,248,0.44)_100%)]',
                topbarButton: 'border-rose-200/45 bg-white/40 text-slate-700 hover:border-rose-300/60 hover:bg-white/55 hover:text-rose-950',
                topbarIcon: 'from-rose-700 to-pink-600',
                icon: AcademicCapIcon,
            },
        };

        return map[userRole] || map.student;
    }, [userRole]);

    const pageMeta = useMemo(() => {
        const activeItem = currentNavigation.find((item) => isActive(item.href));
        return {
            section: activeItem?.name || getPageTitle(),
            icon: activeItem?.icon || HomeIcon,
        };
    }, [currentNavigation, url, component]);

    const PageMetaIcon = pageMeta.icon;
    const RoleIcon = roleMeta.icon;

    return (
        <div className="min-h-screen bg-[linear-gradient(135deg,#f8fafc_0%,#fff8fb_35%,#f1f5f9_100%)] text-slate-900">
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-rose-200/30 blur-3xl" />
                <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-violet-200/20 blur-3xl" />
                <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-sky-200/20 blur-3xl" />
            </div>

            {sidebarOpen && (
                <button
                    type="button"
                    className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 w-[290px] transform transition-transform duration-300 ease-out lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className={`flex h-full flex-col border-r border-white/10 text-white shadow-[20px_0_80px_-35px_rgba(15,23,42,0.8)] ${roleMeta.sidebar}`}>
                    <div className="border-b border-white/10 px-6 pb-6 pt-6">
                        <div className="mb-6 flex items-start justify-between gap-3">
                            <Link href={currentNavigation[0]?.href || '#'} className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-white/15 to-white/5 shadow-inner ring-1 ring-white/10">
                                    <AcademicCapIcon className="h-7 w-7 text-white" />
                                </div>
                                <div>
                                    <p className="text-[11px] uppercase tracking-[0.32em] text-slate-400">Intern Track</p>
                                    <h1 className="text-lg font-semibold text-white">Tasks System</h1>
                                </div>
                            </Link>

                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>

                        <div className={`overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br ${roleMeta.panel} p-4`}>
                            <div className="flex items-start gap-3">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-lg font-semibold text-white ring-1 ring-white/10">
                                    {userInitial}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="truncate text-sm font-semibold text-white">{String(userName)}</p>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${roleMeta.badge}`}>
                                            {roleMeta.label}
                                        </span>
                                    </div>
                                    <p className="mt-1 truncate text-xs text-slate-300">{String(userEmail)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 py-5">
                        <div className="mb-3 px-2">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">Navigation</p>
                        </div>

                        <nav className="space-y-2">
                            {currentNavigation.map((item) => {
                                const active = isActive(item.href);

                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`group flex items-center gap-3 rounded-2xl px-4 py-3.5 transition ${
                                            active
                                                ? `bg-gradient-to-r ${roleMeta.activeNav} text-white shadow-lg shadow-black/10 ring-1`
                                                : 'text-slate-300 hover:bg-white/6 hover:text-white'
                                        }`}
                                    >
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                                            active ? 'bg-white/14 text-white' : 'bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-white'
                                        }`}>
                                            <item.icon className="h-5 w-5" />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium">{item.name}</p>
                                            <p className="truncate text-xs text-slate-400">
                                                {active ? 'Currently viewing' : ''}
                                            </p>
                                        </div>

                                        <ChevronRightIcon className={`h-4 w-4 transition ${active ? 'text-white/80' : 'text-slate-500 group-hover:text-slate-300'}`} />
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="border-t border-white/10 px-4 py-5">
                        <Link
                            href={route('profile.edit')}
                            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200 transition hover:bg-white/10 hover:text-white"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                                <Cog6ToothIcon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">Account Settings</p>
                                <p className="text-xs text-slate-400">Profile, preferences, and security</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </aside>

            <div className="lg:pl-[290px]">
                <div className={`sticky top-0 z-30 border-b backdrop-blur-xl ${roleMeta.topbar}`}>
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex min-h-[88px] items-center justify-between gap-4">
                            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border shadow-sm backdrop-blur-md transition lg:hidden ${roleMeta.topbarButton}`}
                                >
                                    <Squares2X2Icon className="h-5 w-5" />
                                </button>

                                <div className="flex min-w-0 items-center gap-4">
                                    <div className={`hidden h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg sm:flex ${roleMeta.topbarIcon}`}>
                                        <PageMetaIcon className="h-6 w-6" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                                            <span>{roleMeta.label}</span>
                                            <span className="text-slate-300">•</span>
                                            <span>{pageMeta.section}</span>
                                        </div>
                                        <h1 className="truncate text-2xl font-semibold text-slate-900">{pageTitle}</h1>
                                        <p className="mt-1 hidden text-sm text-slate-500 sm:block">
                                            {pageDescription}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="relative hidden sm:block">
                                    <button
                                        onClick={handleNotificationClick}
                                        className={`relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border shadow-sm backdrop-blur-md transition ${roleMeta.topbarButton}`}
                                    >
                                        <BellIcon className="h-5 w-5" />
                                        {unreadCount > 0 && (
                                            <span className="absolute -right-1 -top-1 min-w-[1.2rem] rounded-full bg-rose-500 px-1.5 py-0.5 text-center text-[10px] font-bold text-white shadow-lg">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </button>

                                    {showNotificationDropdown && (
                                        <>
                                            <button
                                                type="button"
                                                className="fixed inset-0 z-10"
                                                onClick={() => setShowNotificationDropdown(false)}
                                            />
                                            <div className="absolute right-0 z-20 mt-3 w-[360px] overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_30px_80px_-35px_rgba(15,23,42,0.35)]">
                                                <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-rose-50 px-4 py-4">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div>
                                                            <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
                                                            <p className="mt-1 text-xs text-slate-500">
                                                                {unreadCount} unread update{unreadCount === 1 ? '' : 's'}
                                                            </p>
                                                        </div>
                                                        {notifications.length > 0 && unreadCount > 0 && (
                                                            <button
                                                                onClick={markAllAsRead}
                                                                className="rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-slate-800"
                                                            >
                                                                Mark all as read
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="max-h-96 overflow-y-auto">
                                                    {notifications.length === 0 ? (
                                                        <div className="px-6 py-10 text-center">
                                                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                                                <BellIcon className="h-7 w-7" />
                                                            </div>
                                                            <p className="mt-4 text-sm font-medium text-slate-700">No notifications yet</p>
                                                            <p className="mt-1 text-xs text-slate-500">Updates about folders and report reviews will appear here.</p>
                                                        </div>
                                                    ) : (
                                                        notifications.map((notification) => (
                                                            <div
                                                                key={notification.id}
                                                                className={`border-b border-slate-100 px-4 py-4 transition hover:bg-slate-50 ${
                                                                    !notification.is_read ? 'bg-rose-50/60' : 'bg-white'
                                                                }`}
                                                            >
                                                                <div className="flex items-start gap-3">
                                                                    <button
                                                                        type="button"
                                                                        className="flex-1 text-left"
                                                                        onClick={() => openNotification(notification)}
                                                                    >
                                                                        <div className="flex items-center gap-2">
                                                                            {!notification.is_read && (
                                                                                <span className="h-2 w-2 rounded-full bg-rose-500" />
                                                                            )}
                                                                            <p className="text-sm font-semibold text-slate-800">{notification.title}</p>
                                                                        </div>
                                                                        <p className="mt-1 text-sm leading-6 text-slate-600">{notification.message}</p>
                                                                        <p className="mt-2 text-xs text-slate-400">{notification.created_at}</p>
                                                                    </button>

                                                                    <button
                                                                        type="button"
                                                                        onClick={() => deleteNotification(notification.id)}
                                                                        className="rounded-xl p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                                                                        title="Delete notification"
                                                                    >
                                                                        <TrashIcon className="h-4 w-4" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>

                                                {notifications.length > 0 && (
                                                    <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-3 text-center">
                                                        <Link href="/notifications" className="text-sm font-medium text-slate-700 transition hover:text-slate-900">
                                                            View all notifications
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="hidden sm:block">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-2xl">
                                                <button
                                                    type="button"
                                                    className={`inline-flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-sm font-medium shadow-sm backdrop-blur-md transition ${roleMeta.topbarButton}`}
                                                >
                                                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-semibold text-white ${roleMeta.topbarIcon}`}>
                                                        {userInitial}
                                                    </span>
                                                    <span className="hidden text-left md:block">
                                                        <span className="block text-sm font-semibold leading-4">{String(userName)}</span>
                                                        <span className="block text-xs text-slate-500">{roleMeta.label}</span>
                                                    </span>
                                                    <svg
                                                        className="h-4 w-4 text-slate-400"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                            <Dropdown.Link href={route('logout')} method="post" as="button">
                                                Log Out
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>

                                <button
                                    onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                    className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border shadow-sm backdrop-blur-md transition sm:hidden ${roleMeta.topbarButton}`}
                                >
                                    {showingNavigationDropdown ? <XMarkIcon className="h-5 w-5" /> : <UserCircleIcon className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={`${showingNavigationDropdown ? 'block' : 'hidden'} border-t border-slate-200 bg-white sm:hidden`}>
                        <div className="space-y-1 px-4 py-4">
                            {currentNavigation.map((item) => (
                                <ResponsiveNavLink key={item.name} href={item.href} active={isActive(item.href)}>
                                    {item.name}
                                </ResponsiveNavLink>
                            ))}
                        </div>

                        <div className="border-t border-slate-200 px-4 py-4">
                            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white">
                                    {userInitial}
                                </div>
                                <div className="min-w-0">
                                    <div className="truncate text-sm font-semibold text-slate-900">{String(userName)}</div>
                                    <div className="truncate text-xs text-slate-500">{String(userEmail)}</div>
                                </div>
                            </div>

                            <div className="mt-3 space-y-1">
                                <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                                <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                    Log Out
                                </ResponsiveNavLink>
                            </div>
                        </div>
                    </div>
                </div>

                {header && (
                    <header className="px-4 pt-6 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-7xl rounded-[1.75rem] border border-white/70 bg-white/80 px-6 py-5 shadow-sm backdrop-blur">
                            {header}
                        </div>
                    </header>
                )}

                <main className="px-0 pb-0">
                    {children}
                </main>
            </div>
        </div>
    );
}
