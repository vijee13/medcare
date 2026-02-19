import { motion } from 'framer-motion';

export default function StatsCard({ title, value, subtext, color }: { title: string, value: string | number, subtext: string, color: 'blue' | 'green' | 'purple' | 'orange' }) {
    const colorClasses = {
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        purple: 'bg-purple-500',
        orange: 'bg-orange-500',
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`${colorClasses[color]} rounded-2xl p-6 text-white shadow-lg`}
        >
            <h3 className="text-4xl font-bold mb-2">{value}</h3>
            <p className="text-blue-100 font-medium">{title}</p>
            <p className="text-sm opacity-80 mt-1">{subtext}</p>
        </motion.div>
    );
}
