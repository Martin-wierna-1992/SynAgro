import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../../context/AppContext';
import { nuevoPost } from '../../../../api/api';
import { Container, Typography, TextField, Button, Box } from '@mui/material';

const NewPost: React.FC = () => {
  const { isAuthenticated, user } = useAppContext();
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState('');
  const [resumen, setResumen] = useState('');
  const [autor, setAutor] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newPostData = {
      titulo,
      resumen,
      autor: autor || 'Autor Desconocido',
      fecha_publicacion: Date.now(),
      user_id: user?.id,
      me_gusta: 0,
      comentarios:[]
    };

    try {
      const response = await nuevoPost(newPostData);

      if (response) {
        navigate('/');
      } else {
        console.error('Error al crear la publicación');
      }
    } catch (error) {
      console.error('Error al crear la publicación:', error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Crear Nueva Publicación
      </Typography>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <TextField
          label="Título"
          variant="outlined"
          fullWidth
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
          margin="normal"
          inputProps={{maxLength :20}}
        />
        <TextField
          label="Autor"
          variant="outlined"
          fullWidth
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
          required
          margin="normal"
          inputProps={{maxLength :20}}
        />

        <TextField
          label="Resumen"
          variant="outlined"
          multiline
          fullWidth
          value={resumen}
          onChange={(e) => setResumen(e.target.value)}
          required
          margin="normal"
          rows={4}
          inputProps={{maxLength :100}}
        />

        <Button type="submit" variant="contained" color="primary" size="large" sx={{ marginTop: '1rem', width: '100%', height: '3rem' }}>
          Crear Publicación
        </Button>
      </form>
      <Button onClick={() => navigate(-1)} variant="outlined" color="secondary" sx={{ marginTop: '1rem', width: '100%', height: '3rem' }}>
        Volver Atrás
      </Button>
    </Container>
  );
};

export default NewPost;
