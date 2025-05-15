import React, { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';

function SecurityTab() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    const handlePasswordChange = async () => {
        setSuccessMessage('');
        setError('');

        // Валідація
        if (!currentPassword) {
            setError('Введіть поточний пароль');
            return;
        }
        
        if (newPassword.length < 6) {
            setError('Новий пароль має бути не менше 6 символів');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            setError('Паролі не співпадають');
            return;
        }

        try {
            await axiosInstance.post('/user/change-password', {
                currentPassword,
                newPassword
            });
            
            setSuccessMessage('Пароль успішно змінено');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Помилка при зміні пароля');
        }
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Безпека</h2>
            
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
            
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Зміна пароля</h3>
                
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Поточний пароль</label>
                    <input
                        type="password"
                        className="w-full p-2 rounded bg-blue-950 border border-blue-700 text-white"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Введіть поточний пароль"
                    />
                </div>
                
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Новий пароль</label>
                    <input
                        type="password"
                        className="w-full p-2 rounded bg-blue-950 border border-blue-700 text-white"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Введіть новий пароль"
                    />
                </div>
                
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Підтвердження пароля</label>
                    <input
                        type="password"
                        className="w-full p-2 rounded bg-blue-950 border border-blue-700 text-white"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Підтвердіть новий пароль"
                    />
                </div>
                
                <button
                    onClick={handlePasswordChange}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                >
                    Змінити пароль
                </button>
            </div>
        </div>
    );
}

export default SecurityTab;