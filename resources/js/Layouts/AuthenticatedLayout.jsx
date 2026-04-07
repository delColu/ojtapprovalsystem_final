// resources/js/Layouts/AuthenticatedLayout.jsx
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

// Import icons safely
import {
    HomeIcon,
    DocumentIcon,
    FolderIcon,
    UsersIcon,
    ChartBarIcon,
    AcademicCapIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
    ClipboardDocumentListIcon,
    BellIcon,
    ArrowUpTrayIcon,

} from '@heroicons/react/24/outline';

export default function AuthenticatedLayout({ header, children }) {
    const page = usePage();
    const { auth } = page.props;
    const { url, component } = page;
    // Extract user data safely - don't use the whole user object directly
    const user = auth?.user || {};
    const userRole = user?.role || 'student';
    const userName = user?.name || 'User';
    const userEmail = user?.email || '';
    const userInitial = userName ? userName.charAt(0).toUpperCase() : 'U';

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Fetch notifications (you can replace this with actual API call)
    useEffect(() => {
        // Simulate fetching notifications from backend
        // Replace this with actual API call: axios.get('/notifications')
        const fetchNotifications = async () => {
            // For now, use empty array - no notifications
            const mockNotifications = [];
            setNotifications(mockNotifications);
            setUnreadCount(mockNotifications.filter(n => !n.read).length);
        };

        fetchNotifications();
    }, []);

    // Handle notification click
    const handleNotificationClick = async () => {
        if (notifications.length === 0) {
            alert('No notifications');
        } else {
            setShowNotificationDropdown(!showNotificationDropdown);
        }
    };

    // Mark notification as read
    const markAsRead = async (notificationId) => {
        // Update local state
        setNotifications(prevNotifications =>
            prevNotifications.map(notif =>
                notif.id === notificationId ? { ...notif, read: true } : notif
            )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));

        // Here you can also make an API call to mark as read on the server
        // await axios.put(`/notifications/${notificationId}/read`);
    };

    // Mark all as read
    const markAllAsRead = async () => {
        setNotifications(prevNotifications =>
            prevNotifications.map(notif => ({ ...notif, read: true }))
        );
        setUnreadCount(0);
        setShowNotificationDropdown(false);

        // Here you can also make an API call to mark all as read on the server
        // await axios.put('/notifications/mark-all-read');
    };

    // Get the page title based on current component or URL
    const getPageTitle = () => {
        // Check by component name (most reliable)
        if (component === 'Student/SubmitReports') {
            return 'Submit Report';
        }
        if (component === 'Supervisor/Dashboard') {
            return 'Dashboard';
        }
        if (component === 'Supervisor/Tasks') {
            return 'Tasks';
        }
        if (component === 'Supervisor/Interns') {
            return 'Interns';
        }
        if (component === 'Supervisor/Submissions') {
            return 'Submissions';
        }
        if (component === 'Supervisor/Reports') {
            return 'Reports';
        }
        if (component === 'Dean/Dashboard') {
            return 'Dean Dashboard';
        }
        if (component === 'Dean/Supervisors') {
            return 'Supervisors';
        }
        if (component === 'Dean/Interns') {
            return 'Interns';
        }
        if (component === 'Dean/Departments') {
            return 'Departments';
        }
        if (component === 'Dean/Submissions') {
            return 'All Submissions';
        }
        if (component === 'Dean/Reports') {
            return 'Reports';
        }
        if (component === 'Admin/Dashboard') {
            return 'Dashboard';
        }
        if (component === 'Admin/Users') {
            return 'Users';
        }
        if (component === 'Admin/Tasks') {
            return 'All Tasks';
        }
        if (component === 'Admin/ActivityLogs') {
            return 'Activity Logs';
        }
        // Check for My Reports page
        if (component === 'Student/MyReports') {
            return 'My Reports';
        }
         if (component === 'Student/Folders') {
            return 'Report Folders';
        }
        // Check by URL as fallback
        if (window.location.pathname === '/submit-reports') {
            return 'Submit Report';
        }
        if (window.location.pathname === '/my-reports') {
            return 'My Reports';
        }
        if (window.location.pathname === '/folders') {
            return 'Report Folders';
        }
        if (url && url.includes('/submit-reports')) {
            return 'Submit Report';
        }
        if (url && url.includes('/my-reports')) {
            return 'My Reports';
        }
         if (url && url.includes('/folders')) {
            return 'Report Folders';
        }
        return 'Student Dashboard';
    };

    const pageTitle = getPageTitle();

    // Navigation items based on role
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
                { name: 'Departments', href: route('dean.departments.index'), icon: FolderIcon },
                { name: 'All Submissions', href: route('dean.submissions.index'), icon: ClipboardDocumentListIcon },
                { name: 'Reports', href: route('dean.reports.index'), icon: ChartBarIcon },
            ],
            admin: [
                { name: 'Dashboard', href: route('admin.dashboard'), icon: HomeIcon },
                { name: 'Users', href: '/admin/users', icon: UsersIcon },
                { name: 'All Tasks', href: route('admin.tasks.index'), icon: ClipboardDocumentListIcon },
                { name: 'Activity Logs', href: route('admin.activity-logs.index'), icon: ChartBarIcon },
            ],
        };

        return navigation[userRole] || navigation.student;
    };

    const currentNavigation = getNavigation();

    // Helper to check if a nav item is active
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
        if (href === route('admin.dashboard') && url === '/admin/dashboard') return true;
        if (href === '/admin/users' && url.startsWith('/admin/users')) return true;
        if (href === route('admin.tasks.index') && url.startsWith('/admin/tasks')) return true;
        if (href === route('admin.activity-logs.index') && url.startsWith('/admin/activity-logs')) return true;
        if (href === '/submit-reports' && (url === '/submit-reports' || component === 'Student/SubmitReports')) return true;
        if (href === '/my-reports' && (url === '/my-reports' || component === 'Student/MyReports')) return true;
        if (href === '/folders' && url === '/folders') return true;
        return false;
    };

    // Helper function to get role badge color
    const getRoleBadgeColor = () => {
        switch(userRole) {
            case 'admin': return 'bg-purple-100 text-purple-800';
            case 'supervisor': return 'bg-blue-100 text-blue-800';
            case 'dean': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Helper function to get role display name
    const getRoleDisplay = () => {
        switch(userRole) {
            case 'admin': return 'Administrator';
            case 'supervisor': return 'Supervisor';
            case 'dean': return 'Dean';
            default: return 'Student';
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="flex flex-col h-full">
                    {/* Sidebar Header - CENTERED with Tasks System below */}
                    <div className="p-4 border-b border-gray-700">
                        <div className="flex flex-col items-center justify-center">
                            <div className="flex items-center justify-center space-x-2">
                                <AcademicCapIcon className="h-8 w-8 text-blue-500" />
                                <span className="text-white font-bold">OJT Track</span>
                            </div>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="lg:hidden absolute right-4 top-4 text-gray-400 hover:text-white"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                        {/* ADDED: Tasks System text below OJT Track - CENTERED */}
                        <div className="mt-1 text-center">
                            <p className="text-gray-500 text-xs">Tasks System</p>
                        </div>
                    </div>

                    {/* REMOVED: User Info with Avatar and Name - DELETED THIS WHOLE SECTION */}

                    {/* Navigation Links */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {currentNavigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition ${
                                    isActive(item.href)
                                        ? 'bg-gray-800 text-white'
                                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                }`}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <item.icon className="h-5 w-5" />
                                <span className="text-sm">{item.name}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Bottom Section - ENHANCED Logged in as with avatar and role badge */}
                    <div className="p-4 border-t border-gray-700">
                        {/* ENHANCED User Info Display with Avatar */}
                        <div className="mb-3 p-3 bg-gray-800/50 rounded-lg">
                            <div className="flex items-center gap-3">
                                {/* Avatar Circle */}
                                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                                    {userInitial}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white text-sm font-medium truncate">{String(userName)}</p>
                                    <p className="text-gray-400 text-xs truncate">{String(userEmail)}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-700">
                                <p className="text-gray-400 text-xs">Logged in as</p>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor()}`}>
                                    {getRoleDisplay()}
                                </span>
                            </div>
                        </div>

                        {/* Settings Button */}
                        <Link
                            href={route('profile.edit')}
                            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition"
                        >
                            <Cog6ToothIcon className="h-5 w-5" />
                            <span className="text-sm">Settings</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:pl-64">
                {/* Top Navigation Bar */}
                <nav className="bg-white border-b border-gray-100">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                {/* Mobile menu button only */}
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                                >
                                    <Bars3Icon className="h-6 w-6" />
                                </button>

                                {/* Dynamic Page Title */}
                                <div className="ml-4 lg:ml-0">
                                    <h1 className="text-xl font-semibold text-gray-800">
                                        {pageTitle}
                                    </h1>
                                </div>
                            </div>

                            {/* User Dropdown on the right */}
                            <div className="hidden sm:flex sm:items-center sm:ml-6">
                                {/* Notification Bell with Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={handleNotificationClick}
                                        className="relative p-2 text-gray-400 hover:text-gray-500 mr-2 focus:outline-none"
                                    >
                                        <BellIcon className="h-6 w-6" />
                                        {/* Only show red dot if there are unread notifications */}
                                        {unreadCount > 0 && (
                                            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                                        )}
                                    </button>

                                    {/* Notification Dropdown */}
                                    {showNotificationDropdown && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() => setShowNotificationDropdown(false)}
                                            ></div>
                                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-20 border border-gray-200">
                                                <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                                                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                                                    {notifications.length > 0 && unreadCount > 0 && (
                                                        <button
                                                            onClick={markAllAsRead}
                                                            className="text-xs text-blue-600 hover:text-blue-700"
                                                        >
                                                            Mark all as read
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="max-h-96 overflow-y-auto">
                                                    {notifications.length === 0 ? (
                                                        <div className="p-4 text-center text-gray-500">
                                                            <BellIcon className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                                                            <p className="text-sm">No notifications</p>
                                                        </div>
                                                    ) : (
                                                        notifications.map((notification) => (
                                                            <div
                                                                key={notification.id}
                                                                className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                                                                onClick={() => markAsRead(notification.id)}
                                                            >
                                                                <p className="text-sm text-gray-800">{notification.message}</p>
                                                                <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                                {notifications.length > 0 && (
                                                    <div className="p-2 border-t border-gray-200 text-center">
                                                        <Link href="/notifications" className="text-xs text-blue-600 hover:text-blue-700">
                                                            View all notifications
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="ml-3 relative">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                                >
                                                    {String(userName)}
                                                    <svg
                                                        className="ml-2 -mr-0.5 h-4 w-4"
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
                                            <Dropdown.Link href={route('profile.edit')}>
                                                Profile
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                            >
                                                Log Out
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>

                            {/* Mobile menu button for user dropdown */}
                            <div className="-mr-2 flex items-center sm:hidden">
                                <button
                                    onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                                >
                                    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                        <path
                                            className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                        <path
                                            className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Navigation Dropdown */}
                    <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                        <div className="pt-2 pb-3 space-y-1">
                            {currentNavigation.map((item) => (
                                <ResponsiveNavLink
                                    key={item.name}
                                    href={item.href}
                                    active={isActive(item.href)}
                                >
                                    {item.name}
                                </ResponsiveNavLink>
                            ))}
                        </div>

                        <div className="pt-4 pb-1 border-t border-gray-200">
                            <div className="px-4">
                                <div className="font-medium text-base text-gray-800">
                                    {String(userName)}
                                </div>
                                <div className="font-medium text-sm text-gray-500">
                                    {String(userEmail)}
                                </div>
                            </div>

                            <div className="mt-3 space-y-1">
                                <ResponsiveNavLink href={route('profile.edit')}>
                                    Profile
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    method="post"
                                    href={route('logout')}
                                    as="button"
                                >
                                    Log Out
                                </ResponsiveNavLink>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Page Header */}
                {header && (
                    <header className="bg-white shadow">
                        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                {/* Page Content */}
                <main>
                    {children}
                </main>
            </div>
        </div>
    );
}
