export interface User {
    id: string;
    email: string;
}

export interface Medication {
    id: string;
    user_id: string;
    name: string;
    dosage: string;
    frequency: string;
    scheduled_time: string;
    caretaker_email: string | null;
    created_at: string;
}

export interface MedicationLog {
    id: string;
    medication_id: string;
    user_id: string;
    taken_at: string | null;
    status: 'taken' | 'skipped' | 'missed';
    date: string;
    created_at: string;
}

export interface Profile {
    id: string;
    role: 'patient' | 'caretaker';
    caretaker_email: string | null;
    notification_preferences: {
        email: boolean;
        missed_alerts: boolean;
        alert_threshold: string;
        daily_reminder: string;
    };
}
