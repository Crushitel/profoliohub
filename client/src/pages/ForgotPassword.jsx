import React, { useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await axiosInstance.post("/user/forgot-password", { email });
      setMessage(response.data.message);
      // В розробці можна отримати токен і вивести його для зручності
      console.log("Токен для відновлення (для тестування):", response.data.resetToken);
    } catch (err) {
      setError(err.response?.data?.message || "Помилка запиту на відновлення пароля");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto my-7 px-3">
      <div className="mx-auto max-w-md rounded-lg bg-blue-900 p-6 shadow-md">
        <h1 className="text-2xl font-bold text-white">Відновлення пароля</h1>

        {message && (
          <div className="mt-4 rounded bg-green-700 p-2 text-white">
            {message}
          </div>
        )}
        
        {error && (
          <div className="mt-4 rounded bg-red-700 p-2 text-white">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label htmlFor="email" className="block text-white">
              Введіть вашу електронну пошту:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-blue-700 bg-blue-950 p-2 text-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-blue-700 px-4 py-2 font-bold text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Відправка..." : "Надіслати інструкції"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/login" className="text-blue-300 hover:text-blue-200">
            Повернутися до входу
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;