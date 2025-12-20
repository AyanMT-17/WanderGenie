import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Calendar, DollarSign, Sparkles } from 'lucide-react';
import type { Itinerary } from '@/types';

export default function ItineraryResult() {
    const location = useLocation();
    const navigate = useNavigate();
    const itinerary: Itinerary = location.state?.itinerary;

    if (!itinerary) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold mb-4">No itinerary found</h2>
                <Button onClick={() => navigate('/planner')}>Plan a Trip</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-20">
            <Button
                variant="ghost"
                onClick={() => navigate('/planner')}
                className="mb-6"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Plan Another Trip
            </Button>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
                    <Sparkles className="h-8 w-8 text-primary" />
                    Your Perfect Itinerary
                </h1>
                <div className="flex flex-wrap gap-4 text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{itinerary.destination}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{itinerary.total_days} Days</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>${itinerary.total_budget}</span>
                    </div>
                    <Badge variant="secondary">{itinerary.travel_style}</Badge>
                </div>
            </div>

            {/* Day-by-day itinerary */}
            <div className="space-y-6">
                {itinerary.days.map((day) => (
                    <Card key={day.day}>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Day {day.day}: {day.title}</span>
                                <Badge variant="outline">${day.daily_budget}</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Morning */}
                            {day.morning.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-sm text-muted-foreground mb-3">☀️ Morning</h3>
                                    <div className="space-y-3">
                                        {day.morning.map((activity, idx) => (
                                            <div key={idx} className="border-l-4 border-primary pl-4">
                                                <h4 className="font-semibold">{activity.name}</h4>
                                                <p className="text-sm text-muted-foreground">{activity.description}</p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {activity.duration} • ${activity.estimated_cost}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Afternoon */}
                            {day.afternoon.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-sm text-muted-foreground mb-3">🌤️ Afternoon</h3>
                                    <div className="space-y-3">
                                        {day.afternoon.map((activity, idx) => (
                                            <div key={idx} className="border-l-4 border-blue-500 pl-4">
                                                <h4 className="font-semibold">{activity.name}</h4>
                                                <p className="text-sm text-muted-foreground">{activity.description}</p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {activity.duration} • ${activity.estimated_cost}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Evening */}
                            {day.evening.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-sm text-muted-foreground mb-3">🌙 Evening</h3>
                                    <div className="space-y-3">
                                        {day.evening.map((activity, idx) => (
                                            <div key={idx} className="border-l-4 border-purple-500 pl-4">
                                                <h4 className="font-semibold">{activity.name}</h4>
                                                <p className="text-sm text-muted-foreground">{activity.description}</p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {activity.duration} • ${activity.estimated_cost}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Accommodation */}
                            <div className="pt-4 border-t">
                                <p className="text-sm"><span className="font-semibold">🏨 Accommodation:</span> {day.accommodation}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Transportation */}
            {itinerary.transport && itinerary.transport.length > 0 && (
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>🚗 Transportation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {itinerary.transport.map((transport, idx) => (
                            <div key={idx} className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold">{transport.type}</p>
                                    <p className="text-sm text-muted-foreground">{transport.details}</p>
                                </div>
                                <Badge variant="secondary">${transport.estimated_cost}</Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Tips */}
            {itinerary.tips && itinerary.tips.length > 0 && (
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>💡 Helpful Tips</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc list-inside space-y-2">
                            {itinerary.tips.map((tip, idx) => (
                                <li key={idx} className="text-sm text-muted-foreground">{tip}</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
