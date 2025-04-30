import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';

function SkillsTab({ profileData }) {
    const [skills, setSkills] = useState([]);
    const [availableSkills, setAvailableSkills] = useState([]);
    const [newSkill, setNewSkill] = useState('');
    const [proficiency, setProficiency] = useState(50);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Set skills from profile data
                if (profileData && profileData.UserSkills) {
                    setSkills(profileData.UserSkills);
                }
                
                // Fetch available skills for dropdown
                const skillsResponse = await axiosInstance.get('/skills');
                setAvailableSkills(skillsResponse.data || []);
            } catch (err) {
                console.error("Error fetching skills data:", err);
                setError(err.response?.data?.message || "Не вдалося завантажити дані навичок.");
            }
        };

        fetchData();
    }, [profileData]);

    const handleAddSkill = async () => {
        if (!newSkill) return;
        
        setError('');
        setSuccessMessage('');
        
        try {
            const response = await axiosInstance.post('/userskills', {
                skill_id: newSkill,
                proficiency,
                user_id: profileData.id
            });
            
            setSkills([...skills, response.data]);
            setNewSkill('');
            setProficiency(50);
            setSuccessMessage("Навичку успішно додано!");
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error("Error adding skill:", err);
            setError(err.response?.data?.message || "Не вдалося додати навичку.");
        }
    };

    const handleRemoveSkill = async (skillId) => {
        setError('');
        setSuccessMessage('');
        
        try {
            await axiosInstance.delete(`/userskills/${skillId}`);
            setSkills(skills.filter(skill => skill.id !== skillId));
            setSuccessMessage("Навичку успішно видалено!");
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error("Error removing skill:", err);
            setError(err.response?.data?.message || "Не вдалося видалити навичку.");
        }
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Навички</h2>
            
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
            
            {/* Display current skills */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Ваші поточні навички</h3>
                {skills.length === 0 ? (
                    <p className="text-gray-400">Навички ще не додані.</p>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {skills.map(skill => (
                            <div key={skill.id} className="flex items-center bg-blue-800 px-3 py-1 rounded">
                                <span>{skill.Skill?.name || 'Невідома навичка'} - {skill.proficiency}%</span>
                                <button 
                                    onClick={() => handleRemoveSkill(skill.id)}
                                    className="ml-2 text-red-400 hover:text-red-300"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            {/* Add new skill */}
            <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Додати нову навичку</h3>
                <div className="flex gap-3 items-end">
                    <div className="flex-grow">
                        <label className="block text-sm font-medium mb-2">Навичка</label>
                        <select
                            className="w-full p-2 rounded bg-blue-950 border border-blue-700 text-white"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                        >
                            <option value="">Виберіть навичку</option>
                            {availableSkills.map(skill => (
                                <option key={skill.id} value={skill.id}>
                                    {skill.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="w-1/3">
                        <label className="block text-sm font-medium mb-2">Рівень володіння (0-100%)</label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            className="w-full p-2 rounded bg-blue-950 accent-blue-700"
                            value={proficiency}
                            onChange={(e) => setProficiency(parseInt(e.target.value))}
                        />
                        <div className="text-center">{proficiency}%</div>
                    </div>
                    
                    <button
                        onClick={handleAddSkill}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                        disabled={!newSkill}
                    >
                        Додати
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SkillsTab;