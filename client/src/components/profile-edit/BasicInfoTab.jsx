import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';

function BasicInfoTab({ profileData }) {
    const [bio, setBio] = useState('');
    const [avatar, setAvatar] = useState('');
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState(''); // Додаємо стан для username
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    // Функція для форматування URL аватара з сервера
    const formatAvatarUrl = (url) => {
        if (!url) return '';
        
        // Якщо URL починається з http або https, то це повний URL
        if (url.startsWith('http')) {
            return url;
        }
        
        // Якщо URL починається з /, то це відносний шлях
        if (url.startsWith('/')) {
            return `${import.meta.env.VITE_SERVER_URL}${url}`;
        }
        
        // В іншому випадку додати базовий URL
        return `${import.meta.env.VITE_SERVER_URL}/${url}`;
    };

    useEffect(() => {
        if (profileData) {
            setBio(profileData.bio || '');
            setAvatar(profileData.avatar_url || '');
            setEmail(profileData.email || '');
            setUsername(profileData.username || ''); // Ініціалізуємо username
            
            // Форматуємо URL аватара для правильного відображення
            if (profileData.avatar_url) {
                setAvatarPreview(formatAvatarUrl(profileData.avatar_url));
            } else {
                setAvatarPreview('');
            }
            
            setFirstName(profileData.first_name || '');
            setLastName(profileData.last_name || '');
        }
    }, [profileData]);

    // Функція для обробки зміни файлу аватара
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Перевірка типу файлу
        if (!file.type.startsWith('image/')) {
            setError('Будь ласка, виберіть файл зображення');
            return;
        }

        // Перевірка розміру файлу (макс. 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Розмір файлу має бути менше 5MB');
            return;
        }

        setAvatarFile(file);
        setError('');

        // Створення превʼю зображення
        const reader = new FileReader();
        reader.onload = (e) => {
            setAvatarPreview(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    // Базова валідація email
    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Базова валідація username
    const validateUsername = (username) => {
        // Username має бути мінімум 3 символи і містити лише латинські літери, цифри та підкреслення
        return /^[a-zA-Z0-9_]{3,}$/.test(username);
    };

    const handleSaveBasicInfo = async () => {
        setSuccessMessage('');
        setError('');

        // Валідація email
        if (email && !validateEmail(email)) {
            setError('Будь ласка, введіть коректну email адресу');
            return;
        }

        // Валідація username
        if (username && !validateUsername(username)) {
            setError('Нікнейм має містити мінімум 3 символи та складатися лише з латинських літер, цифр і підкреслень');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('first_name', firstName);
            formData.append('last_name', lastName);
            formData.append('bio', bio);
            formData.append('email', email);
            formData.append('username', username); // Додаємо username до форми

            // Якщо є файл - додаємо його
            if (avatarFile) {
                formData.append('avatar_url', avatarFile);
            } else if (avatar) {
                // Якщо немає файлу, але є URL - додаємо URL
                formData.append('avatar_url_link', avatar);
            }

            const response = await axiosInstance.put('/user/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Оновлюємо превʼю, якщо сервер повернув нову URL аватара
            if (response.data && response.data.avatar_url) {
                setAvatarPreview(formatAvatarUrl(response.data.avatar_url));
                setAvatar(response.data.avatar_url);
            }

            setSuccessMessage("Основну інформацію оновлено успішно!");
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error("Error updating basic info:", err);
            setError(err.response?.data?.message || "Не вдалося оновити основну інформацію.");
        }
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Основна інформація</h2>
            {successMessage && (
                <div className="bg-green-700 text-white p-2 rounded mb-4">
                    {successMessage}
                </div>
            )}
            
            {error && (
                <div className="bg-red-700 text-white p-2 rounded mb-4">
                    {error}
                </div>
            )}
            
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Аватар</label>
                
                {/* Відображення превʼю аватара */}
                {avatarPreview && (
                    <div className="mb-3 relative">
                        <img 
                            src={avatarPreview} 
                            alt="Avatar Preview" 
                            className="h-32 w-32 rounded-full border-2 border-blue-500 object-cover" 
                        />
                    </div>
                )}
                
                {/* Завантаження файлу */}
                <div className="mb-3">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full p-2 rounded bg-blue-950 border border-blue-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-white file:bg-blue-700 file:cursor-pointer hover:file:bg-blue-600"
                    />
                    <p className="text-xs text-blue-300 mt-1">Максимальний розмір: 5MB</p>
                </div>
            </div>
            
            {/* Поле для username */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Нікнейм</label>
                <input
                    type="text"
                    className="w-full p-2 rounded bg-blue-950 border border-blue-700 text-white"
                    placeholder="Введіть ваш username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <p className="text-xs text-blue-300 mt-1">
                    Використовуйте лише латинські літери, цифри та підкреслення
                </p>
            </div>
            
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Ім'я</label>
                <input
                    type="text"
                    className="w-full p-2 rounded bg-blue-950 border border-blue-700 text-white"
                    placeholder="Введіть ваше ім'я"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
            </div>
            
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Прізвище</label>
                <input
                    type="text"
                    className="w-full p-2 rounded bg-blue-950 border border-blue-700 text-white"
                    placeholder="Введіть ваше прізвище"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
            </div>
            
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                    type="email"
                    className="w-full p-2 rounded bg-blue-950 border border-blue-700 text-white"
                    placeholder="Введіть ваш email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Біографія</label>
                <textarea
                    className="w-full p-2 rounded bg-blue-950 border border-blue-700 text-white"
                    rows="4"
                    placeholder="Розкажіть про себе..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />
            </div>
            
            <button
                onClick={handleSaveBasicInfo}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
            >
                Зберегти
            </button>
        </div>
    );
}

export default BasicInfoTab;