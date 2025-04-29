import { useContext, useState, useLayoutEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const Login = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    if (user) {
      setLoading(true);
      navigate("/profile");
    } else {
      setLoading(false);
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Перевірка на порожні поля
    const missingFields = [];
    if (!formData.username) missingFields.push("Логін");
    if (!formData.password) missingFields.push("Пароль");

    if (missingFields.length > 0) {
      setError(`Поле '${missingFields.join(", ")}' обов'язкове`);
      return;
    }

    try {
      const response = await axiosInstance.post("/user/login", formData);
      login(response.data.token);
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Помилка входу");
    }
  };

  if (loading) {
    return <div className="text-white">Завантаження...</div>;
  }

  return (
    <section className="container mx-auto my-7">
      <div className="mx-3.5 rounded-xl border border-blue-400 bg-blue-900 px-12 py-8 md:px-26 lg:mx-64">
        <h1 className="text-center text-2xl font-bold text-white">
          Вхід до платформи
        </h1>
        {error && <p className="mt-4 text-red-500">{error}</p>}
        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white">Логін:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="text-light w-full rounded-lg border border-blue-400 bg-blue-950 px-3 py-2 text-white"
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
              className="w-full rounded-lg border border-blue-400 bg-blue-950 px-3 py-2 text-white"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-blue-700 px-6 py-2 text-white transition-colors hover:bg-blue-600"
          >
            Увійти
          </button>
        </form>
        <p className="mt-4 text-center text-white">
          Немає акаунту?{" "}
          <Link to="/signup" className="text-blue-400 hover:underline">
            Зареєструйтесь
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
