
import React, { useState } from 'react';
import { User as UserIcon, Lock as LockIconSvg, Eye as EyeIcon, EyeOff as EyeOffIcon } from 'lucide-react';
import { User } from '../../types';
import { GoogleIcon } from '../../constants';

interface LoginProps {
    onLoginSuccess: (user: User) => void;
    users: User[];
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, users }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const cleanEmail = email.trim();
        const cleanPassword = password.trim();

        console.log('[Login] Attempting login for:', cleanEmail);

        // Find user from the users prop (already loaded from database)
        const user = users.find(u => u.email === cleanEmail);
        
        if (user) {
            console.log('[Login] User found');
            if (user.password === cleanPassword || user.password === password) {
                onLoginSuccess(user);
            } else {
                console.warn('[Login] Password mismatch');
                setError('Username atau kata sandi salah.');
            }
        } else {
            console.warn('[Login] No user found with email:', cleanEmail);
            setError('Username atau kata sandi salah.');
        }
        
        setIsLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-white p-4 relative overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                <img src="/assets/images/backgrounds/login-bg.svg" alt="" width="1920" height="1080" loading="lazy" decoding="async" className="w-full h-full object-cover" />
            </div>

            <div className="w-full max-w-sm mx-auto relative z-10">
                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/50">
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-6">
                            <img src="/assets/images/logos/light-logo.svg" alt="Weddfin" width="160" height="40" decoding="async" className="h-10 w-auto" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-800">Login</h1>
                        <p className="text-sm text-slate-500 mt-2">Hey, masukkan detail Anda untuk masuk ke akun Anda</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {error && (
                            <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                        <div className="input-with-icon">
                            <UserIcon className="input-icon w-5 h-5" />
                            <input
                                id="email"
                                name="email"
                                type="text"
                                required
                                className="w-full h-12 px-4 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                                placeholder="Enter your username/email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="input-with-icon">
                            <LockIconSvg className="input-icon w-5 h-5" />
                            <input
                                id="password"
                                name="password"
                                type={isPasswordVisible ? 'text' : 'password'}
                                required
                                className="w-full h-12 px-4 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                                style={{ paddingRight: '2.5rem' }}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                                aria-label={isPasswordVisible ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                            >
                                {isPasswordVisible ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                            </button>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="button-primary w-full"
                            >
                                {isLoading ? 'Logging In...' : 'Log In'}
                            </button>
                        </div>
                    </form>

                    <div className="text-center mt-6">
                        <button
                            type="button"
                            onClick={() => {
                                window.location.hash = '#/home';
                            }}
                            className="text-xs text-slate-500 hover:text-blue-600 transition-colors"
                        >
                            &larr; Kembali ke Beranda
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;