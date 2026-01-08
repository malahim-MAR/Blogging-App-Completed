'use client';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Navbar from './Navbar';

const ClientLayout = ({ children }) => {
    const pathname = usePathname();
    const isLoginPage = pathname === '/login';

    if (isLoginPage) {
        return (
            <AuthProvider>
                <div className="min-h-screen">
                    {children}
                </div>
            </AuthProvider>
        );
    }

    return (
        <AuthProvider>
            <ProtectedRoute>
                <div className="flex min-h-screen">
                    {/* Fixed sidebar container */}
                    <div className="hidden lg:block fixed inset-y-0 left-0 z-30 w-80">
                        <Navbar />
                    </div>

                    {/* Mobile drawer toggle container */}
                    <div className="lg:hidden">
                        <Navbar />
                    </div>

                    {/* Main content with left margin */}
                    <main className="flex-1 lg:ml-80 overflow-auto">
                        {children}
                    </main>
                </div>
            </ProtectedRoute>
        </AuthProvider>
    );
};

export default ClientLayout;
