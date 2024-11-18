import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Profile() {
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            axios
                .get('http://localhost:3001/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                .then((response) => {
                    setProfileData(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching profile:', error);
                });
        } else {
            window.location.href = '/login';
        }
    }, []);

    if (!profileData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Profile</h2>
            <p>Username: {profileData.username}</p>
            <p>Role: {profileData.role}</p>
        </div>
    );
}

export default Profile;
