import { useMedicationLogs } from '../hooks/useMedications';
import StatsCard from './StatsCard';
import CalendarWidget from './CalendarWidget';
import { Mail, Bell, Calendar as CalendarIcon, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { format, subDays } from 'date-fns';

export default function CaretakerDashboard() {
    const { todayLogs, allLogs } = useMedicationLogs();

    // Mock adherence calculation
    // default to empty array
    const safeTodayLogs = todayLogs || [];
    const safeAllLogs = allLogs || [];

    const totalLogs = safeAllLogs.length || 0;
    const takenLogs = safeAllLogs.filter((l: any) => l.status === 'taken').length || 0;
    const adherenceRate = totalLogs > 0 ? Math.round((takenLogs / totalLogs) * 100) : 0;

    const missedMonth = safeAllLogs.filter((l: any) =>
        l.status === 'missed' &&
        new Date(l.date).getMonth() === new Date().getMonth()
    ).length || 0;

    const takenWeek = safeAllLogs.filter((l: any) =>
        l.status === 'taken' &&
        new Date(l.date) > subDays(new Date(), 7)
    ).length || 0;

    return (
        <div className="space-y-8">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-400 rounded-3xl p-8 text-white shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-xl">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold mb-1">Caretaker Dashboard</h1>
                        <p className="opacity-90 text-lg">Monitoring medication adherence</p>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatsCard
                    title="Adherence Rate"
                    value={`${adherenceRate}%`}
                    subtext="Overall compliance"
                    color="green"
                />
                <StatsCard
                    title="Current Streak"
                    value="5"
                    subtext="Days in a row"
                    color="blue"
                />
                <StatsCard
                    title="Missed This Month"
                    value={missedMonth}
                    subtext="Needs attention"
                    color="orange"
                />
                <StatsCard
                    title="Taken This Week"
                    value={takenWeek}
                    subtext="Doses administered"
                    color="purple"
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Today's Status */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                            <CalendarIcon className="mr-2 h-5 w-5 text-emerald-600" />
                            Today's Status
                        </h2>
                        {safeTodayLogs.length === 0 ? (
                            <p className="text-gray-500">No activity recorded for today yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {safeTodayLogs.map(log => (
                                    <div key={log.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <span className="font-medium text-gray-700">Medication Log ID: {log.medication_id.substring(0, 8)}...</span>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${log.status === 'taken' ? 'bg-green-100 text-green-700' :
                                            log.status === 'skipped' ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-600'
                                            }`}>
                                            {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Activity Feed */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                            <Clock className="mr-2 h-5 w-5 text-blue-600" />
                            Recent Activity
                        </h2>
                        <div className="space-y-6">
                            {/* Mock Data for visual - simpler than fetching everything */}
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="flex items-start gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                                    <div className={`mt-1 p-2 rounded-full ${i === 2 ? 'bg-red-100' : 'bg-green-100'}`}>
                                        {i === 2 ? <AlertCircle className="w-5 h-5 text-red-600" /> : <CheckCircle className="w-5 h-5 text-green-600" />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{i === 2 ? 'Missed Evening Dose' : 'Medication Taken'}</p>
                                        <p className="text-sm text-gray-500">
                                            {format(subDays(new Date(), i), 'EEEE, MMMM d')} at {i === 2 ? '8:00 PM' : '8:30 AM'}
                                        </p>
                                    </div>
                                    <div className="ml-auto">
                                        {i !== 2 && <span className="text-xs bg-gray-100 text-gray-600 py-1 px-2 rounded">Photo Verified</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Actions */}
                <div className="space-y-6">
                    {/* Use the same calendar widget */}
                    <CalendarWidget logs={allLogs || []} />

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button className="w-full flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left text-gray-700">
                                <Mail className="w-5 h-5 mr-3 text-gray-400" />
                                Send Reminder Email
                            </button>
                            <button className="w-full flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left text-gray-700">
                                <Bell className="w-5 h-5 mr-3 text-gray-400" />
                                Configure Notifications
                            </button>
                            <button className="w-full flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left text-gray-700">
                                <CalendarIcon className="w-5 h-5 mr-3 text-gray-400" />
                                View Full Calendar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
