import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Medication, MedicationLog } from '../types';
import { useAuth } from '../context/AuthContext';

export function useMedications() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    // Fetch all medications for the current user
    const { data: medications, isLoading, error } = useQuery({
        queryKey: ['medications', user?.id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('medications')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data as Medication[];
        },
        enabled: !!user,
    });

    // Add a new medication
    const addMedication = useMutation({
        mutationFn: async (newMed: Omit<Medication, 'id' | 'created_at' | 'user_id'>) => {
            const { data, error } = await supabase
                .from('medications')
                .insert([{ ...newMed, user_id: user?.id }])
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['medications'] });
        },
    });

    // Delete a medication
    const deleteMedication = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('medications').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['medications'] });
        },
    });

    return {
        medications,
        isLoading,
        error,
        addMedication,
        deleteMedication,
    };
}

export function useMedicationLogs() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    // Fetch logs for today
    const { data: todayLogs, isLoading: logsLoading } = useQuery({
        queryKey: ['medication_logs', 'today', user?.id],
        queryFn: async () => {
            const today = new Date().toISOString().split('T')[0];
            const { data, error } = await supabase
                .from('medication_logs')
                .select('*')
                .eq('date', today);

            if (error) throw error;
            return data as MedicationLog[];
        },
        enabled: !!user,
    });

    // Log a medication as taken
    const logMedication = useMutation({
        mutationFn: async ({ medicationId, status, takenAt }: { medicationId: string, status: 'taken' | 'skipped' | 'missed', takenAt?: string }) => {
            const today = new Date().toISOString().split('T')[0];
            const { data, error } = await supabase
                .from('medication_logs')
                .upsert([
                    {
                        medication_id: medicationId,
                        user_id: user?.id,
                        status,
                        date: today,
                        taken_at: takenAt || new Date().toISOString()
                    }
                ])
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['medication_logs'] });
        }
    });

    // Fetch all logs (for history/calendar)
    const { data: allLogs } = useQuery({
        queryKey: ['medication_logs', 'all', user?.id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('medication_logs')
                .select('*');

            if (error) throw error;
            return data as MedicationLog[];
        },
        enabled: !!user,
    });

    return {
        todayLogs,
        allLogs,
        logsLoading,
        logMedication
    };
}
