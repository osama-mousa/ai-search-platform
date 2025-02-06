import React from 'react';
import { useSession } from "next-auth/react";

const Profile = () => {
    const { data: session, status } = useSession();

    return (
        <div className="relative">
            <button
                // onClick={}
                className="w-full right-0 text-center px-4 py-3 text-lg text-neutral-100 hover:bg-zinc-600 rounded-lg"
            >
                {session?.user?.name || "Profile"}
            </button>
        </div>
    )
}

export default Profile
