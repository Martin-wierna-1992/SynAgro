import React, { useEffect, useState } from 'react';
import UserProfile from './component/UserProfile';
import { useAppContext } from '../../context/AppContext';
import { getPostById, getPostByIdUser } from '../../api/api';
import { useNavigate } from 'react-router-dom';
import Header from '../header/Header';
const MyProfilePage: React.FC = () => {
  const { isAuthenticated, user } = useAppContext();
  const [userPosts, setUserPosts] = useState([]);
  const navigate = useNavigate();

  const fetchPosts = async () => {
      try {
        if (isAuthenticated && user) {
          const postDataArray = await getPostByIdUser(user.id);
          setUserPosts(postDataArray);
        }
      } catch (error) {
        console.error('Error al obtener los datos del post:', error);
      }
    };
  useEffect(() => {
      if(!isAuthenticated){
        navigate('/')
      }

    fetchPosts();
  }, [isAuthenticated, user]);

  console.log('userPosts',userPosts)
  return (
    <div>
      <Header/>
      <h1>Mis Publicaciones</h1>
      <UserProfile posts={userPosts} fetchPosts={()=>fetchPosts()} />
    </div>
  );
};

export default MyProfilePage;




