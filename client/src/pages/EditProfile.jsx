import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

// Імпорт компонентів вкладок
import BasicInfoTab from "../components/profile-edit/BasicInfoTab";
import SkillsTab from "../components/profile-edit/SkillsTab";
import ProjectsTab from "../components/profile-edit/ProjectsTab";
import ExperienceTab from "../components/profile-edit/ExperienceTab";
import SecurityTab from "../components/profile-edit/SecurityTab";

function EditProfile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("bio");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get("/user/profile");
        setProfileData(response.data);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError(
          err.response?.data?.message ||
            "Не вдалося завантажити дані профілю для редагування.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleCancel = () => {
    navigate("/profile");
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-white">Завантаження...</div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-red-500">Помилка: {error}</div>
    );
  }

  return (
    <div className="container mx-auto my-7 px-3 text-white">
      <h1 className="mb-6 text-2xl font-bold">Редагування профілю</h1>

      {/* Tabs Navigation - горизонтальний скролл для мобільних */}
      <div className="scrollbar-hide mb-6 overflow-x-auto border-b border-blue-700">
        <div className="flex whitespace-nowrap">
          <button
            className={`mr-2 min-w-24 rounded-t-lg py-3 text-sm transition-colors sm:px-4 md:min-w-0 md:py-2 md:text-base ${activeTab === "bio" ? "bg-blue-700" : "hover:bg-blue-800"}`}
            onClick={() => setActiveTab("bio")}
          >
            Основна
          </button>
          <button
            className={`mr-2 min-w-24 rounded-t-lg py-3 text-sm transition-colors sm:px-4 md:min-w-0 md:py-2 md:text-base ${activeTab === "security" ? "bg-blue-700" : "hover:bg-blue-800"}`}
            onClick={() => setActiveTab("security")}
          >
            Безпека
          </button>
          <button
            className={`mr-2 min-w-24 rounded-t-lg py-3 text-sm transition-colors sm:px-4 md:min-w-0 md:py-2 md:text-base ${activeTab === "skills" ? "bg-blue-700" : "hover:bg-blue-800"}`}
            onClick={() => setActiveTab("skills")}
          >
            Навички
          </button>
          <button
            className={`mr-2 min-w-24 rounded-t-lg py-3 text-sm transition-colors sm:px-4 md:min-w-0 md:py-2 md:text-base ${activeTab === "projects" ? "bg-blue-700" : "hover:bg-blue-800"}`}
            onClick={() => setActiveTab("projects")}
          >
            Проекти
          </button>
          <button
            className={`mr-2 min-w-24 rounded-t-lg py-3 text-sm transition-colors sm:px-4 md:min-w-0 md:py-2 md:text-base ${activeTab === "experience" ? "bg-blue-700" : "hover:bg-blue-800"}`}
            onClick={() => setActiveTab("experience")}
          >
            Досвід
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mb-6 rounded-lg bg-blue-900 p-4 shadow-md md:p-6">
        {activeTab === "bio" && <BasicInfoTab profileData={profileData} />}
        {activeTab === "skills" && <SkillsTab profileData={profileData} />}
        {activeTab === "projects" && <ProjectsTab profileData={profileData} />}
        {activeTab === "experience" && (
          <ExperienceTab profileData={profileData} />
        )}
        {activeTab === "testimonials" && (
          <TestimonialsTab profileData={profileData} />
        )}
        {activeTab === "security" && <SecurityTab />}
      </div>

      {/* Bottom Actions */}
      <div className="mt-6">
        <button
          onClick={handleCancel}
          className="focus:shadow-outline rounded bg-gray-500 px-4 py-2 font-bold text-white transition-colors hover:bg-gray-700 focus:outline-none"
        >
          Повернутися до профілю
        </button>
      </div>
    </div>
  );
}

export default EditProfile;
