import Logo from "/Logo.svg";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-blue-950 py-8 text-blue-300">
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/">
            <img src={Logo} alt="Logo" />
          </Link>
          <p className="text-sm mt-6">
            Платформа для створення професійного портфоліо з широкими
            можливостями персоналізації та інтеграції.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-bold text-white">Навігація</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-white">
                Головна
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white">
                Про платформу
              </Link>
            </li>
            <li>
              <Link to="/features" className="hover:text-white">
                Функціонал
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-white">
                Як це працює
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white">
                Контакти
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-bold text-white">
            Правова інформація
          </h3>
          <ul className="space-y-2">
            <li>
              <Link to="/terms" className="transition-colors hover:text-white">
                Умови використання
              </Link>
            </li>
            <li>
              <Link
                to="/privacy"
                className="transition-colors hover:text-white"
              >
                Політика конфіденційності
              </Link>
            </li>
            <li>
              <Link to="/data" className="transition-colors hover:text-white">
                Обробка даних
              </Link>
            </li>
            <li>
              <Link
                to="/community"
                className="transition-colors hover:text-white"
              >
                Правила спільноти
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-bold text-white">Контакти</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="mailto:support@portfolio.com"
                className="hover:text-white"
              >
                Email: support@portfolio.com
              </a>
            </li>
            <li>
              <a href="tel:+380999999999" className="hover:text-white">
                Телефон: +380 (99) 999-99-99
              </a>
            </li>
            <li>
              <a
                href="https://t.me/portfolio_support"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                Telegram: @portfolio_support
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto mt-8 border-t border-blue-800 pt-4 text-center text-sm text-blue-400">
        © 2025 Portfolio. Всі права захищено.
      </div>
    </footer>
  );
};

export default Footer;
