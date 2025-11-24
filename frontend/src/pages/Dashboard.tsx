import { useEffect, useState } from 'react';
import type { FC } from 'react';
import client from '../api/client';
import type { RaceSchedule, DriverStanding, PredictionOutput } from '../types';
import RaceCard from '../components/RaceCard';
import Leaderboard from '../components/Leaderboard';
import { Trophy, Zap, Activity, TrendingUp, Target } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard: FC = () => {
    const [nextRace, setNextRace] = useState<RaceSchedule | null>(null);
    const [standings, setStandings] = useState<DriverStanding[]>([]);
    const [raceName, setRaceName] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [prediction, setPrediction] = useState<PredictionOutput | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [raceRes, standingsRes] = await Promise.all([
                    client.get('/next-race').catch(() => ({ data: null })),
                    client.get('/standings').catch(() => ({ data: [] }))
                ]);

                setNextRace(raceRes.data);
                setStandings(standingsRes.data.standings);
                setRaceName(standingsRes.data.race_name);

                if (raceRes.data) {
                    const leader = standingsRes.data.standings[0];
                    const leaderId = leader?.driver.driver_id || 'VER';
                    const constructorId = leader?.constructors[0]?.constructor_id || 'red_bull';

                    const predRes = await client.post('/predict', {
                        driver_id: leaderId,
                        constructor_id: constructorId,
                        grid_position: 1
                    });
                    setPrediction(predRes.data);
                }
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="min-h-screen text-white p-4 md:p-8 font-sans relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>

                <div className="f1-racing-line" style={{ top: '20%', width: '100%', animationDelay: '0s' }}></div>
                <div className="f1-racing-line" style={{ top: '40%', width: '100%', animationDelay: '1s' }}></div>
                <div className="f1-racing-line" style={{ top: '60%', width: '100%', animationDelay: '2s' }}></div>
                <div className="f1-racing-line" style={{ top: '80%', width: '100%', animationDelay: '0.5s' }}></div>

                <div className="f1-checkered-pattern" style={{ top: '10%', left: '5%', animationDelay: '0s' }}></div>
                <div className="f1-checkered-pattern" style={{ top: '30%', right: '10%', animationDelay: '1s' }}></div>
                <div className="f1-checkered-pattern" style={{ bottom: '20%', left: '15%', animationDelay: '2s' }}></div>
                <div className="f1-checkered-pattern" style={{ bottom: '10%', right: '5%', animationDelay: '1.5s' }}></div>

                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="f1-speed-line"
                        style={{
                            top: `${15 + i * 15}%`,
                            left: '0',
                            animationDelay: `${i * 0.3}s`
                        }}
                    ></div>
                ))}

                <svg className="absolute inset-0 w-full h-full opacity-20" style={{ transform: 'scale(1.5) rotate(-10deg)' }}>
                    <path className="f1-track-path" d="M100,100 C300,100 300,300 500,300 S700,100 900,100 S1100,300 1300,300 S1500,100 1700,100" />
                </svg>

                <div className="f1-car-dot" style={{ offsetPath: "path('M100,100 C300,100 300,300 500,300 S700,100 900,100 S1100,300 1300,300 S1500,100 1700,100')" }}></div>
                <div className="f1-car-dot" style={{ offsetPath: "path('M100,100 C300,100 300,300 500,300 S700,100 900,100 S1100,300 1300,300 S1500,100 1700,100')", animationDelay: '-2s' }}></div>
                <div className="f1-car-dot" style={{ offsetPath: "path('M100,100 C300,100 300,300 500,300 S700,100 900,100 S1100,300 1300,300 S1500,100 1700,100')", animationDelay: '-4s' }}></div>
                <div className="f1-car-dot" style={{ offsetPath: "path('M100,100 C300,100 300,300 500,300 S700,100 900,100 S1100,300 1300,300 S1500,100 1700,100')", animationDelay: '-6s' }}></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row items-center justify-between mb-12 pb-6 border-b border-white/10"
                >
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                        <motion.div
                            className="bg-gradient-to-br from-red-600 to-red-800 p-3 rounded-xl shadow-lg"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 400 }}
                        >
                            <Zap className="w-8 h-8 text-white" />
                        </motion.div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
                                F1<span className="text-gradient">PREDICTOR</span>
                            </h1>
                            <p className="text-sm text-gray-400 mt-1">AI-Powered Race Analytics</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center space-x-2 glass-effect px-4 py-2 rounded-full">
                            <Activity className="w-4 h-4 text-green-400 animate-pulse" />
                            <span className="text-gray-300 font-medium">Live Data</span>
                        </div>
                        <div className="flex items-center space-x-2 glass-effect px-4 py-2 rounded-full">
                            <Trophy className="w-4 h-4 text-yellow-400" />
                            <span className="text-gray-300 font-medium">2025 Season</span>
                        </div>
                    </div>
                </motion.header>

                <main className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="h-1 w-12 bg-gradient-to-r from-red-600 to-transparent rounded-full"></div>
                                <h2 className="text-2xl font-bold flex items-center">
                                    <Trophy className="w-6 h-6 mr-2 text-yellow-400" />
                                    Next Race
                                </h2>
                            </div>
                            <RaceCard race={nextRace} loading={loading} />
                        </motion.section>

                        {prediction && (
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="relative overflow-hidden rounded-2xl p-[2px] card-hover-effect"
                                style={{
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)'
                                }}
                            >
                                <div className="bg-gray-900 rounded-2xl p-8 h-full">
                                    <div className="flex items-center space-x-3 mb-6">
                                        <TrendingUp className="w-6 h-6 text-blue-400" />
                                        <div>
                                            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                                AI Prediction
                                            </h2>
                                            <p className="text-sm text-gray-400">
                                                for {standings.find(s => s.driver.driver_id === prediction.driver_id)?.driver.given_name} {standings.find(s => s.driver.driver_id === prediction.driver_id)?.driver.family_name.toUpperCase() || prediction.driver_id}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="glass-effect rounded-xl p-6 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
                                            <div className="relative">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <Target className="w-4 h-4 text-blue-400" />
                                                    <p className="text-gray-400 text-sm font-medium uppercase tracking-wide">Win Probability</p>
                                                </div>
                                                <p className="text-5xl font-black text-white mb-1">
                                                    {(prediction.win_probability * 100).toFixed(1)}
                                                    <span className="text-2xl text-blue-400">%</span>
                                                </p>
                                                <div className="w-full bg-gray-800 rounded-full h-2 mt-3">
                                                    <motion.div
                                                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${prediction.win_probability * 100}%` }}
                                                        transition={{ duration: 1, delay: 0.5 }}
                                                    ></motion.div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="glass-effect rounded-xl p-6 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>
                                            <div className="relative">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <Trophy className="w-4 h-4 text-purple-400" />
                                                    <p className="text-gray-400 text-sm font-medium uppercase tracking-wide">Predicted Position</p>
                                                </div>
                                                <p className="text-5xl font-black text-white">
                                                    P<span className="text-gradient">{prediction.predicted_position}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-start space-x-2 text-xs text-gray-500 glass-effect p-4 rounded-lg">
                                        <Activity className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                        <p>Based on historical performance, grid position, and circuit characteristics using advanced machine learning algorithms.</p>
                                    </div>
                                </div>
                            </motion.section>
                        )}
                    </div>

                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Leaderboard standings={standings} loading={loading} raceName={raceName} />
                    </motion.section>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
