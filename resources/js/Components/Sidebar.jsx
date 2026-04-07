// resources/js/Components/Sidebar.jsx
import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    HomeIcon,
    DocumentIcon,
    FolderIcon,
    ChartBarIcon,
    UserCircleIcon,
    AcademicCapIcon,
    ArrowRightOnRectangleIcon,
    ClipboardDocumentListIcon,
    Cog6ToothIcon,
    BellIcon
} from '@heroicons/react/24/outline';

export default function Sidebar({ isOpen, onClose }) {
    const { auth } = usePage().props;
    const userRole = auth?.user?.role || 'student';

    const navigation = {
        student: [
            { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, color: 'text-blue-500' },
            { name: 'My Reports', href: '/my-reports', icon: DocumentIcon, color: 'text-green-500' },
            { name: 'Available Folders', href: '/folders', icon: FolderIcon, color: 'text-purple-500' },
            { name: 'My Progress', href: '/progress', icon: ChartBarIcon, color: 'text-yellow-500' },
        ],
        supervisor: [
            { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, color: 'text-blue-500' },
            { name: 'Manage Folders', href: '/folders', icon: FolderIcon, color: 'text-purple-500' },
            { name: 'Interns List', href: '/interns', icon: UserCircleIcon, color: 'text-green-500' },
            { name: 'Submissions', href: '/submissions', icon: DocumentIcon, color: 'text-yellow-500' },
            { name: 'Reports', href: '/reports', icon: ChartBarIcon, color: 'text-red-500' },
        ],
        dean: [
            { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, color: 'text-blue-500' },
            { name: 'All Tasks', href: '/all-tasks', icon: ClipboardDocumentListIcon, color: 'text-green-500' },
            { name: 'Users', href: '/users', icon: UserCircleIcon, color: 'text-purple-500' },
            { name: 'Activity Logs', href: '/activity-logs', icon: ChartBarIcon, color: 'text-yellow-500' },
        ],
        admin: [
            { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, color: 'text-blue-500' },
            { name: 'Supervisors', href: '/admin/supervisors', icon: UserCircleIcon, color: 'text-green-500' },
            { name: 'Interns', href: '/admin/users?role=student', icon: AcademicCapIcon, color: 'text-purple-500' },
            { name: 'Departments', href: '/departments', icon: FolderIcon, color: 'text-yellow-500' },
            { name: 'All Submissions', href: '/admin/reports', icon: DocumentIcon, color: 'text-red-500' },
            { name: 'Activity Logs', href: '/admin/activity-logs', icon: ChartBarIcon, color: 'text-indigo-500' },
        ],
    };

    const currentNavigation = navigation[userRole] || navigation.student;

    const handleLogout = () => {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/logout';
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = '_token';
        csrfInput.value = document.querySelector('meta[name="csrf-token"]').content;
        form.appendChild(csrfInput);
        document.body.appendChild(form);
        form.submit();
    };

    const SidebarContent = () => (
        <div className="h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col">
            {/* Logo Section */}
            <div className="p-6 border-b border-gray-700">
                <div className="flex items-center space-x-3">
                    <AcademicCapIcon className="h-10 w-10 text-blue-400" />
                    <div>
                        <h1 className="text-xl font-bold">CAST OJT System</h1>
                        <p className="text-xs text-gray-400">College of Arts, Sciences & Technology</p>
                    </div>
                </div>
            </div>

            {/* User Info */}
            <div className="p-4 border-b border-gray-700">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                            {auth?.user?.name?.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold">{auth?.user?.name}</p>
                        <p className="text-xs text-gray-400 capitalize">{userRole}</p>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {currentNavigation.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-700 group"
                        activeClassName="bg-gray-700 border-l-4 border-blue-500"
                    >
                        <item.icon className={`h-5 w-5 ${item.color} group-hover:scale-110 transition-transform`} />
                        <span className="text-sm font-medium">{item.name}</span>
                    </Link>
                ))}
            </nav>

            {/* Bottom Section */}
            <div className="p-4 border-t border-gray-700 space-y-2">
                <Link
                    href="/profile"
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition"
                >
                    <Cog6ToothIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm">Settings</span>
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-600 transition"
                >
                    <ArrowRightOnRectangleIcon className="h-5 w-5 text-red-400" />
                    <span className="text-sm">Logout</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-72 fixed inset-y-0 left-0 z-30">
                <SidebarContent />
            </div>

            {/* Mobile Sidebar */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                        onClick={onClose}
                    />
                    <div className="fixed inset-y-0 left-0 w-72 z-50 lg:hidden animate-slide-in">
                        <SidebarContent />
                    </div>
                </>
            )}
        </>
    );
}
