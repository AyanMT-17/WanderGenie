import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Label } from '@/components/ui/label';


const signupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function Signup() {
    const navigate = useNavigate();
    const { register: registerUser, isAuthenticated, loading } = useAuth();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
    });

    // Handle initial auth loading
    if (loading) {
        return null;
    }

    // Redirect if already logged in
    if (isAuthenticated) {
        return <Navigate to="/home" replace />;
    }

    const onSubmit = async (data: SignupFormData) => {
        setIsLoading(true);
        setError('');

        try {
            const { confirmPassword, ...registerData } = data;
            await registerUser(registerData);
            navigate('/home');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground relative overflow-hidden">
            {/* Vintage Paper Texture Overlay */}
            <div className="absolute inset-0 -z-10 opacity-10 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]"></div>

            <div className="w-full max-w-md px-8 py-10 relative z-10 border-4 double border-border bg-card shadow-2xl -skew-y-1">
                {/* Corner Ornaments */}
                <div className="absolute top-1 left-1 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
                <div className="absolute top-1 right-1 w-4 h-4 border-t-2 border-r-2 border-primary"></div>
                <div className="absolute bottom-1 left-1 w-4 h-4 border-b-2 border-l-2 border-primary"></div>
                <div className="absolute bottom-1 right-1 w-4 h-4 border-b-2 border-r-2 border-primary"></div>

                <div className="text-center mb-8">
                    <Link to="/" className="text-2xl font-victorian text-primary tracking-widest block mb-4 border-b-2 border-accent pb-4 mx-8 opacity-90">WANDER GENIE</Link>
                    <h2 className="text-4xl font-script text-foreground mt-2">New Membership</h2>
                    <p className="text-xs font-serif tracking-[0.2em] text-muted-foreground mt-2 uppercase">Join the Expedition</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-4">
                    <div className="space-y-4">
                        <div className="group relative">
                            <Label htmlFor="name" className="block text-xs font-serif uppercase tracking-[0.2em] text-muted-foreground mb-1 ml-1">Full Name</Label>
                            <input
                                id="name"
                                type="text"
                                className="input-victorian w-full text-lg bg-transparent text-foreground placeholder:text-muted-foreground placeholder:opacity-30"
                                {...register('name')}
                                disabled={isLoading}
                            />
                            {errors.name && (
                                <p className="text-xs text-destructive mt-1 font-serif italic border border-destructive p-1">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="group relative">
                            <Label htmlFor="email" className="block text-xs font-serif uppercase tracking-[0.2em] text-muted-foreground mb-1 ml-1">Email</Label>
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
                            <Label htmlFor="password" className="block text-xs font-serif uppercase tracking-[0.2em] text-muted-foreground mb-1 ml-1">Password</Label>
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

                        <div className="group relative">
                            <Label htmlFor="confirmPassword" className="block text-xs font-serif uppercase tracking-[0.2em] text-muted-foreground mb-1 ml-1">Confirm</Label>
                            <input
                                id="confirmPassword"
                                type="password"
                                className="input-victorian w-full text-lg bg-transparent text-foreground placeholder:text-muted-foreground placeholder:opacity-30"
                                {...register('confirmPassword')}
                                disabled={isLoading}
                            />
                            {errors.confirmPassword && (
                                <p className="text-xs text-destructive mt-1 font-serif italic border border-destructive p-1">{errors.confirmPassword.message}</p>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 border-l-2 border-destructive bg-background text-destructive text-sm font-serif italic">
                            {error}
                        </div>
                    )}

                    <button type="submit" className="btn-victorian w-full mt-4" disabled={isLoading}>
                        {isLoading ? 'Processing...' : 'Register'}
                    </button>
                </form>

                <div className="mt-8 pt-4 border-t border-accent opacity-90 text-center text-sm font-serif text-muted-foreground italic">
                    <span>Already enrolled? </span>
                    <Link to="/login" className="text-primary font-bold hover:underline decoration-double underline-offset-4">
                        Login Here
                    </Link>
                </div>
            </div>
        </div>
    );
}
