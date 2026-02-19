import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import Welcome from '../components/Welcome';
import PatientDashboard from '../components/PatientDashboard';
import CaretakerDashboard from '../components/CaretakerDashboard';
import { ArrowLeftRight } from 'lucide-react';
import { useState } from 'react';

export default function Dashboard() {
    const { profile, user } = useAuth();
    const [switching, setSwitching] = useState(false);

    // If no profile or role yet, show welcome
    if (!profile || !profile.role) {
        return <Welcome onRoleSelect={() => window.location.reload()} />;
    }

    const handleSwitchRole = async () => {
        if (!user) return;
        setSwitching(true);
        const newRole = profile.role === 'patient' ? 'caretaker' : 'patient';

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ role: newRole })
                .eq('id', user.id);

            if (error) throw error;
            window.location.reload();
        } catch (e) {
            console.error(e);
        } finally {
            setSwitching(false);
        }
    };

    return (
        <div className="relative">
            {/* Role Switcher - Absolute positioned or in a nice header place */}
            <div className="flex justify-end mb-6">
                <button
                    onClick={handleSwitchRole}
                    disabled={switching}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
                >
                    <ArrowLeftRight className="w-4 h-4" />
                    Switch to {profile.role === 'patient' ? 'Caretaker' : 'Patient'} View
                </button>
            </div>

            {profile.role === 'patient' ? <PatientDashboard /> : <CaretakerDashboard />}
        </div>
    );
}
