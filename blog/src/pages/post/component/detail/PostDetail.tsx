import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../../context/AppContext';
import { Card, CardContent, Typography, Button, Divider } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { styled } from '@mui/system';

const StyledCardContainer = styled('div')({
  width: '90%',
  marginLeft: '5%',
  marginRight: '5%',
  display: 'flex',
  flexDirection: 'column',
  marginTop: '2rem',
});

const StyledCardContent = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
});

const CommentContainer = styled('div')({
  marginTop: '1rem',
});

interface Comentario {
  id: number;
  comentario: string;
}

const PostDetail: React.FC = () => {
  const { posts } = useAppContext();
  const navigate = useNavigate();
  const { id } = useParams();
  const selectedPost = posts.find((post) => post.id === Number(id));

  if (!selectedPost) {
    return <div>Post no encontrado</div>;
  }

  return (
    <div>
      <header>
        <Button variant="outlined" onClick={() => navigate('/')}>
          Volver al menú principal
        </Button>
      </header>
      <StyledCardContainer>
        <Card variant="outlined">
          <StyledCardContent>
            <Typography variant="h4" gutterBottom>
              Titulo: {selectedPost.titulo}
            </Typography>
            <Typography variant="h6">Autor: {selectedPost.autor}</Typography>
            <Typography variant="body1">Resumen: {selectedPost.resumen}</Typography>
            <Typography variant="body2" color="textSecondary">
              Fecha: {new Date(selectedPost.fecha_publicacion).toLocaleDateString()}
            </Typography>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
              <ThumbUpIcon color="primary" style={{ marginRight: '0.5rem' }} /> {/* Margen derecho al icono */}
              <Typography variant="body2" color="textSecondary">
                Me gusta: {selectedPost.me_gusta}
              </Typography>
            </div>
          </StyledCardContent>
        </Card>
        {selectedPost.comentarios && selectedPost.comentarios.length > 0 && (
          <Card variant="outlined">
            <StyledCardContent>
              <Typography variant="h6">Comentarios:</Typography>
              {selectedPost.comentarios.map((comentario: Comentario) => (
                <CommentContainer key={comentario.id}>
                  <Typography variant="body2">
                    {comentario.comentario}
                  </Typography>
                  <Divider />
                </CommentContainer>
              ))}
            </StyledCardContent>
          </Card>
        )}
      </StyledCardContainer>
    </div>
  );
};

export default PostDetail;
