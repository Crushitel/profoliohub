import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/user/register', formData);
      setSuccess('Реєстрація успішна! Ви можете увійти.');
      setError('');
      setTimeout(() => navigate('/login'), 2000); // Перенаправлення на сторінку входу через 2 секунди
    } catch (err) {
      setError(err.response?.data?.message || 'Помилка реєстрації');
      setSuccess('');
    }
  };

  return (
    <section className="container mx-auto my-7">
      <div className="mx-3.5 lg:mx-64 px-12 md:px-26 py-8 bg-blue-900 border border-blue-400 rounded-xl">
        <h1 className="text-white text-center text-2xl font-bold">Реєстрація</h1>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="first_name" className="block text-white">Ім'я:</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full text-white text-light px-3 py-2 border bg-blue-950 border-blue-400 rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="last_name" className="block text-white">Прізвище:</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full text-white text-light px-3 py-2 border bg-blue-950 border-blue-400 rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="username" className="block text-white">Логін:</label>
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
            <label htmlFor="email" className="block text-white">Електронна пошта:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full text-white text-light px-3 py-2 border bg-blue-950 border-blue-400 rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-white">Пароль:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full text-white text-light px-3 py-2 border bg-blue-950 border-blue-400 rounded-lg"
              required
            />
          </div>
          <button type="submit" className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Зареєструватися
          </button>
        </form>
        <p className="text-white text-center mt-4">
          Вже маєте акаунт? <Link to="/login" className="text-blue-400 hover:underline">Увійти</Link>
        </p>
      </div>
    </section>
  );
};

export default SignUp;