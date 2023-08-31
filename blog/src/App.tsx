
import React from 'react';
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import HomePage from './pages/homePage/HomePage';
import Login from './pages/login/Login';
import { AppContextProvider } from './context/AppContext';
import PostDetail from './pages/post/component/detail/PostDetail';
import NewPost from './pages/post/component/new/NewPost';
import EditPost from './pages/post/component/edit/EditPost';
import Register from './pages/login/Register';
const App: React.FC = () => {
  return (
    <AppContextProvider>
      <Router>
        <Routes>
          <Route path="/login" element={(<Login/>)} />
          <Route path="/register" element={(<Register/>)} />
          <Route path="/" element={(<HomePage/>)} />
          <Route path="/view/:id" element={(<PostDetail/>)} />
          <Route path="/new-post" element={(<NewPost/>)} />
          <Route path="/post-edit/:id" element={(<EditPost/>)} />
        </Routes>
      </Router>
    </AppContextProvider>
  );
};

export default App;