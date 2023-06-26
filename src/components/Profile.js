import React from 'react';
import '../styles/Profile.scoped.css';

const Profile = () => {

    const user = JSON.parse(localStorage.getItem('user'));
    return (
        <div className="page">
        <div className="container">
            <div className="profile-container">
                <div className="profile-image">
                    <img src={user.photoURL}
                         alt="img" className="profilePic"/>
                </div>
            </div>
            <div className="central-leaderboard-container">
                Here is something about you!
            </div>
        </div>
        </div>
    );
}

export default Profile;