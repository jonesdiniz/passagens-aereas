import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import ResultsDisplay from '../components/ResultsDisplay';
import QuoteModal from '../components/QuoteModal';
import { useSearch } from '../context/SearchContext';
import useSearchApi from '../hooks/useSearchApi'; // Importando o novo hook

/**
 * Página de resultados da busca
 * @returns {JSX.Element} Componente da página de resultados
 */
const ResultsPage = () => {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = React.useState(false);
  const { 
    searchResults, 
    isLoading, 
    searchParams, 
    setSearchResults, 
    setSearchParams,
    setSearchSummary,
    searchSummary,
    error
  } = useSearch();
  const navigate = useNavigate();
  const { loadMockResults } = useSearchApi(); // Usando o hook para carregar mocks
  const initialLoadDoneRef = React.useRef(false);
  
  // Ao montar o componente, verificar se temos dados no contexto ou localStorage
  React.useEffect(() => {
    // Função para carregar dados do localStorage
    const loadFromLocalStorage = () => {
      try {
        const savedResults = localStorage.getItem('searchResults');
        const savedParams = localStorage.getItem('searchParams');
        const savedSummary = localStorage.getItem('searchSummary');
        
        if (savedResults && savedParams) {
          // Temos dados salvos, vamos carregá-los no contexto
          setSearchResults(JSON.parse(savedResults));
          setSearchParams(JSON.parse(savedParams));
          if (savedSummary) {
            setSearchSummary(JSON.parse(savedSummary));
          }
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
      if (!loaded && initialLoadDoneRef.current) {
        console.log('ResultsPage - No data found, redirecting to home');
        navigate('/');
      } else if (!loaded) {
        // Carregar resultados mockados para demonstração
        loadMockResults();
      }
    }
    
    // Marcar que o carregamento inicial foi tentado sem forçar novo render.
    initialLoadDoneRef.current = true;
  }, [
    searchResults,
    isLoading,
    navigate,
    loadMockResults,
    setSearchResults,
    setSearchParams,
    setSearchSummary
  ]);
  
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
            <strong>Período:</strong>{' '}
            {searchSummary?.dateWindow || searchParams.departureDate || 'datas flexíveis'}
            {searchParams.returnDate && ` | Retorno: ${searchParams.returnDate}`}
          </Typography>
          {searchSummary && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              <strong>Estratégia:</strong> {searchSummary.market} | {searchSummary.dateSearchMode || searchSummary.flexibility} | {searchSummary.passengers} passageiro(s)
              {searchSummary.includesNearbyAirports ? ' | aeroportos próximos incluídos' : ''}
            </Typography>
          )}
          {searchSummary?.tripDurations?.length > 0 && (
            <Typography variant="body2" color="text.secondary">
              <strong>Durações testadas:</strong> {searchSummary.tripDurations.join(', ')} dia(s)
            </Typography>
          )}
        </Box>
      )}

      {/* Banner de Cotação com Consolidador */}
      {searchSummary?.publicBenchmarkPrice && (
        <Box 
          sx={{ 
            mb: 3, 
            p: 3, 
            bgcolor: 'primary.light', 
            color: 'primary.contrastText',
            borderRadius: 2,
            boxShadow: 2,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box>
            <Typography variant="h6" gutterBottom>
              Tarifa Pública Encontrada: {searchSummary.publicBenchmarkCurrency || 'BRL'} {searchSummary.publicBenchmarkPrice}
            </Typography>
            <Typography variant="body1">
              Quer viajar mais barato? Nossos parceiros consolidadores podem ter acesso a **tarifas secretas** para esta rota.
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            onClick={() => setIsQuoteModalOpen(true)}
            sx={{ mt: { xs: 2, md: 0 }, minWidth: '200px', fontWeight: 'bold' }}
          >
            Solicitar Tarifa Secreta
          </Button>
        </Box>
      )}
      
      <QuoteModal 
        open={isQuoteModalOpen} 
        onClose={() => setIsQuoteModalOpen(false)} 
        flightDetails={{
          route: searchSummary?.route || `${searchParams?.origin} -> ${searchParams?.destination}`,
          date: searchSummary?.dateWindow || searchParams?.departureDate,
          passengers: searchSummary?.passengers || searchParams?.passengers
        }}
        benchmarkPrice={searchSummary?.publicBenchmarkPrice}
        benchmarkCurrency={searchSummary?.publicBenchmarkCurrency}
      />
      
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
