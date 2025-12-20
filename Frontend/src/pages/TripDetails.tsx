import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { ItineraryResult } from '@/components/planner/ItineraryResult';
import { Button } from '@/components/ui/button';

const TripDetails = () => {
    // const { id } = useParams(); // Unused for now as we use state
    const location = useLocation();
    const [trip, setTrip] = useState<any>(null);

    useEffect(() => {
        if (location.state?.trip) {
            setTrip(location.state.trip);
        }
        // Else could fetch from API by ID
    }, [location.state]);

    if (!trip) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold mb-4">Trip Not Found</h2>
                <p className="text-muted-foreground mb-8">We couldn't find the trip details. Try creating a new one.</p>
                <Link to="/planner">
                    <Button>Plan a New Trip</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <ItineraryResult
                destination={trip.destination}
                days={trip.days}
                itinerary={trip.itinerary}
            />

            <div className="mt-12 text-center">
                <Link to="/chat">
                    <Button variant="secondary" className="mr-4">Ask AI Assistant</Button>
                </Link>
                <Link to="/planner">
                    <Button variant="outline">Plan Another Trip</Button>
                </Link>
            </div>
        </div>
    );
};

export default TripDetails;
