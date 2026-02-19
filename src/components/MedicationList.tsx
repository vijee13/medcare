import { useMedications } from '../hooks/useMedications';
import { Trash2, Clock, Calendar } from 'lucide-react';

export default function MedicationList() {
    const { medications, isLoading, error, deleteMedication } = useMedications();

    if (isLoading) return <p className="text-gray-500">Loading medications...</p>;
    if (error) return <p className="text-red-500">Error loading medications</p>;
    if (!medications || medications.length === 0) return <p className="text-gray-500 italic">No medications added yet.</p>;

    return (
        <div className="space-y-4">
            {medications.map((med) => (
                <div key={med.id} className="bg-white border rounded-lg p-4 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{med.name} <span className="text-sm font-normal text-gray-500">({med.dosage})</span></h3>
                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {med.frequency}
                            </span>
                            <span className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {med.scheduled_time}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            if (window.confirm('Are you sure you want to delete this medication?')) {
                                deleteMedication.mutate(med.id);
                            }
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete Medication"
                    >
                        <Trash2 className="h-5 w-5" />
                    </button>
                </div>
            ))}
        </div>
    );
}
