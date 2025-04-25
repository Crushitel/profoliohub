import { useContext, useState, useLayoutEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const Login = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // Додаємо стан завантаження

  // Перевірка, чи авторизований користувач
  useLayoutEffect(() => {
    if (user) {
      setLoading(true); // Якщо користувач авторизований, показуємо "Завантаження..."
      navigate('/profile'); // Перенаправлення на сторінку профілю
    } else {
      setLoading(false); // Якщо користувач не авторизований, показуємо сторінку входу
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/user/login', formData);
      login(response.data.token);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Помилка входу');
    }
  };

  if (loading) {
    // Показуємо "Завантаження..." для авторизованого користувача
    return <div className="text-white">Завантаження...</div>;
  }

  return (
    <section className="container mx-auto my-7">
      <div className="mx-3.5 lg:mx-64 px-12 md:px-26 py-8 bg-blue-900 border border-blue-400 rounded-xl">
        <h1 className="text-white text-center text-2xl font-bold">Вхід до платформи</h1>
        {error && <p className="text-red-500">{error}</p>}
        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white">Логін:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full text-white text-light px-3 py-2 border bg-blue-950 border-blue-400 rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white">Пароль:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border text-white bg-blue-950 border-blue-400 rounded-lg"
              required
            />
          </div>
          <button type="submit" className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-600 transition-colors">Увійти</button>
        </form>
        <p className="mt-4 text-center text-white">
          Немає акаунту? <Link to="/signup" className="text-blue-400 hover:underline">Зареєструйтесь</Link>
        </p>
      </div>
    </section>
  );
};

export default Login;