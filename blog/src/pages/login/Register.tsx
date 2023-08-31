import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Grid, Box, Alert } from '@mui/material';
import { registerUser } from '../../api/api';
import { styled } from '@mui/system';

const CenteredContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
});

const FormContainer = styled('div')({
  width: '100%',
  maxWidth: '400px',
  padding: '1rem',
  boxSizing: 'border-box',
  textAlign: 'center',
});

const SameSizeButton = styled(Button)({
  marginBottom: '0.5rem', // Ajusta el margen inferior según tus preferencias
  width: '100%',
  height: 'auto',
});

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await registerUser(email, password);

      if (response.ok) {
        navigate('/login');
      } else {
        console.error('Error al registrar usuario');
        setErrorMessage('Error al registrar usuario');
      }
    } catch (error: any) {
      console.error('Error al registrar usuario:', error.message);
      setErrorMessage(error.message);
    }
  };

  return (
    <CenteredContainer>
      <FormContainer>
        <h2>Registro de Usuario</h2>
        <form onSubmit={handleRegister}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Correo Electrónico"
                variant="outlined"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Contraseña"
                variant="outlined"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <SameSizeButton type="submit" variant="contained" color="primary">
                Registrarse
              </SameSizeButton>
            </Grid>
            <Grid item xs={12}>
              <SameSizeButton onClick={() => navigate(-1)} variant="outlined" color="secondary">
                Volver Atrás
              </SameSizeButton>
            </Grid>
            <Grid item xs={12}>
              {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            </Grid>
          </Grid>
        </form>
      </FormContainer>
    </CenteredContainer>
  );
};

export default Register;
