import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';

function BasicInfoTab({ profileData }) {
    const [bio, setBio] = useState('');
    const [avatar, setAvatar] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (profileData) {
            setBio(profileData.bio || '');
            setAvatar(profileData.avatar_url || '');
            setFirstName(profileData.first_name || '');
            setLastName(profileData.last_name || '');
        }
    }, [profileData]);

    const handleSaveBasicInfo = async () => {
        setSuccessMessage('');
        setError('');
        try {
            await axiosInstance.put('/user/profile', {
                bio,
                avatar_url: avatar,
                first_name: firstName,
                last_name: lastName
            });
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
                <label className="block text-sm font-medium mb-2">URL аватара</label>
                <input
                    type="text"
                    className="w-full p-2 rounded bg-blue-950 border border-blue-700 text-white"
                    placeholder="Введіть URL зображення аватара"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                />
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