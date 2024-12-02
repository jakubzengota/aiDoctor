import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import Footer from '../components/Footer';

const KontaktPage = () => {
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
          Kontakt
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: '#ffffff' }}>
          Jeśli masz jakiekolwiek pytania lub uwagi, skontaktuj się z nami pod adresem e-mail: kontakt@aidoctor.com
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: '#ffffff' }}>
          Możesz również zadzwonić pod numer: +48 123 456 789
        </Typography>
      </Container>
      <Footer/>
    </Box>
  );
};

export default KontaktPage;