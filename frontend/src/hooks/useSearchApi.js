import React from 'react';
import axios from 'axios';
import { useSearch } from '../context/SearchContext';

/**
 * Custom hook para lidar com a lógica de busca de passagens aéreas na API.
 * @returns {Object} Objeto contendo funções para submeter a busca e carregar mocks.
 */
const useSearchApi = () => {
  const { setSearchResults, setIsLoading, setError, setSearchParams, searchParams } = useSearch();

  /**
   * Carrega resultados mockados para demonstração
   */
  const loadMockResults = React.useCallback(() => {
    const mockResults = [
      { source: 'Companhia A', price: 500, type: 'Dinheiro', details: 'Voo direto' },
      { source: 'Agregador B', price: 480, type: 'Dinheiro', details: '1 escala' },
      {
        source: 'Estratégia Milhas',
        price: '30k milhas + R$50',
        type: 'Milhas',
        details: 'Sugestão: Usar programa X com parceira Y (tabela fixa)',
      },
      {
        source: 'Consolidator Info',
        price: 'Verificar',
        type: 'Consolidator',
        details: 'Verificar agências Z e W para possíveis tarifas especiais nesta rota.',
      },
    ];
    console.log('Setting mock results directly:', mockResults);
    setSearchResults(mockResults);

    // Se não temos parâmetros de busca, criar um conjunto padrão para demonstração
    if (!searchParams || Object.keys(searchParams).length === 0) {
      const defaultParams = {
        origin: 'São Paulo',
        destination: 'Nova York',
        departureDate: '2025-10-15'
      };
      setSearchParams(defaultParams);
    }
  }, [setSearchResults, searchParams, setSearchParams]);

  /**
   * Manipula o envio do formulário de busca
   * @param {Object} searchParams - Parâmetros da busca
   * @param {Function} navigate - Função de navegação do React Router
   */
  const handleSearchSubmit = async (searchParams, navigate) => {
    console.log('Search Parameters:', searchParams);
    setIsLoading(true);
    setError(null);
    setSearchResults([]); // Clear previous results
    setSearchParams(searchParams); // Store search parameters

    try {
      // Usando variável de ambiente para a URL base do backend
      const backendUrl = process.env.REACT_APP_BACKEND_URL || '';
      const response = await axios.post(`${backendUrl}/api/search`, searchParams);
      console.log('API Response:', response.data);
      
      // Ensure we have results before navigating
      if (response.data && Array.isArray(response.data.results)) {
        setSearchResults(response.data.results);
        navigate('/resultados'); // Navigate to results page upon successful search
      } else {
        console.error('Invalid response format:', response.data);
        setError('Formato de resposta inválido do servidor.');
        
        // Mesmo com erro de formato, carregamos resultados mockados e navegamos
        loadMockResults();
        navigate('/resultados');
      }
    } catch (err) {
      console.error('API Error:', err);
      setError(err.response?.data?.error || 'Falha ao buscar resultados. Carregando dados de demonstração.');
      
      // Em caso de erro na API, carregamos resultados mockados e navegamos
      loadMockResults();
      navigate('/resultados');
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSearchSubmit, loadMockResults };
};

export default useSearchApi;
