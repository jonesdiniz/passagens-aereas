import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

// Import pages
import HomePage from './pages/HomePage';
import ResultsPage from './pages/ResultsPage';
import StrategiesPage from './pages/StrategiesPage';

// Import components and context
import { SearchProvider } from './context/SearchContext';
import ResponsiveNavigation from './components/ResponsiveNavigation';
import Footer from './components/Footer'; // Será criado no próximo passo
import theme from './theme'; // Será criado no próximo passo

/**
 * Componente principal da aplicação
 * @returns {JSX.Element} Componente App
 */
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ResponsiveNavigation />
      <Container sx={{ mt: 4, mb: 4, minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/resultados" element={<ResultsPage />} />
          <Route path="/estrategias" element={<StrategiesPage />} />
        </Routes>
      </Container>
      <Footer />
    </ThemeProvider>
  );
}

/**
 * Wrapper para App com Router e SearchProvider
 * @returns {JSX.Element} Componente AppWrapper
 */
const AppWrapper = () => (
  <Router>
    <SearchProvider>
      <App />
    </SearchProvider>
  </Router>
);

export default AppWrapper;
