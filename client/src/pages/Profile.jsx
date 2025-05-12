import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "/User-avatar.svg";
import axiosInstance from "../utils/axiosInstance";
// Імпортуємо іконку для email
import { FaEnvelope } from "react-icons/fa";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/user/profile"); // Запит до сервера
        setProfile(response.data);
        setLoading(false);
      } catch {
        setError("Не вдалося завантажити дані профілю");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="mt-6 text-center text-white">Завантаження...</div>;
  }

  if (error) {
    return <div className="mt-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto my-7 px-3 text-white">
      <div className="rounded-lg bg-blue-900 p-6 text-center shadow-md">
        <div className="flex flex-col items-center">
          <div className="mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-white">
            {profile.avatar_url ? (
              <img
                src={`http://localhost:3001/${profile.avatar_url}`}
                alt="Avatar"
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <img src={Avatar} alt="avatar" className="w-14" />
            )}
          </div>
          <h1 className="text-2xl font-bold">
            {profile.first_name} {profile.last_name}
          </h1>
          <p className="text-blue-300">@{profile.username}</p>

          <p className="mt-2 text-sm text-blue-400">
            {profile.bio || "Інформація відсутня"}
          </p>

          {/* Додаємо email під username */}
          {profile.email && (
            <p className="mt-1 flex items-center justify-center text-blue-200">
              <FaEnvelope className="mr-2" /> {profile.email}
            </p>
          )}

          <Link
            to="/profile/edit"
            className="mt-4 inline-block rounded bg-blue-700 px-4 py-2 font-bold text-white hover:bg-blue-600"
          >
            Редагувати профіль
          </Link>
        </div>
      </div>

      {/* Навички */}
      <div className="mt-6 rounded-lg bg-blue-900 p-6 shadow-md">
        <h2 className="mb-4 text-xl font-bold">Навички</h2>
        {profile.UserSkills && profile.UserSkills.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {profile.UserSkills.map((skill) => (
              <div
                key={skill.Skill.id}
                className="rounded-lg bg-blue-700 p-2 text-center"
              >
                <p>{skill.Skill.name}</p>
                <p className="text-sm text-blue-300">
                  Рівень: {skill.proficiency}%
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>Інформація відсутня</p>
        )}
      </div>

      {/* Проєкти */}
<div className="mt-6 rounded-lg bg-blue-900 p-6 shadow-md">
  <h2 className="mb-4 text-xl font-bold">Проєкти</h2>
  {profile.Projects && profile.Projects.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {profile.Projects.map((project) => (
        <div key={project.id} className="rounded-lg bg-blue-700 p-4 flex flex-col h-full">
          <div className="flex-1">
            {project.image_url && (
              <div className="mb-3">
                <img 
                  src={`http://localhost:3001/${project.image_url}`} 
                  alt={project.title}
                  className="w-full h-36 rounded-lg" 
                />
              </div>
            )}
            <h3 className="font-bold text-lg mb-1">{project.title}</h3>
            <p className="text-sm text-blue-200 line-clamp-3 mb-2">{project.description}</p>
          </div>
          <div className="mt-auto flex space-x-4">
            {project.github_link && (
              <a
                href={project.github_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:underline text-sm"
              >
                GitHub
              </a>
            )}
            {project.demo_link && (
              <a
                href={project.demo_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:underline text-sm"
              >
                Demo
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p>Інформація відсутня</p>
  )}
</div>

      {/* Досвід */}
      <div className="mt-6 rounded-lg bg-blue-900 p-6 shadow-md">
        <h2 className="mb-4 text-xl font-bold">Досвід</h2>
        {profile.Experiences && profile.Experiences.length > 0 ? (
          profile.Experiences.map((experience) => {
            // Функція для форматування дати у форматі ДД.ММ.РРРР
            const formatDate = (dateString) => {
              if (!dateString) return "Теперішній час";
              const date = new Date(dateString);
              return date.toLocaleDateString("uk-UA"); // Формат для України: ДД.ММ.РРРР
            };

            const startDate = formatDate(experience.start_date);
            const endDate = experience.end_date
              ? formatDate(experience.end_date)
              : "Теперішній час";

            return (
              <div
                key={experience.id}
                className="mb-4 rounded-lg bg-blue-700 p-4"
              >
                <h3 className="font-bold">{experience.position}</h3>
                <p className="text-sm text-blue-300">{experience.company}</p>
                <p className="mt-1 text-sm text-blue-200">
                  {startDate} - {endDate}
                </p>
                <p className="mt-2">{experience.description}</p>
              </div>
            );
          })
        ) : (
          <p>Інформація відсутня</p>
        )}
      </div>

      {/* Відгуки */}
      <div className="mt-6 rounded-lg bg-blue-900 p-6 shadow-md">
        <h2 className="mb-4 text-xl font-bold">Відгуки</h2>

        {profile.Testimonials && profile.Testimonials.length > 0 ? (
          <div className="mb-8 space-y-4">
            {profile.Testimonials.map((testimonial) => (
              <div key={testimonial.id} className="rounded-lg bg-blue-700 p-4">
                <div className="mb-2 flex items-center">
                  <div className="flex">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        className={`text-xl ${i < testimonial.rating ? "text-yellow-400" : "text-gray-500"}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-blue-300">
                    {testimonial.rating}/5
                  </span>
                </div>
                <p>{testimonial.comment || "Коментар відсутній"}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mb-6 text-blue-300">Відгуків ще немає</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
