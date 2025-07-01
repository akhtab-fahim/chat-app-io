import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx';
import Layout from './Layout.jsx';

function App() {
  const isAuthenticated = !!localStorage.getItem('accessToken');

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/chat" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/chat" />} />
          <Route path="/" element={<Navigate to={isAuthenticated ? "/chat" : "/login"} />} />
          {/* Add other routes as needed */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;