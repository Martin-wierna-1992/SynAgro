import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import {  Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Tooltip, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';


const Footer: React.FC = () => {

  return (
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
  );
};

export default Footer;
