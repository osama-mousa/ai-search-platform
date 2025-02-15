import React from 'react'

const Footer = () => {
    return (
        <div>
            <footer className="w-full justify-center py-3 text-center text-xs text-gray-600 dark:text-gray-400 fixed bottom-0">
                &copy; {new Date().getFullYear()} Chat Platform
            </footer>
        </div>
    )
}

export default Footer
