"use client";
import Link from 'next/link'
import React, { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { FiLogOut } from 'react-icons/fi';

const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [isHovering, setIsHovering] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        setIsLoggingOut(true);
        const result = await logout();
        if (result.success) {
            router.push('/login');
        }
        setIsLoggingOut(false);
    };

    // Get user initials for avatar
    const getUserInitial = () => {
        if (user?.email) {
            return user.email.charAt(0).toUpperCase();
        }
        return 'A';
    };

    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

            {/* Mobile Toggle Button */}
            <div className="drawer-content flex flex-col">
                <div className="p-4 lg:hidden">
                    <label
                        htmlFor="my-drawer-2"
                        className="btn btn-ghost drawer-button"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </label>
                </div>
            </div>

            {/* Sidebar */}
            <div className="drawer-side z-30 max-h-full">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>

                <div
                    className="menu bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300 min-h-full w-80 p-0"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    {/* Sidebar Header */}
                    <div className="p-6 border-b border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <div>
                                <Link href="/" className="">
                                    <h1 className="text-xl font-bold text-white">BlogAdmin Pro</h1>
                                    <p className="text-xs text-gray-400">Content Management System</p>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="p-4 space-y-1">
                        <div className="px-3 py-2 text-xs uppercase tracking-wider text-gray-500 mb-2">
                            Content
                        </div>

                        <Link
                            href="/NewBlog"
                            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${pathname === '/NewBlog'
                                ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/30 text-white border-l-4 border-indigo-500'
                                : 'hover:bg-gray-800/50'
                                }`}
                        >
                            <div className="p-2 bg-indigo-900/30 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <span className="font-medium">New Blog</span>
                        </Link>

                        <Link
                            href="/AllBlogs"
                            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${pathname === '/AllBlogs'
                                ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/30 text-white border-l-4 border-indigo-500'
                                : 'hover:bg-gray-800/50'
                                }`}
                        >
                            <div className="p-2 bg-indigo-900/30 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <span className="font-medium">All Blogs</span>
                        </Link>
                    </div>

                    {/* Additional Navigation */}
                    <div className="p-4 space-y-1 mt-4">
                        <div className="px-3 py-2 text-xs uppercase tracking-wider text-gray-500 mb-2">
                            Settings
                        </div>

                        <Link
                            href="/Analytics"
                            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${pathname === '/Analytics'
                                ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/30 text-white border-l-4 border-indigo-500'
                                : 'hover:bg-gray-800/50'
                                }`}
                        >
                            <div className="p-2 bg-indigo-900/30 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <span className="font-medium">Analytics</span>
                        </Link>

                        <Link
                            href="/Settings"
                            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${pathname === '/Settings'
                                ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/30 text-white border-l-4 border-indigo-500'
                                : 'hover:bg-gray-800/50'
                                }`}
                        >
                            <div className="p-2 bg-indigo-900/30 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <span className="font-medium">Settings</span>
                        </Link>
                    </div>

                    {/* Profile Section */}
                    <div className="mt-auto p-4 border-t border-gray-700">
                        <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                            <div className="avatar">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex items-center justify-center">
                                    <span className="font-bold text-sm">{getUserInitial()}</span>
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-medium text-white truncate">
                                    {user?.email?.split('@')[0] || 'Admin'}
                                </div>
                                <div className="text-xs text-gray-400 truncate">
                                    {user?.email || 'admin@example.com'}
                                </div>
                            </div>
                            <div className="ml-auto">
                                <button
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className="btn btn-ghost btn-sm hover:bg-red-500/20 hover:text-red-400 transition-all duration-300"
                                    title="Logout"
                                >
                                    {isLoggingOut ? (
                                        <div className="w-5 h-5 border-2 border-gray-400/30 rounded-full animate-spin border-t-gray-400"></div>
                                    ) : (
                                        <FiLogOut className="h-5 w-5 text-gray-400 hover:text-red-400" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Animated Gradient Accent */}
                    {isHovering && (
                        <div className="absolute top-0 right-0 w-1 h-full">
                            <div className="h-full bg-gradient-to-b from-indigo-500 to-purple-500 animate-pulse"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Navbar