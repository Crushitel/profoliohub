import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";

function ExperienceTab({ profileData }) {
    const [experiences, setExperiences] = useState([]);
    const [editingExperiences, setEditingExperiences] = useState({});
    const [newExperience, setNewExperience] = useState({
        company: "",
        position: "",
        start_date: "",
        end_date: "",
        description: "",
    });
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        if (profileData && profileData.Experiences) {
            setExperiences(profileData.Experiences);

            const editing = {};
            profileData.Experiences.forEach((exp) => {
                editing[exp.id] = exp.description;
            });
            setEditingExperiences(editing);
        }
    }, [profileData]);

    const handleAddExperience = async () => {
        if (
            !newExperience.company ||
            !newExperience.position ||
            !newExperience.start_date
        )
            return;

        setError("");
        setSuccessMessage("");

        try {
            const response = await axiosInstance.post("/experiences", {
                ...newExperience,
                user_id: profileData.id,
            });
            setExperiences([...experiences, response.data]);
            setNewExperience({
                company: "",
                position: "",
                start_date: "",
                end_date: "",
                description: "",
            });
            setSuccessMessage("Досвід роботи успішно додано!");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            console.error("Error adding experience:", err);
            setError(
                err.response?.data?.message || "Не вдалося додати досвід роботи.",
            );
        }
    };

    const handleDeleteExperience = async (experienceId) => {
        setError("");
        setSuccessMessage("");

        try {
            await axiosInstance.delete(`/experiences/${experienceId}`);
            setExperiences(experiences.filter((exp) => exp.id !== experienceId));
            setSuccessMessage("Досвід роботи успішно видалено!");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            console.error("Error deleting experience:", err);
            setError(
                err.response?.data?.message || "Не вдалося видалити досвід роботи.",
            );
        }
    };

    const handleDescriptionChange = (experienceId, newDescription) => {
        setEditingExperiences({
            ...editingExperiences,
            [experienceId]: newDescription,
        });
    };

    const handleSaveDescription = async (experienceId) => {
        setError("");

        try {
            const experienceToUpdate = experiences.find(
                (exp) => exp.id === experienceId,
            );
            const updatedData = {
                ...experienceToUpdate,
                description: editingExperiences[experienceId],
            };

            await axiosInstance.put(`/experiences/${experienceId}`, updatedData);

            setExperiences(
                experiences.map((experience) =>
                    experience.id === experienceId
                        ? { ...experience, description: editingExperiences[experienceId] }
                        : experience,
                ),
            );

            setSuccessMessage("Опис успішно оновлено!");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            console.error("Error updating experience:", err);
            setError(
                err.response?.data?.message ||
                "Не вдалося оновити опис досвіду роботи.",
            );
        }
    };

    return (
        <div>
            <h2 className="mb-4 text-xl font-bold">Досвід роботи</h2>

            {successMessage && (
                <div className="mb-4 rounded bg-green-700 p-2 text-white">
                    {successMessage}
                </div>
            )}

            {error && (
                <div className="mb-4 rounded bg-red-700 p-2 text-white">{error}</div>
            )}

            {/* Current Experience */}
            <div className="mb-6">
                <h3 className="mb-3 text-lg font-semibold">Ваш досвід</h3>
                {experiences.length === 0 ? (
                    <p className="text-gray-400">Досвід роботи ще не доданий.</p>
                ) : (
                    <div className="space-y-4">
                        {experiences.map((experience) => (
                            <div key={experience.id} className="rounded bg-blue-800 p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4 className="text-lg font-medium">
                                            {experience.position} в {experience.company}
                                        </h4>
                                        <p className="text-sm text-gray-300">
                                            {new Date(experience.start_date).toLocaleDateString()} -
                                            {experience.end_date
                                                ? new Date(experience.end_date).toLocaleDateString()
                                                : "Теперішній час"}
                                        </p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            className="text-red-400 hover:text-red-300"
                                            onClick={() => handleDeleteExperience(experience.id)}
                                        >
                                            ✕ Видалити
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <textarea
                                        className="w-full rounded border border-blue-700 bg-blue-950 p-2 text-white"
                                        rows="3"
                                        value={editingExperiences[experience.id] || ""}
                                        onChange={(e) =>
                                            handleDescriptionChange(experience.id, e.target.value)
                                        }
                                    />
                                    <div className="mt-2 text-right">
                                        <button
                                            className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                                            onClick={() => handleSaveDescription(experience.id)}
                                        >
                                            Зберегти зміни
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add New Experience */}
            <div>
                <h3 className="mb-3 text-lg font-semibold">Додати новий досвід</h3>
                <div className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium">Компанія</label>
                        <input
                            type="text"
                            className="w-full rounded border border-blue-700 bg-blue-950 p-2 text-white"
                            value={newExperience.company}
                            onChange={(e) =>
                                setNewExperience({ ...newExperience, company: e.target.value })
                            }
                            placeholder="Назва компанії"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">Посада</label>
                        <input
                            type="text"
                            className="w-full rounded border border-blue-700 bg-blue-950 p-2 text-white"
                            value={newExperience.position}
                            onChange={(e) =>
                                setNewExperience({ ...newExperience, position: e.target.value })
                            }
                            placeholder="Ваша посада"
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="mb-2 block text-sm font-medium">
                                Дата початку
                            </label>
                            <input
                                type="date"
                                className="w-full rounded border border-blue-700 bg-blue-950 p-2 text-white"
                                value={newExperience.start_date}
                                onChange={(e) =>
                                    setNewExperience({
                                        ...newExperience,
                                        start_date: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="flex-1">
                            <label className="mb-2 block text-sm font-medium">
                                Дата завершення (залиште порожнім, якщо поточне місце)
                            </label>
                            <input
                                type="date"
                                className="w-full rounded border border-blue-700 bg-blue-950 p-2 text-white"
                                value={newExperience.end_date}
                                onChange={(e) =>
                                    setNewExperience({
                                        ...newExperience,
                                        end_date: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">Опис</label>
                        <textarea
                            className="w-full rounded border border-blue-700 bg-blue-950 p-2 text-white"
                            rows="3"
                            value={newExperience.description}
                            onChange={(e) =>
                                setNewExperience({
                                    ...newExperience,
                                    description: e.target.value,
                                })
                            }
                            placeholder="Опишіть ваші обов'язки та досягнення"
                        />
                    </div>

                    <button
                        onClick={handleAddExperience}
                        className="focus:shadow-outline rounded bg-green-600 px-4 py-2 font-bold text-white transition-colors hover:bg-green-700 focus:outline-none"
                        disabled={
                            !newExperience.company ||
                            !newExperience.position ||
                            !newExperience.start_date
                        }
                    >
                        Додати досвід
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ExperienceTab;
