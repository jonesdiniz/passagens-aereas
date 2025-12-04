import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

/**
 * Componente para exibição dos resultados da busca de passagens
 * 
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.results - Lista de resultados a serem exibidos
 * @param {boolean} props.isLoading - Indica se os resultados estão sendo carregados
 * @returns {JSX.Element} Componente de exibição de resultados
 */
const ResultsDisplay = ({ results = [], isLoading = false }) => {
  const [expandedDetails, setExpandedDetails] = useState({});
  const [displayResults, setDisplayResults] = useState([]);
  
  // Configuração para responsividade
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Efeito para atualizar os resultados exibidos quando o prop results mudar
  useEffect(() => {
    console.log('ResultsDisplay - Received results:', results);
    setDisplayResults(results);
  }, [results]);

  /**
   * Alterna a exibição de detalhes para um resultado específico
   * @param {string} index - Identificador único do resultado
   */
  const toggleDetails = (index) => {
    setExpandedDetails(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Group results by type
  const groupedResults = {
    Dinheiro: displayResults.filter(r => r.type === 'Dinheiro'),
    Milhas: displayResults.filter(r => r.type === 'Milhas'),
    Consolidator: displayResults.filter(r => r.type === 'Consolidator')
  };

  // Componente de esqueleto para carregamento
  if (isLoading) {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="h5" gutterBottom>Carregando resultados...</Typography>
        {[1, 2, 3].map((item) => (
          <Card key={`skeleton-${item}`} sx={{ mb: 2 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Skeleton variant="text" width="60%" height={32} />
                  <Skeleton variant="text" width="30%" height={24} sx={{ mt: 1 }} />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
                  <Skeleton variant="text" width="40%" height={32} sx={{ ml: 'auto' }} />
                  <Skeleton variant="text" width="30%" height={24} sx={{ mt: 1, ml: 'auto' }} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  // Mensagem quando não há resultados
  if (!displayResults || displayResults.length === 0) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="info">
          Nenhum resultado encontrado. Tente ajustar os parâmetros de busca ou use o botão &apos;Carregar Resultados de Teste&apos; acima.
        </Alert>
      </Box>
    );
  }

  /**
   * Renderiza um card de resultado
   * @param {Object} result - Dados do resultado
   * @param {string} type - Tipo do resultado (Dinheiro, Milhas, Consolidator)
   * @param {number} index - Índice do resultado na lista
   * @returns {JSX.Element} Card de resultado
   */
  const renderResultCard = (result, type, index) => {
    const cardId = `${type.toLowerCase()}-${index}`;
    const chipColor = type === 'Dinheiro' ? 'primary' : 
      type === 'Milhas' ? 'secondary' : 'success';
    
    return (
      <Card 
        key={cardId} 
        sx={{ 
          mb: 2,
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 3
          }
        }}
        data-testid={`result-card-${cardId}`}
      >
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} sx={{ order: isMobile ? 1 : 0 }}>
              <Typography variant="h6">{result.source}</Typography>
              <Chip 
                label={type} 
                color={chipColor} 
                size="small" 
                sx={{ mt: 1 }} 
              />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ textAlign: isMobile ? 'left' : 'right', order: isMobile ? 0 : 1 }}>
              <Typography variant="h5">
                {type === 'Dinheiro' ? `R$ ${result.price}` : result.price}
              </Typography>
              <Button 
                size="small" 
                onClick={() => toggleDetails(cardId)}
                sx={{ mt: 1 }}
                aria-expanded={expandedDetails[cardId]}
                aria-controls={`details-${cardId}`}
                data-testid={`details-button-${cardId}`}
              >
                {expandedDetails[cardId] ? 'Menos detalhes' : 'Mais detalhes'}
              </Button>
            </Grid>
            {expandedDetails[cardId] && (
              <Grid item xs={12} id={`details-${cardId}`}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2">{result.details}</Typography>
                
                {type === 'Milhas' && (
                  <Button 
                    variant="outlined" 
                    size="small" 
                    sx={{ mt: 1 }}
                    component={Link}
                    href="#" // TODO: Add actual link
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Verificar disponibilidade de milhas"
                    data-testid={`verify-miles-${cardId}`}
                  >
                    Verificar Disponibilidade
                  </Button>
                )}
                
                {type === 'Consolidator' && (
                  <>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      sx={{ mt: 1, mr: 1 }}
                      component={Link}
                      href="#" // TODO: Add actual link
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Verificar na Agência Z"
                      data-testid={`agency-z-${cardId}`}
                    >
                      Agência Z
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      sx={{ mt: 1 }}
                      component={Link}
                      href="#" // TODO: Add actual link
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Verificar na Agência W"
                      data-testid={`agency-w-${cardId}`}
                    >
                      Agência W
                    </Button>
                  </>
                )}
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  // Renderização dos resultados agrupados por tipo
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h5" gutterBottom>Resultados em Dinheiro</Typography>
      {groupedResults.Dinheiro && groupedResults.Dinheiro.length > 0 ? (
        groupedResults.Dinheiro.map((result, index) => 
          renderResultCard(result, 'Dinheiro', index)
        )
      ) : (
        <Typography variant="body2" sx={{ mb: 2 }}>Nenhum resultado em dinheiro encontrado.</Typography>
      )}

      <Typography variant="h5" gutterBottom>Estratégias com Milhas</Typography>
      {groupedResults.Milhas && groupedResults.Milhas.length > 0 ? (
        groupedResults.Milhas.map((result, index) => 
          renderResultCard(result, 'Milhas', index)
        )
      ) : (
        <Typography variant="body2" sx={{ mb: 2 }}>Nenhuma estratégia com milhas encontrada.</Typography>
      )}

      <Typography variant="h5" gutterBottom>Oportunidades Consolidator</Typography>
      {groupedResults.Consolidator && groupedResults.Consolidator.length > 0 ? (
        groupedResults.Consolidator.map((result, index) => 
          renderResultCard(result, 'Consolidator', index)
        )
      ) : (
        <Typography variant="body2" sx={{ mb: 2 }}>Nenhuma oportunidade consolidator encontrada.</Typography>
      )}
    </Box>
  );
};

export default ResultsDisplay;
