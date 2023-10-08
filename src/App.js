import './App.css';
import Chat from './pages/chat/Chat';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Logout from './pages/logout/Logout';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom"
import { useSelector } from 'react-redux';


function App() {
  const user= useSelector((state)=>state.user.user_id)

  console.log(user)

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element= { user ? <Home /> : <Navigate to="/login" replace /> } />
        <Route path="/c/:id" element= {<Chat /> } />
        {/* <Route path="/chat/:id" element= {<Chat />} /> */}
        <Route path="/login" element= {user ? <Navigate to="/" replace /> :  <Login />} />
        <Route path="/logout" element= {user ? <Logout /> : <Navigate to="/login" replace />} />
        <Route path="/register" element= {user ? <Navigate to="/" replace /> :  <Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
