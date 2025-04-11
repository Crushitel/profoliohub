import './App.css'
import Header from './components/header/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import PageNotFound from './pages/PageNotFound'
import { Routes, Route } from 'react-router-dom'


function App() {

  return (
    <div className="App">
      <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      <Footer />
    </div>
  )
}

export default App
