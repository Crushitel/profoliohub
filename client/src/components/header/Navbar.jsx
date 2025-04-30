import { Link } from "react-router-dom";

const Navbar = () => {
  return (
        <ul className="hidden lg:flex space-x-4 items-center">
            <li><Link to="/" className="text-white hover:text-purple-600 transition-colors">Головна</Link></li>
            <li><Link to="/" className="text-white hover:text-purple-600 transition-colors">Портфоліо</Link></li>
            <li><Link to="/profile" className="text-white hover:text-purple-600 transition-colors">Профіль</Link></li>
            <li><Link to="/" className="text-white hover:text-purple-600 transition-colors">Пошук</Link></li>
        </ul>
  )
}

export default Navbar