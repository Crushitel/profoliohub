import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ token });
    }

    // Перевірка та оновлення токена кожні 10 хвилин
    const interval = setInterval(() => {
      refreshToken();
    }, 10 * 60 * 1000); // 10 хвилин

    return () => clearInterval(interval);
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    setUser({ token });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const refreshToken = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        logout();
        return;
      }

      const response = await axios.get('http://localhost:3001/api/user/autorize', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newToken = response.data.token;
      localStorage.setItem('token', newToken);
      setUser({ token: newToken });
    } catch (error) {
      console.error('Помилка оновлення токена:', error);
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;