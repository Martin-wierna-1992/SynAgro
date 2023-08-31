import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { useAppContext } from '../../context/AppContext';
import { publicaciones, deletePost as deletePostApi, addComentario } from '../../api/api';
import { editPostAndReturnResult } from '../../helper/addLikeByPost';
import Tooltip from '@mui/material/Tooltip';
import {  TextField } from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import Header from '../header/Header';
import CustomDialog from '../dialog/CustomDialog';
import Footer from '../footer/Footer';

const HomePage: React.FC = () => {
  const { isAuthenticated, user, updatePosts, posts } = useAppContext();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [postToDelete, setPostToDelete] = useState<number | null>(null);

  const fetchPosts = async () => {
    try {
      const blogsResponse = await publicaciones();
      const sortedPosts = blogsResponse.sort((a: { fecha_publicacion: number; }, b: { fecha_publicacion: number; }) => b.fecha_publicacion - a.fecha_publicacion);
      updatePosts(sortedPosts);
    } catch (error) {
      console.error('Error al obtener las publicaciones:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  

  const deletePost = (id: number) => {
    setOpen(true);
    setPostToDelete(id);
  };

  const handleConfirmDelete = async () => {
    setOpen(false);
    try {
      await deletePostApi(postToDelete, user?.token);
      fetchPosts();
    } catch (error) {
      console.error('Error al eliminar el post:', error);
    }
  };

  const handleLike = async (postId: number) => {
    const like = await editPostAndReturnResult(postId,user?.token)
    fetchPosts();
  };
  const openCommentDialog = (postId: number, comment: string) => {
    setCommentOpen(!commentOpen);
    setPostToDelete(postId);
    if (user?.token && comment !== '') {
      addCommentPost(postId, comment, user.token);
    } else {
      console.error("User token is undefined.");
    }
  };
  const addCommentPost = async (postId: number,comment: string,token: string) => {
    try {
      const blogsResponse = await addComentario(postId,comment,token);
      setComment('')
      fetchPosts();
    } catch (error) {
      console.error('Error al obtener las publicaciones:', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header/>
       <section style={{ flex: 1, marginBottom: '10rem' }}>
        <h3 style={{ marginLeft:'1rem' }}  >Publicaciones Recientes</h3>
        <hr style={{ borderTop: '1px solid #ccc', margin: '0.5rem 0' }} />
        
        <Grid container spacing={2}>
          {posts.map((post) => (
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
                  <span onClick={() => navigate(`/view/${post.id}`)} style={{cursor: 'pointer'}}>
                    <Typography variant="h5" component="h2">
                      {post.titulo}
                    </Typography>
                    <Typography variant="h6" component="h3">
                    {post.autor}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Resumen: {post.resumen}
                    </Typography>
                  </span>
                  <div style={{ marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {/* <Button onClick={() => navigate(`/view/${post.id}`)} variant="outlined">
                      Ver Detalles
                    </Button> */}
                    {isAuthenticated && user?.id === post.user_id && (
                      <>
                        <Button onClick={() => navigate(`/post-edit/${post.id}`)} variant="outlined">
                          Editar
                        </Button>
                        <Button onClick={() => deletePost(post.id)} variant="outlined" color="secondary">
                          Eliminar
                        </Button>
                       
                      </>
                    )}
                    {isAuthenticated && (
                      <>
                        <Tooltip title={`Comentarios: ${post.comentarios ? post.comentarios.length : 0}`} placement="top">
                          <Button onClick={() => openCommentDialog(post.id, '')} variant="outlined" color="secondary">
                            <CommentIcon />
                          </Button>
                        </Tooltip>
                        <Tooltip title={`Me gusta: ${post.me_gusta}`} placement="top">
                          <Button onClick={() => handleLike(post.id)} variant="outlined" color="primary">
                            <ThumbUpIcon />
                          </Button>
                        </Tooltip>
                      </>
                    )}
                    
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </section>
      <CustomDialog open={ open } setOpen={() => setOpen(!open)} handleConfirmDelete={()=>handleConfirmDelete()}/>
      
    <Dialog
      open={commentOpen}
      onClose={() => setCommentOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Nuevo comentario para el post </DialogTitle>
      <DialogContent>
        <TextField
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          label="Comentario"
        />
        <DialogContentText id="alert-dialog-description">
          Agrega un nuevo comentario a este posteo para que el autor pueda verlo
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setCommentOpen(false)} color="primary">
          Cancelar
        </Button>
        <Button
            onClick={() => {
              if (postToDelete !== null) {
                openCommentDialog(postToDelete, comment);
              }
            }}
            color="primary"
            autoFocus
          >
            Agregar
          </Button>
      </DialogActions>
    </Dialog>
   <Footer/>
    </div>
  );
};

export default HomePage;
