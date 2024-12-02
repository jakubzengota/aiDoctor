import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import Footer from '../components/Footer';

const RegulaminPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#009282',
      }}
    >
      <Container maxWidth="md" sx={{ py: 4, flexGrow: 1 }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ color: '#ffffff' }}>
          Regulamin
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: '#ffffff' }}>
          Niniejszy regulamin określa zasady korzystania z aplikacji AI Doctor.
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: '#ffffff' }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus elementum risus id lorem tristique, ac
          condimentum libero viverra.
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: '#ffffff' }}>
          Curabitur dictum dui sed orci dictum, ac dapibus elit malesuada.
        </Typography>
      </Container>
      <Footer/>
    </Box>
  );
};

export default RegulaminPage;