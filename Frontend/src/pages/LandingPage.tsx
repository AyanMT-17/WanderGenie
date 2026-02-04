import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';


export default function LandingPage() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return null; // Or a minimalist loader
    }

    if (isAuthenticated) {
        return <Navigate to="/home" replace />;
    }

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-x-hidden bg-background text-foreground bg-[url('https://www.transparenttextures.com/patterns/antique-parchment-pattern.png')]">

            {/* Background Texture Overlay - Darken/Tint */}
            <div className="absolute inset-0 bg-accent/5 mix-blend-multiply pointer-events-none"></div>

            {/* Corner Frames Fixed to Viewport */}
            <div className="fixed top-0 left-0 w-32 h-32 border-t-8 border-l-8 border-primary/20 z-0 pointer-events-none"></div>
            <div className="fixed top-0 right-0 w-32 h-32 border-t-8 border-r-8 border-primary/20 z-0 pointer-events-none"></div>
            <div className="fixed bottom-0 left-0 w-32 h-32 border-b-8 border-l-8 border-primary/20 z-0 pointer-events-none"></div>
            <div className="fixed bottom-0 right-0 w-32 h-32 border-b-8 border-r-8 border-primary/20 z-0 pointer-events-none"></div>

            {/* Navigation */}
            <nav className="absolute top-0 w-full p-8 md:p-12 flex justify-between items-center z-30">
                <div className="hidden md:block"></div> {/* Spacer */}
                <div className="space-x-12 hidden md:flex font-serif italic text-lg text-foreground/80 tracking-wider">
                    <Link to="/login" className="hover:text-primary transition-colors hover:underline decoration-1 underline-offset-4">Login</Link>
                    <Link to="/signup" className="hover:text-primary transition-colors hover:underline decoration-1 underline-offset-4">Sign Up</Link>
                </div>
                <Link to="/login" className="md:hidden font-serif italic text-foreground hover:text-primary">Login</Link>
            </nav>

            {/* Main Content Frame */}
            <main className="z-10 relative mt-20 p-2 md:p-12 mb-20 max-w-4xl mx-auto">
                <div className="frame-border p-12 md:p-24 text-center bg-card/95 backdrop-blur-sm relative">

                    {/* Inner Decorative Border */}
                    <div className="absolute inset-3 border border-dashed border-foreground/30 pointer-events-none"></div>

                    {/* Ornate Header */}
                    <div className="mb-8">
                        <span className="block text-xs md:text-sm font-serif tracking-[0.5em] text-accent-foreground/80 uppercase mb-4 border-b border-accent/30 pb-2 mx-auto w-1/2">
                            Est. MMXXIV
                        </span>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-victorian text-primary mb-2 drop-shadow-sm">
                            Wander Genie
                        </h1>
                        <p className="font-script text-3xl md:text-5xl text-foreground/80 -mt-2 opacity-90">
                            The Grand Expedition
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center justify-center gap-4 my-8 opacity-70">
                        <div className="h-[1px] w-12 bg-accent"></div>
                        <div className="w-2 h-2 rotate-45 bg-primary"></div>
                        <div className="h-[1px] w-12 bg-accent"></div>
                    </div>

                    <p className="text-lg md:text-xl font-serif text-muted-foreground mb-10 leading-relaxed max-w-lg mx-auto">
                        "A compendium of the world's most exquisite destinations, curated for the refined traveler seeking elegance and adventure."
                    </p>

                    <div className="flex flex-col md:flex-row justify-center gap-8 mt-4">
                        <Link to="/signup">
                            <button className="btn-victorian">
                                Begin Journey
                            </button>
                        </Link>
                    </div>

                    <div className="mt-12 pt-6 border-t border-accent/20">
                        <p className="text-xs font-serif uppercase tracking-widest text-muted-foreground/60">
                            London • Paris • Constantinople • New York
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
