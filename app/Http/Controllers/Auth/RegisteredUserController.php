
import React, { useEffect } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        student_id: '',
        department: 'CAST',
        company: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        // Use window.location for direct form submission if Inertia fails
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('password_confirmation', data.password_confirmation);
        formData.append('student_id', data.student_id);
        formData.append('department', data.department);
        formData.append('company', data.company);

        // Try Inertia post first
        post('/register', {
            preserveState: true,
            preserveScroll: true,
            onError: (errors) => {
                console.error('Registration errors:', errors);
            },
            onSuccess: (page) => {
                console.log('Registration successful', page);
            },
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white rounded-xl shadow-2xl p-8">
                <div>
                    <div className="flex justify-center">
                        <AcademicCapIcon className="h-12 w-12 text-blue-600" />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create Account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Join CAST OJT Approval System
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={submit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Full Name *
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Enter your full name"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address *
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="you@example.com"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="student_id" className="block text-sm font-medium text-gray-700">
                                Student ID (Optional)
                            </label>
                            <input
                                id="student_id"
                                type="text"
                                value={data.student_id}
                                onChange={(e) => setData('student_id', e.target.value)}
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="e.g., CAST-CS-2024-001"
                            />
                            {errors.student_id && (
                                <p className="text-red-500 text-xs mt-1">{errors.student_id}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                                Department
                            </label>
                            <input
                                id="department"
                                value={data.department}
                                readOnly
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                            />
                            {errors.department && (
                                <p className="text-red-500 text-xs mt-1">{errors.department}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                                Company Name (Optional)
                            </label>
                            <input
                                id="company"
                                type="text"
                                value={data.company}
                                onChange={(e) => setData('company', e.target.value)}
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Enter company name"
                            />
                            {errors.company && (
                                <p className="text-red-500 text-xs mt-1">{errors.company}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password *
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Enter password (min. 8 characters)"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                                Confirm Password *
                            </label>
                            <input
                                id="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Confirm your password"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Creating account...' : 'Register'}
                        </button>
                    </div>

                    <div className="text-center">
                        <Link
                            href="/login"
                            className="text-sm text-blue-600 hover:text-blue-500"
                        >
                            Already have an account? Sign in here
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
<?php
