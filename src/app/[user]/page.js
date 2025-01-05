import ThemeSwitch from '@/components/ThemeSwitch';
import Link from 'next/link';

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center text-white">
            <h1 className="text-center text-black dark:text-white text-5xl md:text-4xl sm:text-3xl font-extrabold mt-8">
                Blogs
            </h1>
            <div className="flex-grow flex items-center justify-center w-full px-6 md:px-24">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 w-full">
                    <div className="flex flex-col items-center">
                        <Link href="jatin_blog/today" legacyBehavior>
                            <a className="px-8 py-4 bg-blue-600 rounded-lg shadow-lg text-xl font-medium hover:bg-blue-700 transition-all">
                                Today
                            </a>
                        </Link>
                        <p className="text-gray-400 mt-4 text-center">Log your day’s activities and achievements.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <Link href="jatin_blog/previous" legacyBehavior>
                            <a className="px-8 py-4 bg-green-600 rounded-lg shadow-lg text-xl font-medium hover:bg-green-700 transition-all">
                                Previous
                            </a>
                        </Link>
                        <p className="text-gray-400 mt-4 text-center">View records of past entries.</p>
                    </div>
                </div>
            </div>
            <ThemeSwitch />
        </div>
    );
}