import React from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import SearchForm from '../components/SearchForm';
import useSearchApi from '../hooks/useSearchApi'; // Importando o novo hook

/**
 * Página inicial com formulário de busca
 * @returns {JSX.Element} Componente da página inicial
 */
const HomePage = () => {
  const navigate = useNavigate();
  const { handleSearchSubmit } = useSearchApi(); // Usando o hook

  /**
   * Função de callback para o SearchForm
   * @param {Object} searchParams - Parâmetros da busca
   */
  const onSearch = (searchParams) => {
    // Passa os parâmetros e a função de navegação para o hook
    handleSearchSubmit(searchParams, navigate);
  };

  return (
    <Container>
      <Box sx={{ my: 4, textAlign: 'center' }}>
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
          Busca de Passagens Aéreas
        </Typography>
        <Typography 
          paragraph
          sx={{ 
            maxWidth: '800px',
            mx: 'auto',
            mb: 4
          }}
        >
          Bem-vindo ao sistema de busca de passagens aéreas. Insira seus dados de viagem abaixo para encontrar as melhores opções e estratégias.
        </Typography>
      </Box>
      <Box 
        sx={{ 
          maxWidth: '800px', 
          mx: 'auto',
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: 'background.paper'
        }}
      >
        <SearchForm onSearch={onSearch} />
      </Box>
    </Container>
  );
};

export default HomePage;
