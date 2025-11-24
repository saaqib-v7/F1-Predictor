import type { FC } from 'react';
import type { RaceSchedule } from '../types';
import { Calendar, MapPin, Clock, Flag } from 'lucide-react';
import { motion } from 'framer-motion';

interface RaceCardProps {
    race: RaceSchedule | null;
    loading: boolean;
}

const RaceCard: FC<RaceCardProps> = ({ race, loading }) => {
    if (loading) {
        return (
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl h-72">
                <div className="animate-shimmer absolute inset-0"></div>
                <div className="relative space-y-4">
                    <div className="h-8 bg-gray-700 rounded-lg w-3/4 animate-pulse"></div>
                    <div className="h-6 bg-gray-700 rounded-lg w-1/2 animate-pulse"></div>
                    <div className="grid grid-cols-3 gap-4 mt-8">
                        <div className="h-16 bg-gray-700 rounded-lg animate-pulse"></div>
                        <div className="h-16 bg-gray-700 rounded-lg animate-pulse"></div>
                        <div className="h-16 bg-gray-700 rounded-lg animate-pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!race) {
        return (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-12 shadow-2xl text-center border border-gray-700">
                <Flag className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <h2 className="text-3xl font-bold text-white mb-3">No Upcoming Races</h2>
                <p className="text-gray-400 text-lg">The 2025 season has concluded or schedule is unavailable.</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl shadow-2xl card-hover-effect"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/90 via-red-800/80 to-gray-900/90"></div>
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500 rounded-full blur-3xl"></div>
            </div>

            <div className="relative p-8">
                <div className="flex justify-between items-start mb-8">
                    <div className="flex-1">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <span className="inline-block bg-red-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                                Next Grand Prix
                            </span>
                            <h2 className="text-4xl md:text-5xl font-black text-white mt-2 leading-tight">
                                {race.race_name}
                            </h2>
                        </motion.div>
                    </div>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                        className="bg-gradient-to-br from-red-600 to-red-800 text-white px-5 py-3 rounded-2xl shadow-lg"
                    >
                        <div className="text-center">
                            <p className="text-xs font-medium opacity-90">Round</p>
                            <p className="text-3xl font-black">{race.round}</p>
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass-effect rounded-xl p-5 hover:bg-white/10 transition-all duration-300"
                    >
                        <div className="flex items-center space-x-3">
                            <div className="bg-red-600/30 p-2.5 rounded-lg">
                                <Calendar className="w-5 h-5 text-red-400" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">Date</p>
                                <p className="font-bold text-white text-lg">{race.date}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass-effect rounded-xl p-5 hover:bg-white/10 transition-all duration-300"
                    >
                        <div className="flex items-center space-x-3">
                            <div className="bg-red-600/30 p-2.5 rounded-lg">
                                <Clock className="w-5 h-5 text-red-400" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">Time</p>
                                <p className="font-bold text-white text-lg">{race.time}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="glass-effect rounded-xl p-5 hover:bg-white/10 transition-all duration-300 md:col-span-1 col-span-1"
                    >
                        <div className="flex items-center space-x-3">
                            <div className="bg-red-600/30 p-2.5 rounded-lg">
                                <MapPin className="w-5 h-5 text-red-400" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">Circuit</p>
                                <p className="font-bold text-white text-lg">{race.circuit_name}</p>
                                <p className="text-sm text-gray-300">{race.location}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default RaceCard;
