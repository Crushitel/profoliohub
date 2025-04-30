import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';

function ProjectsTab({ profileData }) {
    const [projects, setProjects] = useState([]);
    const [newProject, setNewProject] = useState({
        title: '',
        description: '',
        image_url: '',
        github_link: '',
        demo_link: ''
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (profileData && profileData.Projects) {
            setProjects(profileData.Projects);
        }
    }, [profileData]);

    const handleAddProject = async () => {
        if (!newProject.title || !newProject.description) return;
        
        setError('');
        setSuccessMessage('');
        
        try {
            const response = await axiosInstance.post('/projects', {
                ...newProject,
                user_id: profileData.id
            });
            setProjects([...projects, response.data]);
            setNewProject({
                title: '',
                description: '',
                image_url: '',
                github_link: '',
                demo_link: ''
            });
            setSuccessMessage("Проект успішно додано!");
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error("Error adding project:", err);
            setError(err.response?.data?.message || "Не вдалося додати проект.");
        }
    };

    const handleDeleteProject = async (projectId) => {
        setError('');
        setSuccessMessage('');
        
        try {
            await axiosInstance.delete(`/projects/${projectId}`);
            setProjects(projects.filter(project => project.id !== projectId));
            setSuccessMessage("Проект успішно видалено!");
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error("Error deleting project:", err);
            setError(err.response?.data?.message || "Не вдалося видалити проект.");
        }
    };

    const handleUpdateProject = async (projectId, updatedData) => {
        setError('');
        
        try {
            await axiosInstance.put(`/projects/${projectId}`, updatedData);
            
            setProjects(projects.map(project => 
                project.id === projectId ? {...project, ...updatedData} : project
            ));
            
        } catch (err) {
            console.error("Error updating project:", err);
            setError(err.response?.data?.message || "Не вдалося оновити проект.");
        }
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Проекти</h2>
            
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
            
            {/* Current Projects */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Ваші проекти</h3>
                {projects.length === 0 ? (
                    <p className="text-gray-400">Проекти ще не додані.</p>
                ) : (
                    <div className="space-y-4">
                        {projects.map(project => (
                            <div key={project.id} className="bg-blue-800 p-4 rounded">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-lg font-medium">{project.title}</h4>
                                    <div className="flex space-x-2">
                                        <button 
                                            className="text-red-400 hover:text-red-300"
                                            onClick={() => handleDeleteProject(project.id)}
                                        >
                                            Видалити
                                        </button>
                                    </div>
                                </div>
                                <p className="text-gray-300 mt-1">{project.description}</p>
                                <div className="mt-2 space-y-1 text-sm">
                                    {project.image_url && (
                                        <div className="flex items-center">
                                            <span className="font-medium mr-2">Зображення:</span>
                                            <input 
                                                type="text" 
                                                className="flex-grow p-1 rounded bg-blue-950 border border-blue-700 text-white"
                                                value={project.image_url}
                                                onChange={(e) => handleUpdateProject(project.id, {...project, image_url: e.target.value})}
                                            />
                                        </div>
                                    )}
                                    <div className="flex items-center">
                                        <span className="font-medium mr-2">GitHub:</span>
                                        <input 
                                            type="text" 
                                            className="flex-grow p-1 rounded bg-blue-950 border border-blue-700 text-white"
                                            value={project.github_link}
                                            onChange={(e) => handleUpdateProject(project.id, {...project, github_link: e.target.value})}
                                            placeholder="URL GitHub репозиторію"
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <span className="font-medium mr-2">Demo:</span>
                                        <input 
                                            type="text" 
                                            className="flex-grow p-1 rounded bg-blue-950 border border-blue-700 text-white"
                                            value={project.demo_link}
                                            onChange={(e) => handleUpdateProject(project.id, {...project, demo_link: e.target.value})}
                                            placeholder="URL демо-версії"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            {/* Add New Project */}
            <div>
                <h3 className="text-lg font-semibold mb-3">Додати новий проект</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Назва</label>
                        <input
                            type="text"
                            className="w-full p-2 rounded bg-blue-950 border border-blue-700 text-white"
                            value={newProject.title}
                            onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                            placeholder="Назва проекту"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-2">Опис</label>
                        <textarea
                            className="w-full p-2 rounded bg-blue-950 border border-blue-700 text-white"
                            rows="3"
                            value={newProject.description}
                            onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                            placeholder="Опишіть ваш проект"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-2">URL зображення</label>
                        <input
                            type="text"
                            className="w-full p-2 rounded bg-blue-950 border border-blue-700 text-white"
                            value={newProject.image_url}
                            onChange={(e) => setNewProject({...newProject, image_url: e.target.value})}
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-2">GitHub URL</label>
                        <input
                            type="text"
                            className="w-full p-2 rounded bg-blue-950 border border-blue-700 text-white"
                            value={newProject.github_link}
                            onChange={(e) => setNewProject({...newProject, github_link: e.target.value})}
                            placeholder="https://github.com/username/project"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-2">Demo URL</label>
                        <input
                            type="text"
                            className="w-full p-2 rounded bg-blue-950 border border-blue-700 text-white"
                            value={newProject.demo_link}
                            onChange={(e) => setNewProject({...newProject, demo_link: e.target.value})}
                            placeholder="https://yourproject.com"
                        />
                    </div>
                    
                    <button
                        onClick={handleAddProject}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                        disabled={!newProject.title || !newProject.description}
                    >
                        Додати проект
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProjectsTab;