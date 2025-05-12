import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import Avatar from "/User-avatar.svg";
// Імпортуємо іконку для email
import { FaEnvelope } from "react-icons/fa";

const PublicProfile = () => {
  const { username } = useParams(); // Отримуємо username з URL
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext); // Для перевірки авторизації
  
  // Стан для форми відгуку
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ""
  });
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get(`/user/public/${username}`);
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Не вдалося завантажити дані профілю");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewForm(prev => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value, 10) : value
    }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewError("");
    setReviewSuccess("");

    if (!reviewForm.comment) {
      setReviewError("Будь ласка, додайте коментар до вашого відгуку");
      return;
    }

    try {
      await axiosInstance.post("/testimonials", {
        user_id: profile.id, // ID користувача, якому залишають відгук
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });
      
      setReviewSuccess("Відгук успішно додано!");
      setReviewForm({ rating: 5, comment: "" });
      
      // Оновлюємо дані профілю щоб побачити новий відгук
      const response = await axiosInstance.get(`/user/public/${username}`);
      setProfile(response.data);
    } catch (err) {
      console.error("Error adding review:", err);
      setReviewError(err.response?.data?.message || "Помилка при додаванні відгуку");
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4 text-white text-center">Завантаження...</div>;
  }

  if (error || !profile) {
    return <div className="container mx-auto p-4 text-red-500">{error || "Користувача не знайдено"}</div>;
  }

  return (
    <div className="container mx-auto my-7 px-3 text-white">
      {/* Основна інформація */}
      <div className="rounded-lg bg-blue-900 p-4 md:p-6 text-center shadow-md">
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

          <p className="mt-2 text-sm text-blue-400 max-w-md">
            {profile.bio || "Інформація відсутня"}
          </p>

          {profile.email && (
            <a 
              href={`mailto:${profile.email}`}
              className="flex items-center text-blue-200 hover:text-blue-100 mt-2 transition-colors"
            >
              <FaEnvelope className="mr-2" /> Написати листа
            </a>
          )}
        </div>
      </div>

      {/* Навички */}
      <div className="mt-6 rounded-lg bg-blue-900 p-4 md:p-6 shadow-md">
        <h2 className="mb-4 text-xl font-bold">Навички</h2>
        {profile.UserSkills && profile.UserSkills.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {profile.UserSkills.map((skill) => (
              <div
                key={skill.id}
                className="rounded-lg bg-blue-700 p-2 text-center"
              >
                <p>{skill.Skill?.name}</p>
                <p className="text-sm text-blue-300">
                  Рівень: {skill.proficiency}%
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-blue-300">Інформація відсутня</p>
        )}
      </div>

      {/* Проєкти */}
      <div className="mt-6 rounded-lg bg-blue-900 p-4 md:p-6 shadow-md">
        <h2 className="mb-4 text-xl font-bold">Проєкти</h2>
        {profile.Projects && profile.Projects.length > 0 ? (
          <div className="space-y-4">
            {profile.Projects.map((project) => (
              <div key={project.id} className="rounded-lg bg-blue-700 p-4">
                {project.image_url && (
                  <div className="mb-3">
                    <img 
                      src={`http://localhost:3001${project.image_url}`} 
                      alt={project.title}
                      className="w-full h-48 object-cover rounded-lg" 
                    />
                  </div>
                )}
                <h3 className="font-bold">{project.title}</h3>
                <p>{project.description}</p>
                <div className="mt-2 flex space-x-4">
                  {project.github_link && (
                    <a
                      href={project.github_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-300 hover:underline"
                    >
                      GitHub
                    </a>
                  )}
                  {project.demo_link && (
                    <a
                      href={project.demo_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-300 hover:underline"
                    >
                      Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-blue-300">Інформація відсутня</p>
        )}
      </div>

      {/* Досвід */}
      {/* Досвід */}
<div className="mt-6 rounded-lg bg-blue-900 p-4 md:p-6 shadow-md">
  <h2 className="mb-4 text-xl font-bold">Досвід</h2>
  {profile.Experiences && profile.Experiences.length > 0 ? (
    <div className="space-y-4">
      {profile.Experiences.map((experience) => {
        // Форматування дати в стилі ДД.ММ.РРРР
        const formatDate = (dateString) => {
          if (!dateString) return "Теперішній час";
          const date = new Date(dateString);
          return date.toLocaleDateString('uk-UA'); // Формат для України: ДД.ММ.РРРР
        };
        
        const startDate = formatDate(experience.start_date);
        const endDate = experience.end_date 
          ? formatDate(experience.end_date) 
          : "Теперішній час";

        return (
          <div
            key={experience.id}
            className="rounded-lg bg-blue-700 p-4"
          >
            <h3 className="font-bold">{experience.position}</h3>
            <p className="text-sm text-blue-300">{experience.company}</p>
            <p className="text-sm text-blue-200 mt-1">
              {startDate} - {endDate}
            </p>
            <p className="mt-2">{experience.description}</p>
          </div>
        );
      })}
    </div>
  ) : (
    <p className="text-blue-300">Інформація відсутня</p>
  )}
</div>

      {/* Відгуки */}
      <div className="mt-6 rounded-lg bg-blue-900 p-4 md:p-6 shadow-md">
        <h2 className="mb-4 text-xl font-bold">Відгуки</h2>
        
        {profile.Testimonials && profile.Testimonials.length > 0 ? (
          <div className="space-y-4 mb-8">
            {profile.Testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="rounded-lg bg-blue-700 p-4"
              >
                <div className="flex items-center mb-2">
                  <div className="flex">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i} className={`text-xl ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-500'}`}>★</span>
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-blue-300">{testimonial.rating}/5</span>
                </div>
                <p>{testimonial.comment || "Коментар відсутній"}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-blue-300 mb-6">Відгуків ще немає</p>
        )}
        
        {/* Форма для додавання відгуку - відображається тільки для авторизованих користувачів, які дивляться не свій профіль */}
        {user && profile && user.id !== profile.id && (
          <div className="mt-8 border-t border-blue-700 pt-6">
            <h3 className="mb-4 text-lg font-bold">Додати відгук</h3>
            
            {reviewError && (
              <div className="mb-4 rounded bg-red-700 p-2 text-white">
                {reviewError}
              </div>
            )}
            
            {reviewSuccess && (
              <div className="mb-4 rounded bg-green-700 p-2 text-white">
                {reviewSuccess}
              </div>
            )}
            
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium">Рейтинг:</label>
                <div className="flex items-center">
                  <select
                    name="rating"
                    value={reviewForm.rating}
                    onChange={handleReviewChange}
                    className="w-full p-2 rounded bg-blue-950 border border-blue-700 text-white"
                  >
                    <option value="5">5 - Відмінно</option>
                    <option value="4">4 - Дуже добре</option>
                    <option value="3">3 - Добре</option>
                    <option value="2">2 - Задовільно</option>
                    <option value="1">1 - Погано</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium">Коментар:</label>
                <textarea
                  name="comment"
                  value={reviewForm.comment}
                  onChange={handleReviewChange}
                  className="w-full p-2 rounded bg-blue-950 border border-blue-700 text-white"
                  rows="4"
                  placeholder="Поділіться своїми враженнями про цього фахівця..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none transition-colors"
                disabled={!reviewForm.comment}
              >
                Відправити відгук
              </button>
            </form>
          </div>
        )}

        {/* Повідомлення для неавторизованих користувачів */}
        {!user && (
          <div className="mt-6 p-3 bg-blue-800 rounded text-center">
            <p>Щоб залишити відгук, будь ласка, <Link to="/login" className="text-blue-300 hover:underline">увійдіть в систему</Link></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicProfile;