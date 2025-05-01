import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import Avatar from "/User-avatar.svg";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    username: true,
    name: true,
    skill: true
  });
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState('');

  // Завантаження списку навичок для фільтрування
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axiosInstance.get('/skills');
        setSkills(response.data || []);
      } catch (err) {
        console.error('Помилка завантаження навичок:', err);
      }
    };

    fetchSkills();
  }, []);

  // Функція пошуку
  const handleSearch = async () => {
    if (!searchTerm && !selectedSkill) {
      setError('Введіть пошуковий запит або виберіть навичку');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Формуємо параметри запиту
      const params = new URLSearchParams();
      
      if (searchTerm) {
        if (filters.username) params.append('username', searchTerm);
        if (filters.name) params.append('name', searchTerm);
      }
      
      if (selectedSkill) {
        params.append('skill_id', selectedSkill);
      }

      // Виконуємо запит до API
      const response = await axiosInstance.get(`/user/search?${params.toString()}`);
      setSearchResults(response.data);
      
      if (response.data.length === 0) {
        setError('Користувачів не знайдено');
      }
    } catch (err) {
      console.error('Помилка пошуку:', err);
      setError('Сталася помилка під час пошуку. Спробуйте пізніше.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Обробник для зміни фільтрів
  const handleFilterChange = (filter) => {
    setFilters({
      ...filters,
      [filter]: !filters[filter]
    });
  };

  return (
    <div className="container mx-auto my-7 px-3 text-white">
      <h1 className="text-2xl font-bold mb-6">Пошук користувачів</h1>

      <div className="mb-8 bg-blue-900 p-4 md:p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Поле пошуку */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Введіть ім'я користувача або навичку..."
              className="w-full p-3 bg-blue-950 border border-blue-700 rounded-md text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          {/* Випадаючий список навичок */}
          <div className="w-full md:w-1/3">
            <select
              className="w-full p-3 bg-blue-950 border border-blue-700 rounded-md text-white"
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
            >
              <option value="">Усі навички</option>
              {skills.map(skill => (
                <option key={skill.id} value={skill.id}>
                  {skill.name}
                </option>
              ))}
            </select>
          </div>

          {/* Кнопка пошуку */}
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-blue-700 hover:bg-blue-600 transition-colors rounded-md font-bold"
          >
            Знайти
          </button>
        </div>

        {/* Фільтри пошуку */}
        <div className="flex flex-wrap gap-3">
          <p className="text-blue-300">Шукати за:</p>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="mr-2 accent-blue-500"
              checked={filters.username}
              onChange={() => handleFilterChange('username')}
            />
            <span>Логін</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="mr-2 accent-blue-500"
              checked={filters.name}
              onChange={() => handleFilterChange('name')}
            />
            <span>Ім'я та прізвище</span>
          </label>
        </div>
      </div>

      {/* Відображення помилки */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Індикатор завантаження */}
      {loading && <div className="text-center py-10">Пошук користувачів...</div>}

      {/* Результати пошуку */}
      {!loading && searchResults.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Результати пошуку</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((user) => (
              <div key={user.id} className="bg-blue-900 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-14 h-14 rounded-full bg-white mr-3 flex items-center justify-center">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt="Avatar" className="w-full h-full rounded-full" />
                    ) : (
                      <img src={Avatar} alt="Default avatar" className="w-10" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {user.first_name} {user.last_name}
                    </h3>
                    <p className="text-blue-300">@{user.username}</p>
                  </div>
                </div>

                {/* Навички */}
                {user.UserSkills && user.UserSkills.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm text-blue-400 mb-1">Навички:</p>
                    <div className="flex flex-wrap gap-1">
                      {user.UserSkills.slice(0, 3).map((userSkill) => (
                        <span key={userSkill.id} className="text-xs bg-blue-700 px-2 py-1 rounded">
                          {userSkill.Skill?.name}
                        </span>
                      ))}
                      {user.UserSkills.length > 3 && (
                        <span className="text-xs bg-blue-800 px-2 py-1 rounded">
                          +{user.UserSkills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-3">
                  <Link 
                    to={`/profile/${user.username}`} 
                    className="block w-full text-center py-2 bg-blue-700 hover:bg-blue-600 transition-colors rounded"
                  >
                    Переглянути профіль
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;