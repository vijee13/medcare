import AddMedicationForm from '../components/AddMedicationForm';
import MedicationList from '../components/MedicationList';

export default function Medications() {
    return (
        <div className="space-y-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                    <div className="px-4 sm:px-0">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Add New Medication</h3>
                        <p className="mt-1 text-sm text-gray-600">
                            Enter the details of the medication you want to track.
                        </p>
                    </div>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2">
                    <div className="shadow sm:rounded-md sm:overflow-hidden bg-white p-6">
                        <AddMedicationForm />
                    </div>
                </div>
            </div>

            <div className="hidden sm:block" aria-hidden="true">
                <div className="py-5">
                    <div className="border-t border-gray-200" />
                </div>
            </div>

            <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                    <div className="px-4 sm:px-0">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Your Medications</h3>
                        <p className="mt-1 text-sm text-gray-600">
                            List of all active medications.
                        </p>
                    </div>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2">
                    <MedicationList />
                </div>
            </div>
        </div>
    );
}
