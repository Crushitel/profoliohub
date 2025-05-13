import React from "react";
import { Link } from "react-router-dom";
import Analytic from "/Analytics.png";
import Star from "/Star.png";
import Create from "/Create.png";
import Note from "/Note.png";

const Home = () => {
  return (
    <section className="container mx-auto my-7 px-4">
      {/* Головний заголовок */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
          Створи своє персональне портфоліо – покажи світові свої досягнення!
        </h1>
        <p className="mt-4 text-sm text-blue-300 sm:text-base lg:text-lg">
          Легко створюй, редагуй і публікуй свої проєкти та досвід
        </p>
        <div className="3xl:justify-center mt-6 flex flex-col sm:flex-row sm:space-x-4">
          <Link
            to="/signup"
            className="rounded-lg bg-blue-700 px-6 py-2 text-center text-white transition-colors hover:bg-blue-600"
          >
            Зареєструватися
          </Link>
          <Link
            to="/profile"
            className="mt-4 rounded-lg border border-blue-700 bg-blue-900 px-6 py-2 text-center text-white transition-colors hover:bg-blue-800 sm:mt-0"
          >
            Перейти до профілю
          </Link>
        </div>
      </div>

      {/* Секція "Про платформу" */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-white sm:text-2xl lg:text-3xl">
          Про платформу
        </h2>
        <p className="mt-4 text-sm text-blue-300 sm:text-base lg:text-lg">
          Наша місія — допомогти кожному професіоналу створити потужний
          особистий бренд та продемонструвати свої досягнення світові. Ми
          віримо, що кожен талант заслуговує бути поміченим.
        </p>
      </div>

      {/* Секція "Основні функції" */}
      <div>
        <h3 className="mb-6 text-lg font-bold text-white sm:text-xl lg:text-2xl">
          Основні функції
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-blue-800 p-4 text-center shadow-md">
            <div className="mb-4 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center">
                <img src={Create} alt="Create" className="h-6 w-6" />
              </div>
            </div>
            <h4 className="font-bold text-white">Створення портфоліо</h4>
            <p className="mt-2 text-sm text-blue-300">
              Створюйте та редагуйте професійне портфоліо з легкістю,
              використовуючи сучасні шаблони.
            </p>
          </div>
          <div className="rounded-lg bg-blue-800 p-4 text-center shadow-md">
            <div className="mb-4 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center">
                <img src={Star} alt="Star" className="h-6 w-6" />
              </div>
            </div>
            <h4 className="font-bold text-white">Інтеграції</h4>
            <p className="mt-2 text-sm text-blue-300">
              Підключайте різномананітні сервіси та інструменти для розширення
              функціональності вашого портфоліо.
            </p>
          </div>
          <div className="rounded-lg bg-blue-800 p-4 text-center shadow-md">
            <div className="mb-4 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center">
                <img src={Analytic} alt="Analytics" className="h-6 w-6" />
              </div>
            </div>
            <h4 className="font-bold text-white">Аналітика</h4>
            <p className="mt-2 text-sm text-blue-300">
              Отримуйте детальну статистику та аналітику щодо відвідувань вашого
              портфоліо.
            </p>
          </div>
          <div className="rounded-lg bg-blue-800 p-4 text-center shadow-md">
            <div className="mb-4 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center">
                <img src={Note} alt="Note" className="h-6 w-6" />
              </div>
            </div>
            <h4 className="font-bold text-white">Відгуки та рекомендації</h4>
            <p className="mt-2 text-sm text-blue-300">
              Збирайте та демонструйте відгуки від колег та клієнтів для
              підвищення довіри.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-bold text-white sm:text-2xl lg:text-3xl">
          Як це працює?
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          
          <div className="flex items-start rounded-lg bg-blue-800 p-4 shadow-md">
            <p className="mr-4 rounded-full bg-blue-700 px-3 py-1 font-bold text-white">
              1
            </p>
            <div>
              <h4 className="font-bold text-white">
                Реєстрація та налаштування
              </h4>
              <p className="mt-2 text-sm text-blue-300">
                Створіть обліковий запис та налаштуйте свій профіль, додавши
                основну інформацію про себе та свої навички.
              </p>
            </div>
          </div>
          
          <div className="flex items-start rounded-lg bg-blue-800 p-4 shadow-md">
            <p className="mr-4 rounded-full bg-blue-700 px-3 py-1 font-bold text-white">
              2
            </p>
            <div>
              <h4 className="font-bold text-white">Додавання проєктів</h4>
              <p className="mt-2 text-sm text-blue-300">
                Додавайте свої роботи, інтегруйте сервіси та демонструйте свої
                досягнення.
              </p>
            </div>
          </div>
          
          <div className="flex items-start rounded-lg bg-blue-800 p-4 shadow-md">
            <p className="mr-4 rounded-full bg-blue-700 px-3 py-1 font-bold text-white">
              3
            </p>
            <div>
              <h4 className="font-bold text-white">Публікація та відгуки</h4>
              <p className="mt-2 text-sm text-blue-300">
                Публікуйте своє портфоліо та отримуйте відгуки від колег і
                клієнтів.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
