import React, { useEffect, useState } from 'react';
import Avatar from '/User-avatar.svg'; 
import axiosInstance from '../utils/axiosInstance';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/user/profile'); // Запит до сервера
        setProfile(response.data); 
        setLoading(false);
      } catch {
        setError('Не вдалося завантажити дані профілю');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="text-white text-center mt-6">Завантаження...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto my-7 px-3 text-white">
      {/* Основна інформація */}
      <div className="bg-blue-900 p-6 rounded-lg shadow-md text-center">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-white rounded-full mb-4 flex items-center justify-center">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Avatar"
                className="w-full h-full rounded-full"
              />
            ) : (
              <img src={Avatar} alt="avatar" className="w-14" />
            )}
          </div>
          <h1 className="text-2xl font-bold">
            {profile.first_name} {profile.last_name}
          </h1>
          <p className="text-blue-300">@{profile.username}</p>
          <p className="text-blue-400 text-sm">
            {profile.bio || 'Інформація відсутня'}
          </p>
        </div>
      </div>

      {/* Навички */}
      <div className="bg-blue-900 p-6 mt-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Навички</h2>
        {profile.UserSkills && profile.UserSkills.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {profile.UserSkills.map((skill) => (
              <div key={skill.Skill.id} className="bg-blue-700 p-2 rounded-lg text-center">
                <p>{skill.Skill.name}</p>
                <p className="text-sm text-blue-300">Рівень: {skill.proficiency}%</p>
              </div>
            ))}
          </div>
        ) : (
          <p>Інформація відсутня</p>
        )}
      </div>

      {/* Проєкти */}
      <div className="bg-blue-900 p-6 mt-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Проєкти</h2>
        {profile.Projects && profile.Projects.length > 0 ? (
          profile.Projects.map((project) => (
            <div key={project.id} className="bg-blue-700 p-4 rounded-lg mb-4">
              <h3 className="font-bold">{project.title}</h3>
              <p>{project.description}</p>
              <div className="flex space-x-4 mt-2">
                {project.github_link && (
                  <a
                    href={project.github_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-300 underline"
                  >
                    GitHub
                  </a>
                )}
                {project.demo_link && (
                  <a
                    href={project.demo_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-300 underline"
                  >
                    Demo
                  </a>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>Інформація відсутня</p>
        )}
      </div>

      {/* Досвід */}
      <div className="bg-blue-900 p-6 mt-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Досвід</h2>
        {profile.Experiences && profile.Experiences.length > 0 ? (
          profile.Experiences.map((experience) => {
            const startYear = new Date(experience.start_date).getFullYear();
            const endYear = experience.end_date
              ? new Date(experience.end_date).getFullYear()
              : 'Теперішній час';

            return (
              <div key={experience.id} className="bg-blue-700 p-4 rounded-lg mb-4">
                <h3 className="font-bold">{experience.position}</h3>
                <p className="text-sm text-blue-300">{experience.company}</p>
                <p>
                  {startYear} - {endYear}
                </p>
                <p>{experience.description}</p>
              </div>
            );
          })
        ) : (
          <p>Інформація відсутня</p>
        )}
      </div>

      {/* Відгуки */}
      <div className="bg-blue-900 p-6 mt-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Відгуки</h2>
        {profile.Testimonials && profile.Testimonials.length > 0 ? (
          profile.Testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-blue-700 p-4 rounded-lg mb-4">
              <p className="font-bold">Рейтинг: {testimonial.rating} / 5</p>
              <p>{testimonial.comment || 'Коментар відсутній'}</p>
            </div>
          ))
        ) : (
          <p>Інформація відсутня</p>
        )}
      </div>
    </div>
  );
};

export default Profile;