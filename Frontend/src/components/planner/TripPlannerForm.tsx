import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plane, Calendar as CalendarIcon, Wallet, Users } from 'lucide-react';

interface TripPlannerFormProps {
    onPlanTrip: (data: any) => void;
    isGenerating: boolean;
}

export const TripPlannerForm: React.FC<TripPlannerFormProps> = ({ onPlanTrip, isGenerating }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData);
        onPlanTrip(data);
    };

    return (
        <Card className="w-full max-w-lg mx-auto shadow-xl border-t-4 border-t-primary">
            <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                    <Plane className="h-6 w-6 text-primary" />
                    Plan Your Trip
                </CardTitle>
                <CardDescription>
                    Enter your details and let AI design your perfect itinerary.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="destination">Destination</Label>
                        <div className="relative">
                            <Input
                                id="destination"
                                name="destination"
                                placeholder="e.g., Paris, Tokyo, New York"
                                required
                                className="pl-10"
                            />
                            <MapPinIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="days">Duration (Days)</Label>
                            <div className="relative">
                                <Input
                                    id="days"
                                    name="days"
                                    type="number"
                                    min="1"
                                    max="30"
                                    defaultValue="3"
                                    placeholder="3"
                                    required
                                    className="pl-10"
                                />
                                <CalendarIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="budget">Budget (USD)</Label>
                            <div className="relative">
                                <Input
                                    id="budget"
                                    name="budget"
                                    type="number"
                                    min="100"
                                    defaultValue="2000"
                                    placeholder="2000"
                                    required
                                    className="pl-10"
                                />
                                <Wallet className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="budgetLevel">Travel Style</Label>
                        <Select name="budgetLevel" defaultValue="medium">
                            <SelectTrigger>
                                <SelectValue placeholder="Select travel style" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="budget">Budget Friendly (Backpacker)</SelectItem>
                                <SelectItem value="medium">Standard (Comfort)</SelectItem>
                                <SelectItem value="luxury">Luxury (Premium)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button type="submit" className="w-full text-lg h-12" disabled={isGenerating}>
                        {isGenerating ? (
                            <>
                                <span className="animate-spin mr-2">⏳</span>
                                Generating Your Perfect Trip...
                            </>
                        ) : (
                            'Generate Itinerary ✨'
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

function MapPinIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    )
}
