import React from 'react';
import { signOut } from 'next-auth/react';
import { FiLogOut } from "react-icons/fi";


const Signout = () => {
    return (
        <div className="relative">
            <FiLogOut size={20} className="absolute left-3 top-4 text-currentColor dark:text-neutral-100" />
            <button
                onClick={() => signOut()}
                className="w-full right-0 text-center px-4 py-3 text-lg text-neutral-100 hover:bg-zinc-600 rounded-lg"
            >
                Log out
            </button>
        </div>
    )
}

export default Signout
