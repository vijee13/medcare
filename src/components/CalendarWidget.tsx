import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import type { MedicationLog } from '../types';

export default function CalendarWidget({ logs }: { logs: MedicationLog[] }) {
    const [selected, setSelected] = useState<Date | undefined>(new Date());

    const takenDays = logs
        .filter(log => log.status === 'taken')
        .map(log => new Date(log.date));

    const missedDays = logs
        .filter(log => log.status === 'missed' || log.status === 'skipped')
        .map(log => new Date(log.date));

    const modifiers = {
        taken: takenDays,
        missed: missedDays,
    };

    const modifiersStyles = {
        taken: { color: 'white', backgroundColor: '#22c55e' },
        missed: { color: 'white', backgroundColor: '#ef4444' },
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Medication Calendar</h3>
            <DayPicker
                mode="single"
                selected={selected}
                onSelect={setSelected}
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
                className="mx-auto"
            />
            <div className="mt-4 flex gap-4 text-sm">
                <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>Taken</div>
                <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>Missed</div>
            </div>
        </div>
    );
}
