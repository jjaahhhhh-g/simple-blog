import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProvider from './providers/AuthProvider';
import Register from './pages/Register.tsx';
import Login from './pages/Login.tsx';
import BlogsList from './pages/BlogsList.tsx';
import CreateBlog from './pages/CreateBlog.tsx';
import UpdateBlog from './pages/UpdateBlog.tsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<BlogsList />} />
          <Route path="/create" element={<CreateBlog />} />
          <Route path="/update/:id" element={<UpdateBlog />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App
