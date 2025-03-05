import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useHistory } from 'react-router-dom';

const Login = () => {
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await signIn(email, password);
        if (!error) {
            history.push('/devmenu'); // Redirect to /devmenu after successful login
        } else {
            // Handle login error (e.g., show a message)
            console.error("Login failed:", error);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
