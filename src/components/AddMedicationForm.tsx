import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMedications } from '../hooks/useMedications';
import { Plus } from 'lucide-react';

const schema = z.object({
    name: z.string().min(1, 'Medication name is required'),
    dosage: z.string().min(1, 'Dosage is required'),
    frequency: z.string().min(1, 'Frequency is required'),
    scheduled_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
    caretaker_email: z.string().email('Invalid email address').optional().or(z.literal('')),
});

type FormData = z.infer<typeof schema>;

export default function AddMedicationForm({ onSuccess }: { onSuccess?: () => void }) {
    const { addMedication } = useMedications();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = (data: FormData) => {
        addMedication.mutate({
            ...data,
            caretaker_email: data.caretaker_email || null
        }, {
            onSuccess: () => {
                reset();
                if (onSuccess) onSuccess();
            },
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Medication Name</label>
                <input
                    {...register('name')}
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    placeholder="e.g., Aspirin"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Dosage</label>
                <input
                    {...register('dosage')}
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    placeholder="e.g., 500mg"
                />
                {errors.dosage && <p className="text-red-500 text-xs mt-1">{errors.dosage.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Frequency</label>
                    <select
                        {...register('frequency')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    >
                        <option value="Daily">Daily</option>
                        <option value="Twice Daily">Twice Daily</option>
                        <option value="Weekly">Weekly</option>
                        {/* Simplified options for MVP */}
                    </select>
                    {errors.frequency && <p className="text-red-500 text-xs mt-1">{errors.frequency.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Scheduled Time</label>
                    <input
                        {...register('scheduled_time')}
                        type="time"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                    {errors.scheduled_time && <p className="text-red-500 text-xs mt-1">{errors.scheduled_time.message}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Caretaker Email (Optional)</label>
                <input
                    {...register('caretaker_email')}
                    type="email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    placeholder="caretaker@example.com"
                />
                {errors.caretaker_email && <p className="text-red-500 text-xs mt-1">{errors.caretaker_email.message}</p>}
            </div>

            <button
                type="submit"
                disabled={addMedication.isPending}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                <Plus className="mr-2 h-4 w-4" />
                {addMedication.isPending ? 'Adding...' : 'Add Medication'}
            </button>
        </form>
    );
}
