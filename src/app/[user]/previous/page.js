"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import '../../globals.css';

const allowedUsers = process.env.NEXT_PUBLIC_USERS;

export default function PreviousPage() {
    const { user } = useParams();
    const router = useRouter();
    useEffect(() => {
        // Check if the user is allowed
        if (!allowedUsers.includes(user.replace('_blog', ''))) {
            // Redirect to the 'unauthorized' page after the component has rendered
            notFound();
        }
    }, [user, router]);
    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState();
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);

    // Predefined categories
    const categories = ['Career', 'Health', 'Achievement', 'Water', 'Miscellaneous'];

    // Set today's date as the default date
    useEffect(() => {
        const today = new Date().toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata' }).split('/').reverse().join('-');
        setFilterDate(today);
    }, []);

    useEffect(() => {
        // Fetch blogs from the database
        async function fetchBlogs() {
            try {
                const currentDate = filterDate === 'all' ? 'all' : (filterDate || new Date().toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata' }).split('/').reverse().join('-'));
                const url = `/api/get-blogs?date=${currentDate}&user=${user.replace('_blog', '')}`;
                const response = await fetch(url);
                if (!response.ok) throw new Error('Failed to fetch blogs');
                const data = await response.json();
                setBlogs(data);
                setFilteredBlogs(data);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            }
        }

        fetchBlogs();
    }, [filterDate]); // Dependency on filterDate

    useEffect(() => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const filtered = blogs.filter((blog) => {
            const matchesSearch =
                blog.date.includes(lowerSearchTerm) ||
                (blog.career && blog.career.toLowerCase().includes(lowerSearchTerm)) ||
                (blog.health && blog.health.category && blog.health.category.toLowerCase().includes(lowerSearchTerm)) ||
                (blog.health && blog.health.details && blog.health.details.toLowerCase().includes(lowerSearchTerm)) ||
                (blog.achievement && blog.achievement.toLowerCase().includes(lowerSearchTerm)) ||
                (blog.water && String(blog.water).toLowerCase().includes(lowerSearchTerm)) ||
                (blog.miscellaneous && blog.miscellaneous.text && blog.miscellaneous.text.toLowerCase().includes(lowerSearchTerm));

            const matchesDate = filterDate && filterDate !== 'all' ? blog.date === filterDate : true;
            const matchesCategory = selectedCategories.length > 0 ? selectedCategories.some(category => blog[category.toLowerCase()]) : true;

            return matchesSearch && matchesDate && matchesCategory;
        });

        setFilteredBlogs(filtered);
    }, [searchTerm, filterDate, blogs, selectedCategories]);

    // Clear the date filter
    const clearDateFilter = () => {
        setFilterDate('');  // This will reset the date filter, showing all blogs
    };

    // Show all blogs
    const showAllBlogs = () => {
        setFilterDate('all');  // Set filterDate to 'all'
    };

    // Toggle category selection
    const toggleCategory = (category) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="sticky top-0 bg-gray-800 p-4 shadow-md z-50">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-4">Previous Activities</h1>

                <div className="flex flex-wrap gap-4 justify-center items-center">
                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                        />
                        <button
                            onClick={() => setIsDatePickerVisible((prev) => !prev)}
                            className="px-4 py-2 bg-transparent border-0 focus:outline-none"
                        >
                            <img
                                src="/filter.svg" // Path to the filter icon in the public folder
                                alt="Filter Icon"
                                className="w-6 h-6" // Adjust size of the icon
                            />
                        </button>
                    </div>
                </div>

                {/* Category Filters */}
                {isDatePickerVisible && (
                    <div className='text-center mt-4'>
                        <input
                            type="date"
                            value={filterDate !== 'all' ? filterDate : ''}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="px-4 py-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 w-full sm:w-48 custom-calendar"
                        />
                        {/* Show All Button */}
                        <button
                            onClick={showAllBlogs}
                            className="px-4 py-2 my-3 ml-4 mt-2 bg-blue-600 text-white rounded"
                        >
                            Show All
                        </button>
                        {/* Clear Date Filter Button */}
                        <button
                            onClick={clearDateFilter}
                            className="px-4 py-2 my-3 ml-4 mt-2 bg-red-600 text-white rounded"
                        >
                            Clear
                        </button>
                        <div className="flex flex-wrap gap-2 justify-center mb-4 mt-4">
                            {categories.map(category => (
                                <label key={category} className={`flex items-center cursor-pointer ${selectedCategories.includes(category) ? 'bg-blue-600' : 'bg-gray-700'} text-white rounded-lg p-2`}>
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(category)}
                                        onChange={() => toggleCategory(category)}
                                        className="mr-2"
                                    />
                                    {category}
                                </label>
                            ))}
                        </div>
                    </div>
                )}

            </div>
            {/* Category Selection */}

            {/* Displaying Filtered Blogs */}
            <div className="p-4 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredBlogs.length > 0 ? (
                    filteredBlogs.map((blog) => (
                        <div key={blog._id} className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
                            <div className='flex flex-wrap justify-between'>
                                <h2 className="text-lg font-bold mb-2">{blog.date}</h2>

                                {/* Displaying Categories as Badges */}
                                <div className="mb-2 gap-1">
                                    {blog.career && (
                                        <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs">Career</span>
                                    )}
                                    {blog.health && (
                                        <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs">Health</span>
                                    )}
                                    {blog.achievement && (
                                        <span className="bg-yellow-600 text-white px-2 py-1 rounded-full text-xs">Achievement</span>
                                    )}
                                    {blog.water && (
                                        <span className="bg-teal-600 text-white px-2 py-1 rounded-full text-xs">Water</span>
                                    )}
                                    {blog.miscellaneous && (
                                        <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs">Miscellaneous</span>
                                    )}

                                </div>

                            </div>

                            {blog.career && (
                                <div className="mb-2">
                                    <span>{blog.career || 'N/A'}</span>
                                </div>
                            )}

                            {blog.health && (blog.health.category || blog.health.details) && (
                                <div className="mb-2">
                                    <span>{blog.health.category || 'N/A'} - {blog.health.details || 'N/A'}</span>
                                </div>
                            )}

                            {blog.achievement && (
                                <div className="mb-2">
                                    <span>{blog.achievement}</span>
                                </div>
                            )}

                            {blog.water && (
                                <div className="mb-2">
                                    <span>{blog.water} litres</span>
                                </div>
                            )}

                            {blog.miscellaneous && blog.miscellaneous.text && (
                                <div className="mb-2">
                                    <span>{blog.miscellaneous.text}</span>
                                </div>
                            )}

                            {blog.miscellaneous && blog.miscellaneous.image && (
                                <div className="mb-2">
                                    <img
                                        src={blog.miscellaneous.image}
                                        alt="Miscellaneous"
                                        className="w-full object-cover rounded mt-2"
                                    />
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-center col-span-full">No blogs found.</p>
                )}
            </div>
        </div>
    );
}
