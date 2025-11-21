import React, { useState } from 'react';

interface LoginProps {
    onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Basic authentication check
        if (username === import.meta.env.VITE_USERNAME && password === import.meta.env.VITE_PASSWORD) {
            onLogin();
        } else {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl mx-4">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
                    <p className="text-gray-500 mt-2">Please sign in to continue</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                    >
                        Sign In
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-400">
                    <p>Default credentials: admin / password</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
