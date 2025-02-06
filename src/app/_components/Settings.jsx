import React from 'react';
import { IoSettingsOutline } from "react-icons/io5";


const Settings = () => {
    return (
        <div className="relative">
            <IoSettingsOutline size={20} className="absolute left-3 top-4 text-currentColor dark:text-neutral-100" />
            <button
                // onClick={}
                className="w-full right-0 text-center px-4 py-3 text-lg text-neutral-100 hover:bg-zinc-600 rounded-lg"
            >
                Settings
            </button>
        </div>
    )
}

export default Settings
