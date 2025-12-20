import { Zap, Globe, Heart, Shield } from 'lucide-react';

export const Features = () => {
    const features = [
        {
            icon: <Zap className="h-8 w-8 text-yellow-500" />,
            title: "Instant Itineraries",
            description: "Get a complete day-by-day plan in seconds, powered by advanced AI."
        },
        {
            icon: <Globe className="h-8 w-8 text-blue-500" />,
            title: "Global Coverage",
            description: "From hidden gems to popular landmarks, we cover destinations worldwide."
        },
        {
            icon: <Heart className="h-8 w-8 text-red-500" />,
            title: "Personalized for you",
            description: "Your budget, your style, your pace. We tailor everything to your preferences."
        },
        {
            icon: <Shield className="h-8 w-8 text-green-500" />,
            title: "Smart Budgeting",
            description: "Transparent cost estimates for hotels, food, and activities."
        }
    ];

    return (
        <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold mb-4">Why Plan with WanderGenie?</h2>
                    <p className="text-muted-foreground text-lg">Experience the future of travel planning with features designed to make your journey seamless.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, idx) => (
                        <div key={idx} className="bg-card p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                            <div className="mb-4 bg-primary/10 w-fit p-3 rounded-lg">
                                {feature.icon}
                            </div>
                            <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
