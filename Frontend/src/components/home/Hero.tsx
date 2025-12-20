
import { Button } from '@/components/ui/button';
import { MapPin, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Hero: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
            {/* Background gradients */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-100/50 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl opacity-50 -translate-x-1/3 translate-y-1/3" />
            </div>

            <div className="container relative z-10 px-4 py-12 mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-sm font-medium text-green-700 bg-green-100 rounded-full animate-fade-in-up">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    AI-Powered Travel Planning
                </div>

                <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-foreground sm:text-7xl">
                    Discover Your Next <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                        Great Adventure
                    </span>
                </h1>

                <p className="max-w-2xl mx-auto mb-10 text-lg text-muted-foreground">
                    Plan personalized trips in seconds with our AI using real-time travel data.
                    Curated itineraries, budget breakdowns, and local gems tailored just for you.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-100">
                    <Button
                        size="lg"
                        className="h-12 px-8 text-lg shadow-lg hover:shadow-xl transition-all"
                        onClick={() => navigate('/planner')}
                    >
                        Start Planning Now
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        className="h-12 px-8 text-lg"
                        onClick={() => navigate('/planner')}
                    >
                        View Sample Itineraries
                    </Button>
                </div>

                {/* Floating cards interaction preview */}
                <div className="mt-20 relative max-w-5xl mx-auto hidden md:block">
                    <div className="absolute -left-12 top-0 bg-card p-4 rounded-xl shadow-xl border rotate-[-6deg] animate-float">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600"><MapPin size={20} /></div>
                            <div>
                                <p className="font-bold text-sm">Shimla, India</p>
                                <p className="text-xs text-muted-foreground">3 Day Budget Trip</p>
                            </div>
                        </div>
                        <div className="h-2 w-24 bg-muted rounded-full mb-1" />
                        <div className="h-2 w-16 bg-muted rounded-full" />
                    </div>

                    <div className="absolute -right-8 bottom-12 bg-card p-4 rounded-xl shadow-xl border rotate-[6deg] animate-float delay-700">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600"><Calendar size={20} /></div>
                            <div>
                                <p className="font-bold text-sm">Best Time</p>
                                <p className="text-xs text-muted-foreground">March - June</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
