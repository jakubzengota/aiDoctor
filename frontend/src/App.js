// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegulaminPage from './pages/RegulaminPage';
import KontaktPage from './pages/KontaktPage';
import Header from './components/Header';
import Footer from './components/Footer';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

// Utworzenie motywu MUI z większymi czcionkami i nową czcionką
const theme = createTheme({
  typography: {
    fontFamily: 'Poppins, Arial, sans-serif',
    h3: {
      fontSize: '2.5rem', // Zwiększenie nagłówka H3
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.8rem', // Zwiększenie nagłówka H5
      fontWeight: 400,
    },
    body1: {
      fontSize: '1.2rem', // Zwiększenie podstawowego tekstu
    },
    button: {
      fontSize: '1.1rem', // Zwiększenie tekstu przycisków
      fontWeight: 500,
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#009282' }}>
          <Header />
          <div style={{ flexGrow: 1, paddingTop: '64px' }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/regulamin" element={<RegulaminPage />} />
              <Route path="/kontakt" element={<KontaktPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;