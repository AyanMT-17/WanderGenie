import { Hero } from '@/components/home/Hero';
import { Features } from '@/components/custom/Features';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { planningAPI } from '@/lib/api';
import { MapPin, Calendar, DollarSign, ArrowRight } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();
    const [itineraries, setItineraries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchItineraries();
    }, []);

    const fetchItineraries = async () => {
        try {
            const response = await planningAPI.getItineraries();
            setItineraries(response.itineraries || []);
        } catch (error) {
            console.error('Error fetching itineraries:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewItinerary = (itinerary: any) => {
        navigate('/itinerary', { state: { itinerary: itinerary.itinerary } });
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Hero />

            <Features />

            {/* Previous Itineraries Section */}
            {!loading && itineraries.length > 0 && (
                <section className="py-20 container mx-auto px-4">
                    <div className="mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Travel Adventures</h2>
                        <p className="text-muted-foreground text-lg">
                            Revisit your past itineraries and start planning your next adventure
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {itineraries.map((item) => (
                            <Card
                                key={item.id}
                                className="hover:shadow-lg transition-shadow cursor-pointer group"
                                onClick={() => handleViewItinerary(item)}
                            >
                                <CardHeader>
                                    <CardTitle className="flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5 text-primary" />
                                            <span className="line-clamp-1">{item.destination}</span>
                                        </div>
                                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            <span>{item.total_days} {item.total_days === 1 ? 'day' : 'days'}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <DollarSign className="h-4 w-4" />
                                            <span>${item.total_budget}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="capitalize">
                                            {item.travel_style}
                                        </Badge>
                                        {item.created_at && (
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(item.created_at).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            )}

            {/* Empty State */}
            {!loading && itineraries.length === 0 && (
                <section className="py-20 container mx-auto px-4 text-center">
                    <div className="max-w-md mx-auto">
                        <div className="mb-6">
                            <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <MapPin className="h-12 w-12 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">No Trips Yet</h3>
                            <p className="text-muted-foreground">
                                Start planning your first adventure with AI-powered recommendations!
                            </p>
                        </div>
                        <Button
                            size="lg"
                            onClick={() => navigate('/planner')}
                            className="shadow-lg"
                        >
                            Create Your First Trip
                        </Button>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="py-20 container mx-auto px-4 text-center">
                <div className="bg-primary/5 rounded-3xl p-12 border border-primary/10">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to start your adventure?</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                        Join thousands of travelers who are discovering the world smarter, faster, and cheaper.
                    </p>
                    <Button
                        size="lg"
                        className="h-14 px-10 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all"
                        onClick={() => navigate('/planner')}
                    >
                        Plan My Trip Free
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default Home;
