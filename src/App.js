import './App.css';
import Chat from './pages/chat/Chat';
import Home from './pages/home/Home';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element= {<Chat /> } />
        {/* <Route exact path="/" element= { user ? <Home /> : <Navigate to="/login" replace/>} />
        <Route path="/chat/:id" element= {<Chat />} />
        <Route path="/login" element= {user ? <Navigate to="/" replace /> :  <Login />} />
        <Route path="/logout" element= {user ? <Logout /> : <Navigate to="/" replace />} />
        <Route path="/register" element= {user ?<Navigate to="/" replace /> :  <Register />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
