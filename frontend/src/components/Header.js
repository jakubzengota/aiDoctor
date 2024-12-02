// Header.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#006060' }}>
      <Toolbar>
        <Typography 
          variant="h5" 
          component={Link} 
          to="/" 
          sx={{ 
            flexGrow: 1, 
            color: '#fff', 
            textDecoration: 'none', 
            fontWeight: 'bold',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          AI Doctor
        </Typography>
        <Button color="inherit" component={Link} to="/regulamin">Regulamin</Button>
        <Button color="inherit" component={Link} to="/kontakt">Kontakt</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;