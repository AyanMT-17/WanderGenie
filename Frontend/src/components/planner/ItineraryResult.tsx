
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Hotel, Utensils } from 'lucide-react';

interface ItineraryDay {
    day: number;
    activities: {
        time: string;
        title: string;
        description: string;
        type: 'sightseeing' | 'food' | 'transport' | 'hotel';
        image?: string;
    }[];
}

interface ItineraryResultProps {
    destination: string;
    days: number;
    itinerary: ItineraryDay[];
}

export const ItineraryResult: React.FC<ItineraryResultProps> = ({ destination, days, itinerary }) => {
    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in-up">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold">Your Trip to {destination}</h2>
                <p className="text-muted-foreground">A {days}-day itinerary tailored just for you</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Itinerary Timeline */}
                <div className="md:col-span-2 space-y-6">
                    {itinerary.map((dayItem) => (
                        <Card key={dayItem.day} className="border-l-4 border-l-primary/50 overflow-hidden">
                            <CardHeader className="bg-muted/50 pb-3">
                                <CardTitle className="text-lg font-semibold flex items-center justify-between">
                                    <span>Day {dayItem.day}</span>
                                    <Badge variant="outline">4 Activities</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="relative border-l border-muted ml-3 space-y-8 pb-4">
                                    {dayItem.activities.map((activity, idx) => (
                                        <div key={idx} className="relative pl-8">
                                            {/* Timeline dot */}
                                            <span className={`absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full ${getActivityColor(activity.type)} ring-4 ring-background`} />

                                            <div className="flex flex-col sm:flex-row gap-4">
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center text-xs text-muted-foreground gap-2">
                                                        <Clock size={12} /> {activity.time}
                                                        <Badge variant="secondary" className="text-[10px] h-5">{activity.type}</Badge>
                                                    </div>
                                                    <h4 className="font-semibold">{activity.title}</h4>
                                                    <p className="text-sm text-muted-foreground text-pretty">{activity.description}</p>
                                                </div>
                                                {activity.image && (
                                                    <img
                                                        src={activity.image}
                                                        alt={activity.title}
                                                        className="w-24 h-24 rounded-md object-cover flex-shrink-0 bg-muted"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Sidebar: RAG Context / Real Data */}
                <div className="space-y-6">
                    <Card className="bg-primary/5 border-primary/20 sticky top-24">
                        <CardHeader>
                            <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Hotel size={16} /> Where to Stay
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Mock Real Hotels */}
                            <div className="p-3 bg-background rounded-lg border shadow-sm text-sm">
                                <div className="font-medium flex justify-between">
                                    <span>Grand Hotel</span>
                                    <span className="text-green-600 font-bold">$120</span>
                                </div>
                                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                    <MapPin size={10} /> City Center • 4.5 ★
                                </div>
                            </div>
                            <div className="p-3 bg-background rounded-lg border shadow-sm text-sm">
                                <div className="font-medium flex justify-between">
                                    <span>Cozy Stay B&B</span>
                                    <span className="text-green-600 font-bold">$85</span>
                                </div>
                                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                    <MapPin size={10} /> 2km from Mall Road • 4.2 ★
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-dashed">
                        <CardHeader>
                            <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Utensils size={16} /> Local Delicacies
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                            <p><span className="font-medium">Dish 1:</span> Description of local food.</p>
                            <p><span className="font-medium">Dish 2:</span> Another popular dish.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

function getActivityColor(type: string) {
    switch (type) {
        case 'sightseeing': return 'bg-blue-500';
        case 'food': return 'bg-orange-500';
        case 'transport': return 'bg-gray-500';
        case 'hotel': return 'bg-indigo-500';
        default: return 'bg-primary';
    }
}
