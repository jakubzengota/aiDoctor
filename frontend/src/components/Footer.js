// Footer.js
import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ p: 2, backgroundColor: '#006060', color: '#fff', textAlign: 'center', mt: 'auto' }}>
                <Typography variant="body2">
                    © 2024 AI Doctor. Wszelkie prawa zastrzeżone.{' '}
                    <a href="/regulamin" style={{ color: '#009282', textDecoration: 'none' }}>Regulamin</a> <a style={{ color: '#009282', textDecoration: 'none' }}>|{' '}</a>
                    <a href="/kontakt" style={{ color: '#009282', textDecoration: 'none' }}>Kontakt</a>
                </Typography>
            </Box>
  );
};

export default Footer;