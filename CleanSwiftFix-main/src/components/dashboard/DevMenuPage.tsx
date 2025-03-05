import React from 'react';
import { useAuth } from '@/context/AuthContext';
import DevMenu from './DevMenu'; // Adjust the import based on your file structure
import { useHistory } from 'react-router-dom';

const DevMenuPage = () => {
    const { user } = useAuth();
    const history = useHistory();

    // Redirect to login if user is not logged in
    if (!user) {
        history.push('/login');
        return null; // Prevent rendering while redirecting
    }

    // Check if the logged-in user is the specified email
    if (user.email === 'theshanestover@icloud.com') {
        return (
            <div className="dev-menu-container">
                <h1>Developer Menu</h1>
                <DevMenu />
            </div>
        );
    } else {
        return (
            <div>
                <h1>Access Denied</h1>
                <p>You do not have permission to view this page.</p>
            </div>
        );
    }
};

export default DevMenuPage;
