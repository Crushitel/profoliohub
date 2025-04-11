import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <section className='container mx-auto my-7'>
      <div className='mx-3.5 lg:mx-64 px-12 md:px-26 py-8 bg-blue-900 border border-blue-400 rounded-xl'>
        <h1 className='text-white text-center text-2xl font-bold'>Вхід до платформи</h1>
        <form className='mt-4'>
          <div className='mb-4'>
            <label htmlFor='email' className='block text-white'>Email:</label>
            <input type='email' id='email' className='w-full text-white text-light px-3 py-2 border bg-blue-950 border-blue-400 rounded-lg' required />
          </div>
          <div className='mb-4'>
            <label htmlFor='password' className='block text-white'>Пароль:</label>
            <input type='password' id='password' className='w-full px-3 py-2 border text-white bg-blue-950 border-blue-400 rounded-lg' required />
          </div>
          <button type='submit' className='px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-600 transition-colors'>Увійти</button>
        </form>
        <p className='mt-4 text-white'>Немає акаунту? <Link to="/signup" className='text-purple-700 hover:underline'>Зареєструйтесь</Link></p>
      </div>
    </section>
  )
}

export default Login