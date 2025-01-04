import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const friends = [
    {
      name: 'Kamlesh Kumar',
      image: '/images/kamlesh.png',
      portfolio: '/portfolio/kamlesh',
      blog: '/kamlesh_blog',
    },
    {
      name: 'Jatin Kishore',
      image: '/images/jatin.png',
      portfolio: '/portfolio/jatin',
      blog: '/jatin_blog',
    },
    {
      name: 'Sriram',
      image: '/images/sriram.png',
      portfolio: '/portfolio/sriram',
      blog: '/sriram_blog',
    },
  ];

  return (
    <div className="min-h-screen bg-dark-gray flex flex-col items-center justify-center">
      <h1 className="text-4xl md:text-5xl sm:text-6xl font-extrabold mb-10 text-white tracking-widest uppercase text-center mt-4">
        Code Club Community Blogs..
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-4 place-items-center">
        {friends.map((friend, index) => (
          <div
            key={index}
            className="relative group bg-gradient-to-br from-gray-100 via-white to-gray-200 rounded-2xl shadow-2xl overflow-hidden transform transition-transform duration-300 hover:scale-110 hover:shadow-xl"
          >
            <Image
              src={friend.image}
              alt={friend.name}
              width={400}
              height={256}
              className="w-full h-64 object-cover rounded-t-2xl bg-gray-600"
            />
            <div className="p-6 bg-gray-700">
              <h2 className="text-2xl font-bold text-gray-700 text-center text-white">
                {friend.name}
              </h2>
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Link href={friend.portfolio} legacyBehavior>
                <a className="mb-4 px-6 py-1 bg-blue-500 text-white text-lg font-medium rounded-full shadow-md hover:bg-blue-600">
                  Portfolio
                </a>
              </Link>
              <Link href={friend.blog} legacyBehavior>
                <a className="px-6 py-1 bg-green-500 text-white text-lg font-medium rounded-full shadow-md hover:bg-green-600">
                  Blog
                </a>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
