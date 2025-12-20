import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TripPlannerForm } from '@/components/planner/TripPlannerForm';
import { planningAPI } from '@/lib/api';
import type { Itinerary } from '@/types';

const CreateTrip = () => {
    const navigate = useNavigate();
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');

    const handlePlanTrip = async (data: any) => {
        setIsGenerating(true);
        setError('');

        try {
            // Map form data to backend API format
            const requestData = {
                destination: data.destination,
                days: parseInt(data.days),
                budget: parseFloat(data.budget) || 2000, // Default budget
                travel_style: mapBudgetToStyle(data.budgetLevel || 'medium')
            };

            console.log('Sending request:', requestData);

            // Call backend API
            const itinerary: Itinerary = await planningAPI.createItinerary(requestData);

            // Navigate to itinerary result page
            navigate('/itinerary', { state: { itinerary } });

        } catch (err: any) {
            console.error('Error generating itinerary:', err);
            setError(err.response?.data?.detail || 'Failed to generate itinerary. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    // Map budget level to travel style
    const mapBudgetToStyle = (budgetLevel: string): string => {
        const mapping: Record<string, string> = {
            'budget': 'budget',
            'medium': 'relaxation',
            'luxury': 'luxury'
        };
        return mapping[budgetLevel] || 'cultural';
    };

    return (
        <div className="container mx-auto px-4 py-20 min-h-screen flex items-center justify-center">
            <div className="w-full">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Start Your Journey</h2>
                    <p className="text-muted-foreground">Tell us your preferences and we'll create your perfect itinerary.</p>
                </div>

                {error && (
                    <div className="max-w-lg mx-auto mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
                        {error}
                    </div>
                )}

                <TripPlannerForm onPlanTrip={handlePlanTrip} isGenerating={isGenerating} />

                {isGenerating && (
                    <div className="mt-6 text-center">
                        <p className="text-muted-foreground animate-pulse">
                            ✨ AI is crafting your perfect itinerary...
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                            (First-time destinations may take a bit longer as we prepare comprehensive travel data)
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateTrip;
