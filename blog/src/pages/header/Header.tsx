import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import {  Button, Grid } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import synAgro from '../../assets/synAgro.png'


const Header: React.FC = () => {
  const {  logout, isAuthenticated ,user} = useAppContext();
  const navigate = useNavigate();
  const handleLogout = () => {
      logout();
    };

  return (
    <header
        style={{
          background: 'linear-gradient(to right, #1a237e, #0d47a1)',
          border: '1px solid #999',
          padding: '8px 0',
          marginBottom: '16px',
          width: '100%',
          textAlign: 'center', // Centrar contenido
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
                <Button
                  onClick={handleLogout}
                  variant="outlined"
                  color="secondary"
                  style={{
                    borderColor: '#FF5722', // Color del borde del botón
                    color: '#FF5722', // Color del texto del botón
                  }}
                >
                  Cerrar Sesión
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => navigate('/login')}
                variant="contained" // Cambia de outlined a contained
                color="primary"
                style={{
                  marginRight: '1rem',
                  backgroundColor: '#1976D2', // Color de fondo del botón
                  color: '#fff', // Color del texto del botón
                }}
              >
                Iniciar Sesión
              </Button>

            )}
          </Grid>
        </Grid>
      </header>
  );
};

export default Header;
