import { Link } from "react-router-dom";
import { useThemeStore } from "../store";

const FootBar = () => {
  const { theme } = useThemeStore();

  return (
    <footer className={`${theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"} py-4`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="text-sm">
            &copy; {new Date().getFullYear()} Home Rental. All rights reserved.
          </div>
          <div className="flex space-x-4">
            <Link to="/privacy" className="text-sm hover:underline">Privacy Policy</Link>
            <Link to="/terms" className="text-sm hover:underline">Terms of Service</Link>
            <Link to="/contact" className="text-sm hover:underline">Contact Us</Link>
          </div>
          <div className="flex space-x-4">
            <a href="https://facebook.com" target="" rel="noopener noreferrer" className="text-sm hover:underline">
              Facebook
            </a>
            <a href="https://twitter.com" target="" rel="noopener noreferrer" className="text-sm hover:underline">
              Twitter
            </a>
            <a href="https://instagram.com" target="" rel="noopener noreferrer" className="text-sm hover:underline">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FootBar;