import React, { useState } from 'react';
import { Button, Card, CardContent, Tooltip, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CommentIcon from '@mui/icons-material/Comment';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { useAppContext } from '../../../context/AppContext';
import CustomDialog from '../../dialog/CustomDialog';
import { deletePost } from '../../../api/api';
interface UserProfileProps {
  posts: Array<any>;
  fetchPosts: () => void; // Agrega la prop fetchPosts
}

const UserProfile: React.FC<UserProfileProps>  = ({ posts, fetchPosts}) => {
  const { isAuthenticated, user } = useAppContext();
  const [postToDelete, setPostToDelete] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const deletePostId = (id: number) => {
      setOpen(true);
      setPostToDelete(id);
      console.log(id)
    };

  const handleConfirmDelete = async () => {
    setOpen(false);
    try {
      await deletePost(postToDelete,user?.token);
      fetchPosts();
    } catch (error) {
      console.error('Error al eliminar el post:', error);
    }
  };

  
  return (
    <>
    <Grid container spacing={2}>
      {posts.map((post) => (
         <span onClick={() => navigate(`/view/${post.id}`)} style={{cursor: 'pointer',width:'100%',margin:'1.5vh'}} >
        <Grid item xs={12} key={post.id}>
          <Card
            sx={{
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)',
              },
              boxShadow: '10px 12px 114px rgba(10, 10, 10, 0.1)',
            }}
          >
            <CardContent>
              <Typography variant="h5" component="h2">
                {post.titulo}
              </Typography>
              <Typography variant="h6" component="h3">
                {post.autor}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Resumen: {post.resumen}
              </Typography>
              <div style={{ marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                {isAuthenticated && user?.id === post.user_id && (
                  <>
                    <Button onClick={() => navigate(`/post-edit/${post.id}`)} variant="outlined">
                      Editar
                    </Button>
                    <Button onClick={() => deletePostId(post.id)} variant="outlined" color="secondary">
                      Eliminar
                    </Button>
                  </>
                )}
                {isAuthenticated && (
                  <>
                    <Tooltip title={`Me gusta: ${post.me_gusta}`} placement="top">
                        <ThumbUpIcon />
                    </Tooltip>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </Grid>
        </span>
      ))}
    </Grid>
    <CustomDialog open={ open } setOpen={() => setOpen(!open)} handleConfirmDelete={()=>handleConfirmDelete()}/>
    </>
  );
};

export default UserProfile;
