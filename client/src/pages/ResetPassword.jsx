import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    // Перевірка співпадіння паролів
    if (newPassword !== confirmPassword) {
      setError("Паролі не співпадають");
      setLoading(false);
      return;
    }

    // Перевірка мінімальної довжини пароля
    if (newPassword.length < 6) {
      setError("Пароль має бути не менше 6 символів");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post("/user/reset-password", {
        token,
        newPassword
      });
      
      setMessage(response.data.message);
      
      // Перенаправлення на сторінку входу після успішної зміни пароля
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Помилка при зміні пароля");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto my-7 px-3">
      <div className="mx-auto max-w-md rounded-lg bg-blue-900 p-6 shadow-md">
        <h1 className="text-2xl font-bold text-white">Встановлення нового пароля</h1>

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
            <label htmlFor="newPassword" className="block text-white">
              Новий пароль:
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded border border-blue-700 bg-blue-950 p-2 text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-white">
              Підтвердіть пароль:
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded border border-blue-700 bg-blue-950 p-2 text-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-blue-700 px-4 py-2 font-bold text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Обробка..." : "Змінити пароль"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;