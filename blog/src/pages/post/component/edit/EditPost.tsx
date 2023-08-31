import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../../../../context/AppContext';
import { getPostById, editarPost } from '../../../../api/api';
import { Container, Typography, TextField, Button } from '@mui/material';

const EditPost: React.FC = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();
  const { id } = useParams();
  const [titulo, setTitulo] = useState('');
  const [resumen, setResumen] = useState('');
  const [comentarios, setComentarios] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postDataArray = await getPostById(id);

        if (postDataArray.length > 0) {
          const postData = postDataArray[0];
          setTitulo(postData.titulo);
          setResumen(postData.resumen);
          setComentarios(postData.comentarios);
        }
      } catch (error) {
        console.error('Error al obtener los datos del post:', error);
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedPostData = {
      id: id,
      titulo,
      resumen,
      autor: user?.name || 'Autor Desconocido',
      fecha_publicacion: Date.now(),
      user_id: user?.id,
      me_gusta: 0,
      comentarios: comentarios|| [],
    };

    try {
      const response = await editarPost(updatedPostData, id, user?.token);

      if (response) {
        navigate('/');
      } else {
        console.error('Error al editar el post');
      }
    } catch (error) {
      console.error('Error al editar el post:', error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div>
        <Typography variant="h4" component="h2" gutterBottom>
          Editar Publicación
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Título"
            variant="outlined"
            fullWidth
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            style={{ marginBottom: '16px' }} 
            inputProps={{maxLength :50}}
            
          />

          <TextField
            label="Resumen"
            variant="outlined"
            multiline
            fullWidth
            value={resumen}
            onChange={(e) => setResumen(e.target.value)}
            required
            style={{ marginBottom: '16px' }}
            inputProps={{maxLength :120}}

          />

          <Button type="submit" variant="contained" color="primary" style={{ marginRight: '8px' }}>
            Guardar Cambios
          </Button>

          <Button onClick={() => navigate(-1)} variant="outlined" color="secondary">
            Volver Atrás
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default EditPost;
