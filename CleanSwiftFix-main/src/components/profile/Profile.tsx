import React from 'react';
import { useAuth } from '@/context/AuthContext';
import DevMenu from '@/components/dashboard/DevMenu'; // Adjust the import based on your file structure

const Profile = () => {
    const { user } = useAuth();
    console.log("Current User:", user); // Log the user object for debugging

    return (
        <div className="profile-container">
            <h1>Your Profile</h1>
            {/* Other profile details */}

            {/* Render the Dev Menu for everyone */}
            <DevMenu />
        </div>
    );
};

export default Profile; 