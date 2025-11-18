import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, type Auth as FirebaseAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, signInAnonymously } from 'firebase/auth';
import { GoogleIcon } from './Icons';

interface AuthProps {
    auth: FirebaseAuth;
}

const Auth: React.FC<AuthProps> = ({ auth }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            if (isSignUp) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleGoogleSignIn = async () => {
        setError(null);
        const provider = new GoogleAuthProvider();
        try {
            // Try popup first (better UX). If popup is blocked, fall back to redirect.
            await signInWithPopup(auth, provider);
        } catch (err: any) {
            // If popup is blocked or fails due to environment, fall back to redirect
            const code = err?.code || '';
            if (code === 'auth/popup-blocked' || code === 'auth/operation-not-supported-in-this-environment' || code === 'auth/cancelled-popup-request') {
                try {
                    await signInWithRedirect(auth, provider);
                } catch (e: any) {
                    setError(e.message || 'Google sign-in failed (redirect).');
                }
            } else {
                setError(err.message || 'Google sign-in failed.');
            }
        }
    };

    const handleAnonymousSignIn = async () => {
        setError(null);
        try {
            await signInAnonymously(auth);
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-pink-100 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-center text-pink-700 dark:text-pink-300 mb-6">
                {isSignUp ? 'Create Your Account' : 'Welcome Back'}
            </h2>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-pink-500 focus:border-pink-500"
                        placeholder="you@example.com"
                    />
                </div>
                <div>
                    <label htmlFor="password" aria-label="Password" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-pink-500 focus:border-pink-500"
                        placeholder="••••••••"
                    />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-xl font-semibold shadow-md transition-transform hover:scale-[1.02]">
                    {isSignUp ? 'Sign Up with Email' : 'Sign In with Email'}
                </button>
            </form>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-slate-300 dark:border-slate-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="bg-white dark:bg-slate-800 px-2 text-slate-500 dark:text-slate-400">Or</span>
                </div>
            </div>

            <div className="space-y-3">
                <button
                    onClick={handleGoogleSignIn}
                    type="button"
                    className="w-full flex justify-center items-center gap-3 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 p-3 rounded-xl font-semibold shadow-sm border border-slate-300 dark:border-slate-600 transition"
                >
                    <GoogleIcon className="w-5 h-5" />
                    Sign in with Google
                </button>
                 <button
                    onClick={handleAnonymousSignIn}
                    type="button"
                    className="w-full text-center text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-pink-500 dark:hover:text-pink-400 hover:underline"
                >
                    Continue as a guest
                </button>
            </div>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                <button onClick={() => { setIsSignUp(!isSignUp); setError(null); }} className="font-semibold text-pink-500 hover:underline ml-1">
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
            </p>
        </div>
    );
};

export default Auth;
