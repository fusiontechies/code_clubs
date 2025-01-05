"use client";
import { useState } from 'react';
import '../../globals.css';
import { useParams, useRouter, notFound } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import { FaTimes } from 'react-icons/fa';
import { useEffect } from 'react';
import ThemeSwitch from '@/components/ThemeSwitch';

const allowedUsers = process.env.NEXT_PUBLIC_USERS;

export default function TodayPage() {
    const { user } = useParams();
    const router = useRouter();
    useEffect(() => {
        // Check if the user is allowed
        if (!allowedUsers.includes(user.replace('_blog', ''))) {
            // Redirect to the 'unauthorized' page after the component has rendered
            notFound();
        }
    }, [user, router]);
    const [selectedCategory, setSelectedCategory] = useState('Career');
    const [formData, setFormData] = useState({
        date: new Date().toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata' }).split('/').reverse().join('-'),
        career: '',
        health: { category: '', details: '' },
        achievement: '',
        water: '',
        miscellaneous: { text: '', image: null },
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name.startsWith('health.')) {
            const key = name.split('.')[1];
            setFormData((prev) => ({
                ...prev,
                health: { ...prev.health, [key]: value },
            }));
        } else if (name.startsWith('miscellaneous.')) {
            const key = name.split('.')[1];
            setFormData((prev) => ({
                ...prev,
                miscellaneous: { ...prev.miscellaneous, [key]: value },
            }));
            if (files && files.length > 0) {
                setFormData((prev) => ({
                    ...prev,
                    miscellaneous: { ...prev.miscellaneous, image: files[0] },
                }));
            }
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload = new FormData();
        payload.append('date', formData.date);
        payload.append('user', user.replace('_blog', ''));

        if (selectedCategory === 'Career') {
            payload.append('career', formData.career);
        } else if (selectedCategory === 'Health') {
            payload.append('health', JSON.stringify(formData.health));
        } else if (selectedCategory === 'Achievement') {
            payload.append('achievement', formData.achievement);
        } else if (selectedCategory === 'Water') {
            payload.append('water', formData.water);
        } else if (selectedCategory === 'Miscellaneous') {
            payload.append('miscellaneousText', formData.miscellaneous.text);
            if (formData.miscellaneous.image) {
                payload.append('miscellaneousImage', formData.miscellaneous.image);
            }
        }

        // Append the image file if it exists
        if (formData.miscellaneous.image) {
            payload.append('image', formData.miscellaneous.image);
        }

        try {
            const response = await fetch('/api/submit-today', {
                method: 'POST',
                body: payload,
            });

            if (!response.ok) throw new Error('Failed to submit data');

            toast.success('Data submitted successfully!', { position: 'top-right' });

            // Reset only the fields related to the selected category
            setFormData((prev) => ({
                ...prev,
                career: selectedCategory === 'Career' ? '' : prev.career,
                health: selectedCategory === 'Health' ? { category: '', details: '' } : prev.health,
                achievement: selectedCategory === 'Achievement' ? '' : prev.achievement,
                water: selectedCategory === 'Water' ? '' : prev.water,
                miscellaneous: selectedCategory === 'Miscellaneous' ? { text: '', image: null } : prev.miscellaneous,
            }));
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while submitting data.', { position: 'top-right' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemoveImage = () => {
        // Reset image to null
        setFormData((prev) => ({
            ...prev,
            miscellaneous: { ...prev.miscellaneous, image: null },
        }));

        // Manually reset the file input value
        const fileInput = document.getElementById('miscellaneous-image');
        if (fileInput) {
            fileInput.value = '';  // Reset the file input
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center text-white">
            <ToastContainer />
            <h1 className="text-center text-black dark:text-white text-3xl md:text-4xl sm:text-5xl font-extrabold mt-8 mb-8">
                Log Today’s Activities
            </h1>
            <form
                onSubmit={handleSubmit}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl"
            >
                <div className="mb-4">
                    <label htmlFor="date" className="block text-black dark:text-white text-lg font-medium mb-2">
                        Date
                    </label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-blue-500 custom-calendar"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="category" className="block text-black dark:text-white text-lg font-medium mb-2">
                        Select Category
                    </label>
                    <select
                        id="category"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="Career">Career</option>
                        <option value="Health">Health</option>
                        <option value="Achievement">Achievement</option>
                        <option value="Water">Water</option>
                        <option value="Miscellaneous">Miscellaneous</option>
                    </select>
                </div>

                {selectedCategory === 'Career' && (
                    <div className="mb-4">
                        <label htmlFor="career" className="block text-black dark:text-white text-lg font-medium mb-2">
                            Career
                        </label>
                        <textarea
                            id="career"
                            name="career"
                            value={formData.career}
                            onChange={handleChange}
                            rows="3"
                            placeholder="What did you learn today?"
                            required
                            className="w-full px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                )}

                {selectedCategory === 'Health' && (
                    <div className="mb-4">
                        <label htmlFor="health" className="block text-black dark:text-white text-lg font-medium mb-2">
                            Health
                        </label>
                        <select
                            name="health.category"
                            value={formData.health.category}
                            onChange={handleChange}
                            className="w-full mb-2 px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Category</option>
                            <option value="Leg">Leg</option>
                            <option value="Arm">Arm</option>
                            <option value="Full Body">Full Body</option>
                            <option value="Chest">Chest</option>
                            <option value="Upper Body">Upper Body</option>
                            <option value="Delts">Delts</option>
                        </select>
                        <textarea
                            name="health.details"
                            value={formData.health.details}
                            onChange={handleChange}
                            rows="2"
                            placeholder="Details of your workout"
                            className="w-full px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                )}

                {selectedCategory === 'Achievement' && (
                    <div className="mb-4">
                        <label htmlFor="achievement" className="block text-black dark:text-white text-lg font-medium mb-2">
                            Achievement
                        </label>
                        <textarea
                            id="achievement"
                            name="achievement"
                            value={formData.achievement}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Certifications or assignments completed"
                            required
                            className="w-full px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                )}

                {selectedCategory === 'Water' && (
                    <div className="mb-4">
                        <label htmlFor="water" className="block text-black dark:text-white text-lg font-medium mb-2">
                            Water Intake (Liters)
                        </label>
                        <input
                            type="number"
                            id="water"
                            name="water"
                            value={formData.water}
                            onChange={handleChange}
                            placeholder="Enter amount in liters"
                            required
                            className="w-full px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                )}

                {selectedCategory === 'Miscellaneous' && (
                    <div className="mb-4">
                        <label htmlFor="miscellaneous-text" className="block text-black dark:text-white text-lg font-medium mb-2">
                            Miscellaneous
                        </label>
                        <textarea
                            id="miscellaneous-text"
                            name="miscellaneous.text"
                            value={formData.miscellaneous.text}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Any other notes or activities"
                            className="w-full px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white focus:ring -2 focus:ring-blue-500 mb-4"
                        />
                        <div className="flex flex-col items-center">
                            <label
                                htmlFor="miscellaneous-image"
                                className="cursor-pointer flex justify-center items-center border-2 border-gray-300 dark:border-gray-600 p-4 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white transition hover:bg-gray-200 dark:hover:bg-gray-600 mb-4"
                            >
                                <span className="text-center">Choose an Image</span>
                                <input
                                    type="file"
                                    id="miscellaneous-image"
                                    name="miscellaneous.image"
                                    accept="image/*"
                                    onChange={handleChange}
                                    className="hidden"
                                />
                            </label>

                            {!formData.miscellaneous.image ? (
                                <div className="relative w-20 h-25 mb-4"> 
                                    <img
                                        src="/placeholder.png"
                                        alt="Selected Preview"
                                        className="rounded-lg h-25 w-20 object-cover border-2 border-gray-300 dark:border-gray-600"
                                    />
                                </div>
                            ) : (
                                <div className="relative">
                                    <img
                                        src={URL.createObjectURL(formData.miscellaneous.image)}
                                        alt="Selected Preview"
                                        className="max-w-xs rounded-lg shadow-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 cross-button"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 rounded-lg text-lg font-medium transition-all ${isSubmitting ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                >
                    {isSubmitting ? 'Saving...' : 'Submit'}
                </button>
            </form>
            <ThemeSwitch />
        </div>
    );
}