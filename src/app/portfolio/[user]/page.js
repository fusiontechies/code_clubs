"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import Image from 'next/image'; // For optimized images

const allowedUsers = process.env.users;

export default function Home() {
    const { user } = useParams();
    const router = useRouter();
    const [profileImage, setProfileImage] = useState("");
    
    useEffect(() => {
        if (!allowedUsers.includes(user)) {
            notFound();
        } else {
            setProfileImage(`/images/${user}.png`);  // Dynamically set image path
        }
    }, [user, router]);

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="text-center py-16 md:py-24">
                <div className="flex justify-center mb-6">
                    {profileImage ? (
                        <Image
                            src={profileImage}
                            alt={`${user}'s Profile`}
                            width={150}
                            height={150}
                            className="rounded-full border-4 border-gray-700"
                        />
                    ) : (
                        <div className="w-36 h-36 bg-gray-800 rounded-full flex justify-center items-center text-xl font-semibold text-gray-400">
                            No Image
                        </div>
                    )}
                </div>
                <h1 className="text-5xl font-bold text-white mb-4">{user.toUpperCase()}</h1>
                <p className="text-xl text-gray-400">Web Developer & Designer</p>

                {/* Social Media Links */}
                <div className="mt-6 space-x-6 text-gray-400">
                    <a href={`https://github.com/${user}`} target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-github fa-2x hover:text-white transition"></i>
                    </a>
                    <a href={`https://linkedin.com/in/${user}`} target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-linkedin fa-2x hover:text-white transition"></i>
                    </a>
                    <a href={`https://twitter.com/${user}`} target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-twitter fa-2x hover:text-white transition"></i>
                    </a>
                </div>
            </header>

            {/* About Section */}
            <section className="py-20 px-6 md:px-12 bg-gray-900">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl font-semibold text-white mb-6">About Me</h2>
                    <p className="text-lg text-gray-300">
                        I'm a passionate web developer with a focus on creating modern, user-friendly websites. I have experience
                        building full-stack applications using JavaScript frameworks like React, Next.js, and Node.js.
                    </p>
                </div>
            </section>

            {/* Skills Section */}
            <section className="py-20 px-6 md:px-12">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl font-semibold text-white mb-6">Skills</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        <div className="skill-item bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
                            <h3 className="text-xl text-white">JavaScript</h3>
                        </div>
                        <div className="skill-item bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
                            <h3 className="text-xl text-white">React</h3>
                        </div>
                        <div className="skill-item bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
                            <h3 className="text-xl text-white">Next.js</h3>
                        </div>
                        <div className="skill-item bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
                            <h3 className="text-xl text-white">Tailwind CSS</h3>
                        </div>
                        <div className="skill-item bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
                            <h3 className="text-xl text-white">Node.js</h3>
                        </div>
                        <div className="skill-item bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
                            <h3 className="text-xl text-white">HTML/CSS</h3>
                        </div>
                        <div className="skill-item bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
                            <h3 className="text-xl text-white">Git</h3>
                        </div>
                        <div className="skill-item bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
                            <h3 className="text-xl text-white">TypeScript</h3>
                        </div>
                    </div>
                </div>
            </section>

            {/* Projects Section */}
            <section className="py-20 px-6 md:px-12 bg-gray-900">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl font-semibold text-white mb-6">Projects</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-gray-800 p-8 rounded-lg shadow-xl hover:shadow-2xl transition duration-300">
                            <h3 className="text-xl font-semibold text-white mb-4">Portfolio Website</h3>
                            <p className="text-gray-400">A personal portfolio to showcase my skills and projects.</p>
                        </div>
                        <div className="bg-gray-800 p-8 rounded-lg shadow-xl hover:shadow-2xl transition duration-300">
                            <h3 className="text-xl font-semibold text-white mb-4">E-Commerce App</h3>
                            <p className="text-gray-400">A full-stack e-commerce platform built with React and Node.js.</p>
                        </div>
                        <div className="bg-gray-800 p-8 rounded-lg shadow-xl hover:shadow-2xl transition duration-300">
                            <h3 className="text-xl font-semibold text-white mb-4">Social Media App</h3>
                            <p className="text-gray-400">A social media platform for connecting users with real-time chat features.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20 px-6 md:px-12 bg-gray-900">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl font-semibold text-white mb-6">Contact Me</h2>
                    <form className="space-y-6">
                        <input
                            type="text"
                            placeholder="Your Name"
                            className="w-full px-4 py-3 bg-gray-600 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="email"
                            placeholder="Your Email"
                            className="w-full px-4 py-3 bg-gray-600 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <textarea
                            placeholder="Your Message"
                            className="w-full px-4 py-3 bg-gray-600 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-gray-500 transition duration-300"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </section>

            {/* Footer */}
            <footer className="text-center py-8 bg-gray-800">
                <p className="text-gray-400">© 2025 Code Clubs. All Rights Reserved.</p>
            </footer>
        </div>
    );
}
