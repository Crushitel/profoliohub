import Navbar from "./Navbar"
import Logo from "/Logo.svg"
import { MdMenu } from "react-icons/md";
import { Link } from "react-router-dom";
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="bg-blue-900">
      <div className="container mx-auto px-3.5 py-4 flex items-center justify-between">
        <Link to="/" className="flex group cursor-pointer items-center">
          <img src={Logo} alt="Logo" className="w-35 h-9" />
        </Link>
        <Navbar />
        <div className="hidden lg:block space-x-4">
          {user ? (
            <button
              onClick={logout}
              className="px-6 py-1.5 cursor-pointer text-white bg-red-700 border border-red-700 rounded-xl hover:bg-red-600 transition-colors"
            >
              Вийти
            </button>
          ) : (
            <>
              <Link to="/login" className="px-6 py-1.5 cursor-pointer text-white bg-blue-700 border border-purple-700 rounded-xl hover:bg-blue-600 transition-colors">Вхід</Link>
              <Link to="/signup" className="px-6 py-1.5 cursor-pointer text-white bg-blue-900 border border-purple-700 rounded-xl hover:bg-blue-600 transition-colors">Реєстрація</Link>
            </>
          )}
        </div>
        <button className="group lg:hidden flex items-center justify-center w-10 h-10 bg-blue-950 border border-purple-800 rounded-xl hover:bg-blue-800 transition-colors">
          <MdMenu className="text-blue-700 text-2xl group-hover:text-blue-300 transition-colors" />
        </button>
      </div>
    </header>
  );
};

export default Header;