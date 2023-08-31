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
import PersonIcon from '@mui/icons-material/Person';
import CommentIcon from '@mui/icons-material/Comment';

const HomePage: React.FC = () => {
  const { isAuthenticated, user, logout, updatePosts, posts } = useAppContext();
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

  const handleLogout = () => {
    logout();
  };

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
      <header
        style={{
          background: 'linear-gradient(to right, #f0f0f0, #cccccc)',
          border: '1px solid #999',
          padding: '8px 0',
          marginBottom: '16px',
          width:'100%'

        }}
      >
        <Grid container spacing={2} justifyContent="space-between" alignItems="center">
          <Grid item>
            {isAuthenticated && (
              <Button
                onClick={() => navigate('/new-post')}
                variant="contained"
                color="primary"
                style={{ marginLeft: '1rem', marginRight: '1rem' }} // Agrega margen izquierdo y derecho
              >
                Crear Nuevo Post
              </Button>
            )}
          </Grid>
          <Grid item>
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '1rem' }}>
                <span>Hola, {user?.name}</span>
                <PersonIcon />
                <Button onClick={handleLogout} variant="outlined" color="secondary">
                  Cerrar Sesión
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => navigate('/login')}
                variant="outlined"
                color="primary"
                style={{ marginRight: '1rem' }} // Agrega margen derecho
              >
                Iniciar Sesión
              </Button>
            )}
          </Grid>
        </Grid>
      </header>
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
                  <Typography variant="h5" component="h2">
                    Titulo: {post.titulo}
                  </Typography>
                  <Typography variant="h6" component="h3">
                    Autor: {post.autor}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Resumen: {post.resumen}
                  </Typography>
                  <div style={{ marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Button onClick={() => navigate(`/view/${post.id}`)} variant="outlined">
                      Ver Detalles
                    </Button>
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
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirmación</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Estás seguro de que deseas eliminar este post?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
      
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
   <footer
        style={{
          borderTop: '1px solid #ccc',
          paddingTop: '1rem',
          paddingBottom: '1rem',
          textAlign: 'center',
          backgroundColor: '#f0f0f0',
          height: '10px',
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
        }}
      >
        © 2023 SynAgro. Todos los derechos reservados.
      </footer>

    </div>
  );
};

export default HomePage;
