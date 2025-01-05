'use client';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useTheme } from "next-themes";

export default function ThemeSwitch() {
    const { theme, setTheme } = useTheme();
    const [systemTheme, setSystemTheme] = useState(null); // Initialize with null to delay rendering

    useEffect(() => {
        // Function to detect system theme
        const detectSystemTheme = () => {
            return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        };

        // Set system theme when the component mounts
        const detectedTheme = detectSystemTheme();
        setSystemTheme(detectedTheme);

        // Listen for changes to system theme
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleChange = (event) => {
            const newTheme = event.matches ? 'dark' : 'light';
            setSystemTheme(newTheme);
        };

        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    // If the systemTheme is not yet detected, we don't render the toggle
    if (systemTheme === null) {
        return null; // Return nothing until the client-side theme is determined
    }

    // Determine current theme based on user preference or system setting
    const currentTheme = theme === 'system' ? systemTheme : theme || 'light'; // Default to light if no theme is set

    // Function to toggle the theme
    const handleToggle = () => {
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme); // Switch between light and dark mode
    };

    return (
        <div className="fixed bottom-4 right-4">
            <button
                onClick={handleToggle}
                className="flex items-center justify-center w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full relative shadow-lg focus:outline-none transition-all duration-300"
                aria-label="Toggle dark mode"
            >
                <div className={`w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center transition-all duration-300`}>
                    {currentTheme === "dark" ? (
                        <FaMoon className="text-yellow-500 text-2xl" />
                    ) : (
                        <FaSun className="text-yellow-500 text-2xl" />
                    )}
                </div>
            </button>
        </div>
    );
}