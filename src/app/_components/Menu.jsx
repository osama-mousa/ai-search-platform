import React from 'react';
import Profile from './Profile';
import Settings from './Settings';
import Signout from './Signout';

const ProfileMenu = () => {
    return (
        <div className="absolute right-0 mt-56 p-2 w-52 bg-inputColor rounded-lg shadow-lg z-50">
            <Profile />
            <Settings />
            <Signout />
        </div>
    )
}

export default ProfileMenu
