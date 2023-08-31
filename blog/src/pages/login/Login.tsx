import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/api';
import { useAppContext } from '../../context/AppContext';
import jwtDecode from 'jwt-decode';
import { Container, Typography, TextField, Button, Box, Alert } from '@mui/material';
import { styled } from '@mui/system';

const CenteredContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  
});

const Form = styled('form')({
  width: '100%',
  marginBottom: '1rem',
});

const Input = styled(TextField)({
  marginBottom: '1rem',
});

const SameSizeButton = styled(Button)({
  marginBottom: '1rem',
  width: '100%', // Establecer el ancho al 100%
  height: 'auto', // Establecer la altura en automático para que se ajuste al contenido
});


const Login: React.FC = () => {
  const { isAuthenticated, login, logout, user, updatePosts, posts } = useAppContext();
  const [emailform, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const access_token = await loginUser(emailform, password);

      const decodedToken = jwtDecode<{ id: number; email: string }>(access_token);

      const userId = decodedToken.id;
      const email = decodedToken.email;
      const token = access_token;

      login(userId, email, email, token);
      setEmail(email);
      setPassword('');
      setErrorMessage(null);
      navigate('/');
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error.message);
      setErrorMessage(error.message);
    }
  };

  return (
    <CenteredContainer maxWidth="sm">
      <Typography variant="h4" component="h2" gutterBottom>
        Iniciar Sesión
      </Typography>
      <Form onSubmit={handleLogin}>
        <Input
          label="Correo Electrónico"
          variant="outlined"
          type="email"
          fullWidth
          value={emailform}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Contraseña"
          variant="outlined"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <SameSizeButton type="submit" variant="contained" color="primary">
          Iniciar Sesión
        </SameSizeButton>
        <SameSizeButton onClick={() => navigate(-1)} variant="outlined" color="secondary">
          Volver Atrás
        </SameSizeButton>

        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      </Form>
      <Box mt={2}>
        <Typography>
          No tienes cuenta? <Link to="/register">Registrarse</Link>
        </Typography>
      </Box>
    </CenteredContainer>
  );
};

export default Login;
