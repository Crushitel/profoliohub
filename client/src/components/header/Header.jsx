import Navbar from "./Navbar";
import BurgerMenu from "./BurgerMenu";
import Logo from "/Logo.svg";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="bg-blue-900">
      <div className="container mx-auto flex items-center justify-between px-3.5 py-4">
        <Link to="/" className="group flex cursor-pointer items-center">
          <img src={Logo} alt="Logo" className="h-9 w-35" />
        </Link>
        <Navbar />
        <div className="hidden space-x-4 lg:block">
          {user ? (
            <button
              onClick={logout}
              className="cursor-pointer rounded-xl border border-red-700 bg-red-700 px-6 py-1.5 text-white transition-colors hover:bg-red-600"
            >
              Вийти
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="cursor-pointer rounded-xl border border-purple-700 bg-blue-700 px-6 py-1.5 text-white transition-colors hover:bg-blue-600"
              >
                Вхід
              </Link>
              <Link
                to="/signup"
                className="cursor-pointer rounded-xl border border-purple-700 bg-blue-900 px-6 py-1.5 text-white transition-colors hover:bg-blue-600"
              >
                Реєстрація
              </Link>
            </>
          )}
        </div>
        <BurgerMenu user={user} logout={logout} />
      </div>
    </header>
  );
};

export default Header;
