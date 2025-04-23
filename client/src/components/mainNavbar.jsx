import { useNavigate } from "react-router-dom";

const MainNavbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav className="bg-white border-b border-gray-200 shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-50 shadow-lg">
            {/* Left: Brand and Navigation Links */}
            <div className="flex items-center gap-8">
            <div 
          onClick={() => window.location.href = "/main"}
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

                <div className="hidden md:flex gap-6">
                    <NavButton label="Profile" onClick={() => navigate("/profile")} />
                    <NavButton label="Dashboard" onClick={() => navigate("/dashboard")} />
                    <NavButton label="Milestone" onClick={() => navigate("/milestone")} />
                    <NavButton label="TeamBuilder" onClick={() => navigate("/team")} />
                    <NavButton label="Agreement" onClick={() => navigate("/agreement")} />
                </div>
            </div>

            {/* Right: Logout Button */}
            <button
                onClick={handleLogout}
                className="bg-orange-500 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition duration-300 transform hover:scale-105"
            >
                Logout
            </button>
        </nav>
    );
};

// 🧩 Reusable Navigation Button
const NavButton = ({ label, onClick }) => (
    <button
        onClick={onClick}
        className="text-sm text-gray-700 font-medium hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-200 rounded-lg transition duration-300"
    >
        {label}
    </button>
);

export default MainNavbar;
