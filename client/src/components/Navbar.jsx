import { Link } from 'react-router-dom';

const Navbar = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <nav className="bg-white py-4 px-6 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-4">
        {/* Logo with Freelancer text */}
        <div 
          onClick={() => window.location.href = "/"}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <svg 
            className="w-6 h-6 text-orange-600 group-hover:text-orange-800 transition duration-300"
            fill="currentColor" 
            viewBox="0 0 20 20" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          <span className="text-xl font-bold text-gray-800 group-hover:text-orange-600 transition duration-300">
            Freelancer
          </span>
        </div>
      </div>

      {/* Right side - Auth buttons */}
      <div className="flex items-center gap-4">
        {localStorage.getItem('token') ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white font-medium px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none transition duration-300"
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-orange-500 text-white font-medium px-4 py-2 rounded-md hover:bg-orange-600 focus:outline-none transition duration-300"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-orange-500 text-white font-medium px-4 py-2 rounded-md hover:bg-orange-600 focus:outline-none transition duration-300"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;