import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, Pill } from 'lucide-react';

export default function Layout() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                            <Pill className="h-8 w-8" />
                            <span>MedCare</span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600 hidden sm:block">
                            {user?.email}
                        </span>
                        <button
                            onClick={handleSignOut}
                            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                            title="Sign Out"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex flex-1">
                {/* Sidebar for Desktop - kept simple for now */}
                <aside className="w-64 bg-white border-r hidden md:block">
                    <nav className="p-4 space-y-2">
                        <Link
                            to="/"
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                        >
                            <Home className="h-5 w-5" />
                            <span>Dashboard</span>
                        </Link>
                        <Link
                            to="/medications"
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                        >
                            <Pill className="h-5 w-5" />
                            <span>Medications</span>
                        </Link>
                        {/* <Link
              to="/settings"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link> */}
                    </nav>
                </aside>

                <main className="flex-1 p-4 sm:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
