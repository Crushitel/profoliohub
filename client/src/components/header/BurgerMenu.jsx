import { Link } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { useState, useEffect, useRef } from "react";

const BurgerMenu = ({ user, logout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Закриття меню при кліку поза ним
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      setIsOpen(false); // Закриває меню при скролі
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="relative lg:hidden" ref={menuRef}>
      {/* Кнопка бургер-меню */}
      <button
        onClick={toggleMenu}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-800 bg-blue-950 transition-colors hover:bg-blue-800 focus:bg-blue-800"
      >
        {isOpen ? (
          <IoMdClose className="h-6 w-6 text-blue-300" />
        ) : (
          <IoMenu className="h-6 w-6 text-blue-300" />
        )}
      </button>

      {/* Випадаюче меню */}
      <div
        className={`absolute top-full right-0 z-50 w-48 space-y-4 rounded-lg bg-blue-900 p-4 shadow-lg transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <ul>
          <li className="mb-2">
            <Link
              to="/"
              className="block text-white transition-colors hover:text-purple-600"
              onClick={() => setIsOpen(false)}
            >
              Головна
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/"
              className="block text-white transition-colors hover:text-purple-600"
              onClick={() => setIsOpen(false)}
            >
              Портфоліо
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/profile"
              className="block text-white transition-colors hover:text-purple-600"
              onClick={() => setIsOpen(false)}
            >
              Профіль
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/"
              className="block text-white transition-colors hover:text-purple-600"
              onClick={() => setIsOpen(false)}
            >
              Контакти
            </Link>
          </li>
          {user ? (
            <li className="mt-4">
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full cursor-pointer rounded-xl border border-red-700 bg-red-700 px-4 py-2 text-white transition-colors hover:bg-red-600"
              >
                Вийти
              </button>
            </li>
          ) : (
            <>
              <li className="mt-4 mb-2">
                <Link
                  to="/login"
                  className="block cursor-pointer rounded-xl border border-purple-700 bg-blue-700 px-4 py-2 text-center text-white transition-colors hover:bg-blue-600"
                  onClick={() => setIsOpen(false)}
                >
                  Вхід
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="block cursor-pointer rounded-xl border border-purple-700 bg-blue-900 px-4 py-2 text-center text-white transition-colors hover:bg-blue-600"
                  onClick={() => setIsOpen(false)}
                >
                  Реєстрація
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default BurgerMenu;
