'use client';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-indigo-500/30 rounded-full animate-spin border-t-indigo-500"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                    <p className="mt-6 text-gray-400 text-lg">Authenticating...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return children;
};

export default ProtectedRoute;
