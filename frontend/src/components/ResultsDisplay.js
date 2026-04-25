import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const TYPE_CONFIG = {
  Dinheiro: { title: 'Resultados em Dinheiro', color: 'primary' },
  'Acordos comerciais': { title: 'Acordos Comerciais', color: 'success' },
  'Janelas sugeridas': { title: 'Datas Indicadas pelo Aplicativo', color: 'warning' },
  Milhas: { title: 'Estratégias com Milhas', color: 'secondary' },
  'Rotas alternativas': { title: 'Rotas Alternativas', color: 'info' },
  Consolidator: { title: 'Agências e Consolidators', color: 'success' },
  Monitoramento: { title: 'Monitoramento e Alertas', color: 'warning' },
  Checklist: { title: 'Checklist Final', color: 'default' }
};

const TYPE_ORDER = [
  'Acordos comerciais',
  'Janelas sugeridas',
  'Dinheiro',
  'Rotas alternativas',
  'Milhas',
  'Consolidator',
  'Monitoramento',
  'Checklist'
];

const formatPrice = (price, type) => {
  if (typeof price === 'number') {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(price);
  }

  if (type === 'Dinheiro' && /^\d+$/.test(String(price))) {
    return `R$ ${price}`;
  }

  return price;
};

const groupByType = (results) => results.reduce((groups, result) => {
  const type = result.type || 'Outras estratégias';
  return {
    ...groups,
    [type]: [...(groups[type] || []), result]
  };
}, {});

const getOrderedTypes = (groups) => [
  ...TYPE_ORDER.filter(type => groups[type]?.length),
  ...Object.keys(groups).filter(type => !TYPE_ORDER.includes(type))
];

/**
 * Componente para exibição dos resultados da busca de passagens.
 *
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.results - Lista de resultados a serem exibidos
 * @param {boolean} props.isLoading - Indica se os resultados estão sendo carregados
 * @returns {JSX.Element} Componente de exibição de resultados
 */
const ResultsDisplay = ({ results = [], isLoading = false }) => {
  const [expandedDetails, setExpandedDetails] = useState({});
  const displayResults = results;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleDetails = (id) => {
    setExpandedDetails(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

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

  if (!displayResults || displayResults.length === 0) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="info">
          Nenhum resultado encontrado. Faça uma nova busca ou carregue resultados de demonstração.
        </Alert>
      </Box>
    );
  }

  const groupedResults = groupByType(displayResults);
  const orderedTypes = getOrderedTypes(groupedResults);

  const renderResultCard = (result, type, index) => {
    const config = TYPE_CONFIG[type] || { title: type, color: 'default' };
    const cardId = result.id || `${type.toLowerCase()}-${index}`;
    const isExpanded = !!expandedDetails[cardId];

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
            <Grid item xs={12} sm={7} sx={{ order: isMobile ? 1 : 0 }}>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 1 }}>
                <Chip label={type} color={config.color} size="small" />
                {result.priority && <Chip label={`Prioridade ${result.priority}`} size="small" variant="outlined" />}
                {result.confidence && <Chip label={`Confiança ${result.confidence}`} size="small" variant="outlined" />}
              </Stack>
              <Typography variant="h6">{result.source}</Typography>
              {result.savingsHint && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {result.savingsHint}
                </Typography>
              )}
            </Grid>

            <Grid
              item
              xs={12}
              sm={5}
              sx={{ textAlign: isMobile ? 'left' : 'right', order: isMobile ? 0 : 1 }}
            >
              <Typography variant="h5">
                {formatPrice(result.price, type)}
              </Typography>
              <Button
                size="small"
                onClick={() => toggleDetails(cardId)}
                sx={{ mt: 1 }}
                aria-expanded={isExpanded}
                aria-controls={`details-${cardId}`}
                data-testid={`details-button-${cardId}`}
              >
                {isExpanded ? 'Menos detalhes' : 'Mais detalhes'}
              </Button>
            </Grid>

            {isExpanded && (
              <Grid item xs={12} id={`details-${cardId}`}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2">{result.details}</Typography>

                {result.tags?.length > 0 && (
                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 2 }}>
                    {result.tags.map(tag => (
                      <Chip key={tag} label={tag} size="small" variant="outlined" />
                    ))}
                  </Stack>
                )}

                {result.steps?.length > 0 && (
                  <List dense sx={{ mt: 1 }}>
                    {result.steps.map((step, stepIndex) => (
                      <ListItem key={`${cardId}-step-${stepIndex}`} disableGutters>
                        <ListItemText
                          primary={`${stepIndex + 1}. ${step}`}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}

                {result.dateOptions?.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Janelas para testar
                    </Typography>
                    <Grid container spacing={1}>
                      {result.dateOptions.map(option => (
                        <Grid item xs={12} sm={6} md={4} key={`${cardId}-${option.departureDate}-${option.returnDate}`}>
                          <Box
                            sx={{
                              border: '1px solid',
                              borderColor: 'divider',
                              borderRadius: 1,
                              p: 1.25,
                              bgcolor: 'background.default'
                            }}
                          >
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {option.label}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              {option.durationDays ? `${option.durationDays} dias` : 'Data exata'}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                              {formatPrice(option.estimatedPrice, 'Dinheiro')}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              {option.agreementAngle}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {result.actions?.length > 0 && (
                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1 }}>
                    {result.actions.map(action => (
                      <Button
                        key={`${cardId}-${action.label}`}
                        variant="outlined"
                        size="small"
                        component={Link}
                        href={action.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        endIcon={<OpenInNewIcon fontSize="small" />}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </Stack>
                )}
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ mt: 2 }}>
      {orderedTypes.map(type => {
        const config = TYPE_CONFIG[type] || { title: type };
        return (
          <Box key={type} sx={{ mb: 3 }}>
            <Typography variant="h5" gutterBottom>{config.title}</Typography>
            {groupedResults[type].map((result, index) => renderResultCard(result, type, index))}
          </Box>
        );
      })}
    </Box>
  );
};

export default ResultsDisplay;
