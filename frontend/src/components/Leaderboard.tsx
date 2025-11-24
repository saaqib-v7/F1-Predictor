import type { FC } from 'react';
import type { DriverStanding } from '../types';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, ChevronRight } from 'lucide-react';

interface LeaderboardProps {
    standings: DriverStanding[];
    loading: boolean;
    raceName?: string;
}

const getDriverCode = (code: string): string => {
    return code.toUpperCase();
};

const getPodiumColor = (position: number): string => {
    switch (position) {
        case 1:
            return 'from-yellow-400 to-yellow-600';
        case 2:
            return 'from-gray-300 to-gray-500';
        case 3:
            return 'from-orange-400 to-orange-600';
        default:
            return 'from-gray-600 to-gray-700';
    }
};

const getPodiumIcon = (position: number) => {
    switch (position) {
        case 1:
            return <Trophy className="w-5 h-5" />;
        case 2:
            return <Medal className="w-5 h-5" />;
        case 3:
            return <Award className="w-5 h-5" />;
        default:
            return null;
    }
};



const Leaderboard: FC<LeaderboardProps> = ({ standings, loading, raceName }) => {
    if (loading) {
        return (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl">
                <div className="h-8 bg-gray-700 rounded-lg w-1/2 mb-6 animate-pulse"></div>
                <div className="flex space-x-4 overflow-hidden">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="min-w-[280px] h-80 bg-gray-700 rounded-2xl animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-700">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="h-1 w-12 bg-gradient-to-r from-yellow-400 to-transparent rounded-full"></div>
                    <h3 className="text-2xl font-bold text-white flex items-center">
                        <Trophy className="w-6 h-6 mr-2 text-yellow-400" />
                        {raceName ? `Results for ${raceName}` : 'Driver Standings'}
                    </h3>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                    <span>Scroll</span>
                    <ChevronRight className="w-4 h-4 animate-pulse" />
                </div>
            </div>

            <div className="horizontal-scroll flex space-x-4 pb-4">
                {standings.map((standing, index) => {
                    const isPodium = standing.position <= 3;

                    return (
                        <motion.div
                            key={standing.driver.driver_id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className={`
                                min-w-[280px] relative overflow-hidden rounded-2xl transition-all duration-300
                                ${isPodium
                                    ? 'bg-gradient-to-br p-[2px] card-hover-effect'
                                    : 'glass-effect hover:bg-white/10 card-hover-effect'
                                }
                            `}
                            style={isPodium ? {
                                background: `linear-gradient(135deg, ${getPodiumColor(standing.position).replace('from-', '').replace(' to-', ', ')})`
                            } : {}}
                        >
                            <div className={`
                                h-full rounded-2xl overflow-hidden
                                ${isPodium ? 'bg-gray-900' : ''}
                            `}>
                                <div className="relative h-48 overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className={`
                                            w-32 h-32 rounded-full flex items-center justify-center text-4xl font-black shadow-2xl
                                            ${isPodium ? 'bg-gradient-to-br from-white/20 to-white/5 text-white border-2 border-white/20' : 'bg-gradient-to-br from-gray-700 to-gray-800 text-gray-400'}
                                        `}>
                                            {standing.driver.given_name.charAt(0)}{standing.driver.family_name.charAt(0)}
                                        </div>
                                    </div>

                                    <div className="absolute top-4 left-4">
                                        <div className={`
                                            flex items-center justify-center w-12 h-12 rounded-xl font-black text-lg shadow-lg
                                            ${isPodium
                                                ? `bg-gradient-to-br ${getPodiumColor(standing.position)} text-white`
                                                : 'bg-gray-700 text-gray-300'
                                            }
                                        `}>
                                            {isPodium ? getPodiumIcon(standing.position) : standing.position}
                                        </div>
                                    </div>

                                    {isPodium && (
                                        <div className="absolute top-4 right-4">
                                            <div className="bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                                                <span className="text-yellow-400 text-xs font-bold">PODIUM</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="p-5">
                                    <div className="mb-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className={`
                                                font-black text-xl truncate
                                                ${isPodium ? 'text-white' : 'text-gray-200'}
                                            `}>
                                                {standing.driver.family_name.toUpperCase()}
                                            </h4>
                                            <span className={`
                                                text-xs px-3 py-1 rounded-full font-bold
                                                ${isPodium
                                                    ? 'bg-yellow-400/20 text-yellow-400'
                                                    : 'bg-gray-700 text-gray-400'
                                                }
                                            `}>
                                                {getDriverCode(standing.driver.code)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-400">
                                            {standing.driver.given_name}
                                        </p>
                                    </div>

                                    <div className="glass-effect rounded-lg p-3 mb-3">
                                        <p className="text-xs text-gray-400 mb-1">Team</p>
                                        <p className="text-sm font-semibold text-white truncate">
                                            {standing.constructors[0]?.name || 'Unknown Team'}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-gray-400 mb-1">Points</p>
                                            <div className={`
                                                inline-block px-4 py-2 rounded-lg font-black text-2xl
                                                ${isPodium
                                                    ? `bg-gradient-to-br ${getPodiumColor(standing.position)} text-white shadow-lg`
                                                    : 'bg-gray-700 text-red-400'
                                                }
                                            `}>
                                                {standing.points}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {standings.length === 0 && !loading && (
                <div className="text-center py-12">
                    <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                    <p className="text-gray-400 text-lg">No standings available</p>
                </div>
            )}
        </div>
    );
};

export default Leaderboard;
