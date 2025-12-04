import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import ResultsDisplay from '../components/ResultsDisplay';
import { useSearch } from '../context/SearchContext';
import useSearchApi from '../hooks/useSearchApi'; // Importando o novo hook

/**
 * Página de resultados da busca
 * @returns {JSX.Element} Componente da página de resultados
 */
const ResultsPage = () => {
  const { 
    searchResults, 
    isLoading, 
    searchParams, 
    setSearchResults, 
    setSearchParams,
    error
  } = useSearch();
  const navigate = useNavigate();
  const { loadMockResults } = useSearchApi(); // Usando o hook para carregar mocks
  const [initialLoadDone, setInitialLoadDone] = React.useState(false);
  
  // Ao montar o componente, verificar se temos dados no contexto ou localStorage
  React.useEffect(() => {
    // Função para carregar dados do localStorage
    const loadFromLocalStorage = () => {
      try {
        const savedResults = localStorage.getItem('searchResults');
        const savedParams = localStorage.getItem('searchParams');
        
        console.log('ResultsPage - Checking localStorage:', { savedResults, savedParams });
        
        if (savedResults && savedParams) {
          // Temos dados salvos, vamos carregá-los no contexto
          setSearchResults(JSON.parse(savedResults));
          setSearchParams(JSON.parse(savedParams));
          console.log('ResultsPage - Loaded from localStorage');
          return true;
        }
      } catch (error) {
        console.error('Erro ao carregar dados do localStorage:', error);
      }
      return false;
    };

    // Se não estamos carregando e não temos resultados no contexto
    if (!isLoading && (!searchResults || searchResults.length === 0)) {
      // Tentar carregar do localStorage
      const loaded = loadFromLocalStorage();
      
      // Se não conseguimos carregar do localStorage e já tentamos o carregamento inicial
      if (!loaded && initialLoadDone) {
        console.log('ResultsPage - No data found, redirecting to home');
        navigate('/');
      } else if (!loaded) {
        // Carregar resultados mockados para demonstração
        loadMockResults();
      }
    }
    
    // Marcar que o carregamento inicial foi tentado
    setInitialLoadDone(true);
  }, [searchResults, isLoading, navigate, initialLoadDone, loadMockResults, setSearchResults, setSearchParams]);
  
  // Debug information
  console.log('ResultsPage - searchResults:', searchResults);
  console.log('ResultsPage - searchParams:', searchParams);
  
  return (
    <Container>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom
        sx={{ 
          fontWeight: 'bold',
          color: 'primary.main',
          fontSize: { xs: '1.8rem', sm: '2.125rem' }
        }}
      >
        Resultados da Busca
      </Typography>
      
      {error && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {searchParams && searchParams.origin && searchParams.destination && (
        <Box 
          sx={{ 
            mb: 2, 
            p: 2, 
            bgcolor: '#f5f5f5', 
            borderRadius: 1,
            boxShadow: 1
          }}
        >
          <Typography variant="subtitle1" gutterBottom>
            <strong>Busca:</strong> {searchParams.origin} → {searchParams.destination}
          </Typography>
          <Typography variant="subtitle2">
            <strong>Data:</strong> {searchParams.departureDate}
            {searchParams.returnDate && ` | Retorno: ${searchParams.returnDate}`}
          </Typography>
        </Box>
      )}
      
      {/* Add a button to go back to search */}
      <Box sx={{ mb: 3 }}>
        <Button 
          variant="outlined" 
          component={Link} 
          to="/"
          sx={{ mr: 2 }}
          data-testid="new-search-button"
        >
          Nova Busca
        </Button>
        
        {/* Debug button to show mock results directly */}
        <Button 
          variant="contained" 
          color="secondary"
          onClick={loadMockResults}
          data-testid="load-mock-results-button"
        >
          Carregar Resultados de Teste
        </Button>
      </Box>
      
      <ResultsDisplay 
        results={searchResults} 
        isLoading={isLoading} 
      />
    </Container>
  );
};

export default ResultsPage;
