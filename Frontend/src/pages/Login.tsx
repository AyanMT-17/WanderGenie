import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Label } from '@/components/ui/label';


const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
    const navigate = useNavigate();
    const { login, isAuthenticated, loading } = useAuth();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Validating form loading

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    // Handle initial auth loading
    if (loading) {
        return null;
    }

    // Redirect if already logged in
    if (isAuthenticated) {
        return <Navigate to="/home" replace />;
    }

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        setError('');

        try {
            await login(data);
            navigate('/home');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground relative overflow-hidden">
            {/* Vintage Paper Texture Overlay */}
            <div className="absolute inset-0 -z-10 opacity-10 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]"></div>

            <div className="w-full max-w-md px-8 py-12 relative z-10 border-4 double border-border bg-card shadow-2xl skew-y-1">
                {/* Corner Ornaments */}
                <div className="absolute top-1 left-1 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
                <div className="absolute top-1 right-1 w-4 h-4 border-t-2 border-r-2 border-primary"></div>
                <div className="absolute bottom-1 left-1 w-4 h-4 border-b-2 border-l-2 border-primary"></div>
                <div className="absolute bottom-1 right-1 w-4 h-4 border-b-2 border-r-2 border-primary"></div>

                <div className="text-center mb-10">
                    <Link to="/" className="text-3xl font-victorian text-primary tracking-widest block mb-4 border-b-2 border-accent pb-4 mx-8 opacity-90">WANDER GENIE</Link>
                    <h2 className="text-5xl font-script text-foreground mt-2">Member's Login</h2>
                    <p className="text-xs font-serif tracking-[0.2em] text-muted-foreground mt-2 uppercase">Your Personal Almanac</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 px-4">
                    <div className="space-y-6">
                        <div className="group relative">
                            <Label htmlFor="email" className="block text-xs font-serif uppercase tracking-[0.2em] text-muted-foreground mb-2 ml-1">Email Address</Label>
                            <input
                                id="email"
                                type="email"
                                className="input-victorian w-full text-lg bg-transparent text-foreground placeholder:text-muted-foreground placeholder:opacity-30"
                                {...register('email')}
                                disabled={isLoading}
                            />
                            {errors.email && (
                                <p className="text-xs text-destructive mt-1 font-serif italic border border-destructive p-1">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="group relative">
                            <Label htmlFor="password" className="block text-xs font-serif uppercase tracking-[0.2em] text-muted-foreground mb-2 ml-1">Password</Label>
                            <input
                                id="password"
                                type="password"
                                className="input-victorian w-full text-lg bg-transparent text-foreground placeholder:text-muted-foreground placeholder:opacity-30"
                                {...register('password')}
                                disabled={isLoading}
                            />
                            {errors.password && (
                                <p className="text-xs text-destructive mt-1 font-serif italic border border-destructive p-1">{errors.password.message}</p>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 border-l-2 border-destructive bg-background text-destructive text-sm font-serif italic">
                            {error}
                        </div>
                    )}

                    <button type="submit" className="btn-victorian w-full mt-4" disabled={isLoading}>
                        {isLoading ? 'Verifying...' : 'Access Journal'}
                    </button>
                </form>

                <div className="mt-10 pt-6 border-t border-accent opacity-90 text-center text-sm font-serif text-muted-foreground italic">
                    <span>Not yet a member? </span>
                    <Link to="/signup" className="text-primary font-bold hover:underline decoration-double underline-offset-4">
                        Register Here
                    </Link>
                </div>
            </div>
        </div>
    );
}
