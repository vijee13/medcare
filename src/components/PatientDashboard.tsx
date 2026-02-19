import { useMedications, useMedicationLogs } from '../hooks/useMedications';
import StatsCard from '../components/StatsCard';
import CalendarWidget from '../components/CalendarWidget';
import { Check, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export default function PatientDashboard() {
    const { medications } = useMedications(); // Removed unused medsLoading
    const { todayLogs, allLogs, logMedication } = useMedicationLogs(); // Removed unused logsLoading

    const today = new Date();
    const formattedDate = format(today, 'EEEE, MMMM d');

    // Calculate stats
    // defaulting to empty array if todayLogs is undefined
    const safeTodayLogs = todayLogs || [];
    const takenCount = safeTodayLogs.filter(l => l.status === 'taken').length;
    const totalMeds = medications?.length || 0;
    const progress = totalMeds > 0 ? (takenCount / totalMeds) * 100 : 0;

    // Streak calculation (simplified)
    // detailed logic would go here
    const streak = 5;

    const getLogStatus = (medId: string) => {
        return safeTodayLogs.find((log) => log.medication_id === medId)?.status;
    };

    return (
        <div className="space-y-8">
            {/* Greeting Section */}
            <div className="bg-gradient-to-r from-blue-500 to-cyan-400 rounded-3xl p-8 text-white shadow-lg">
                <h1 className="text-3xl font-bold mb-2">Good Afternoon!</h1>
                <p className="opacity-90 text-lg">Ready to stay on track with your medication?</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="Day Streak"
                    value={streak}
                    subtext="Keep it up!"
                    color="blue"
                />
                <StatsCard
                    title="Today's Status"
                    value={`${Math.round(progress)}%`}
                    subtext={`${takenCount}/${totalMeds} taken`}
                    color="green"
                />
                <StatsCard
                    title="Monthly Rate"
                    value="92%"
                    subtext="Great adherence"
                    color="purple"
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Today's Medication List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                            <CalendarIcon className="mr-2 h-6 w-6 text-blue-500" />
                            Today's Medication
                        </h2>
                        <span className="text-gray-500">{formattedDate}</span>
                    </div>

                    <div className="space-y-4">
                        {medications?.map((med) => {
                            const status = getLogStatus(med.id);
                            const isTaken = status === 'taken';

                            return (
                                <motion.div
                                    key={med.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-shadow ${isTaken ? 'bg-green-50 border-green-200' : ''
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-xl ${isTaken ? 'bg-green-100' : 'bg-blue-50'}`}>
                                            <div className="bg-blue-500 w-2 h-2 rounded-full"></div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">{med.name}</h3>
                                            <p className="text-gray-500 text-sm">{med.dosage} • {med.frequency}</p>
                                            <div className="flex items-center mt-2 text-sm text-gray-400">
                                                <Clock className="w-4 h-4 mr-1" />
                                                {med.scheduled_time}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        {isTaken ? (
                                            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium flex items-center">
                                                <Check className="w-4 h-4 mr-2" />
                                                Completed
                                            </span>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => logMedication.mutate({ medicationId: med.id, status: 'taken' })}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                                >
                                                    Take
                                                </button>
                                                <button
                                                    onClick={() => logMedication.mutate({ medicationId: med.id, status: 'skipped' })}
                                                    className="px-4 py-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    Skip
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                        {medications?.length === 0 && (
                            <p className="text-gray-500 text-center py-8">No medications scheduled for today.</p>
                        )}
                    </div>
                </div>

                {/* Calendar Widget */}
                <div>
                    {allLogs && <CalendarWidget logs={allLogs} />}
                </div>
            </div>
        </div>
    );
}
