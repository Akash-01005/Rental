import { Link } from "react-router-dom";
import { useAuthStore, useThemeStore } from "../store";

const NavBar = () => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  console.log(user)

  return (
    <nav className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} z-50 sticky top-0 shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className={`${theme === "dark" ? "text-white" : "text-indigo-600"} font-bold text-xl`}>Home Rental</Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Link to="/" className={`${theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-800 hover:text-indigo-600"} px-3 py-2 rounded-md text-sm font-medium`}>Home</Link>
            <Link to="/properties" className={`${theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-800 hover:text-indigo-600"} px-3 py-2 rounded-md text-sm font-medium`}>Properties</Link>
            <Link to="/about" className={`${theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-800 hover:text-indigo-600"} px-3 py-2 rounded-md text-sm font-medium`}>About</Link>
            <Link to="/contact" className={`${theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-800 hover:text-indigo-600"} px-3 py-2 rounded-md text-sm font-medium`}>Contact</Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button onClick={toggleTheme} className={`${theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-800 hover:text-indigo-600"} px-3 py-2 rounded-md text-sm font-medium`}>
              {theme === "dark" ? "Light" : "Dark"} Theme
            </button>
            {user ? (
              <>
                <Link to={`/dashboard/${user.userId}`} className={`${theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-800 hover:text-indigo-600"} px-3 py-2 rounded-md text-sm font-medium`}>Dashboard</Link>
                <button onClick={logout} className={`${theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-800 hover:text-indigo-600"} px-3 py-2 rounded-md text-sm font-medium`}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className={`${theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-800 hover:text-indigo-600"} px-3 py-2 rounded-md text-sm font-medium`}>Login</Link>
                <Link to="/signup" className={`${theme === "dark" ? "bg-indigo-500 hover:bg-indigo-600" : "bg-indigo-600 hover:bg-indigo-700"} text-white px-3 py-2 rounded-md text-sm font-medium`}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;