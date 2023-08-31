import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Button, Grid, Menu, MenuItem } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import synAgro from '../../assets/synAgro.png';

const Header: React.FC = () => {
  const { logout, isAuthenticated, user } = useAppContext();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
  };

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null); // Estado para el ancla del menú

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  return (
    <header
      style={{
        background: 'linear-gradient(to right, rgba(21, 54, 103, 1), rgba(13, 71, 161, 1))',
        border: '1px solid #999',
        padding: '8px 0',
        marginBottom: '16px',
        width: '100%',
        textAlign: 'center',
      }}
    >
      <Grid container spacing={2} justifyContent="space-between" alignItems="center">
        <Grid item>
          {isAuthenticated && (
            <>
              <Button
                onClick={() => navigate('/new-post')}
                variant="contained"
                color="primary"
                style={{ marginLeft: '1rem', marginRight: '1rem' }}
              >
                Crear Nuevo Post
              </Button>
            </>
          )}
        </Grid>
        <Grid item>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '1rem' }}>
              <span style={{ color: 'white' }}>Hola, {user?.name}</span>
              <PersonIcon />
              <Button
                onClick={handleMenuOpen}
                variant="outlined"
                color="secondary"
                style={{
                  borderColor: '#FF5722',
                  color: '#FF5722',
                }}
              >
                Menú
              </Button>
              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={() => navigate('/')}>Inicio</MenuItem>
                <MenuItem onClick={() => navigate('/profile')}>Perfil</MenuItem>
                <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
              </Menu>
            </div>
          ) : (
            <Button
              onClick={() => navigate('/login')}
              variant="contained"
              color="primary"
              style={{
                marginRight: '1rem',
                backgroundColor: '#1976D2',
                color: '#fff',
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
