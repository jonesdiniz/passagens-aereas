import React from 'react';
import axios from 'axios';
import { useSearch } from '../context/SearchContext';

/**
 * Custom hook para lidar com a lógica de busca de passagens aéreas na API.
 * @returns {Object} Objeto contendo funções para submeter a busca e carregar mocks.
 */
const useSearchApi = () => {
  const {
    setSearchResults,
    setIsLoading,
    setError,
    setSearchParams,
    setSearchSummary,
    searchParams
  } = useSearch();

  /**
   * Carrega resultados mockados para demonstração
   */
  const loadMockResults = React.useCallback(() => {
    const dateOptions = [
      {
        departureDate: '2026-10-06',
        returnDate: '2026-10-13',
        label: '06/10/2026 a 13/10/2026',
        durationDays: 7,
        estimatedPrice: 4280,
        agreementAngle: 'Boa janela para allotments, bloqueios de agência e tarifas de curta permanência.'
      },
      {
        departureDate: '2026-10-14',
        returnDate: '2026-10-20',
        label: '14/10/2026 a 20/10/2026',
        durationDays: 6,
        estimatedPrice: 4390,
        agreementAngle: 'Boa janela para testar tarifa privada e permanência mínima.'
      }
    ];
    const mockResults = [
      {
        id: 'commercial-private-fares',
        source: 'Acordos comerciais e tarifas privadas',
        price: 4280,
        type: 'Acordos comerciais',
        priority: 'Alta',
        confidence: 'Média',
        details: 'Solicitar cotação com tarifas privadas, classes negociadas, bloqueios de agência e acordos de consolidador.',
        tags: ['tarifa privada', 'GDS', 'consolidator'],
        steps: ['Enviar as janelas sugeridas.', 'Pedir tarifa pública versus privada.', 'Comparar regras antes de pagar.'],
        actions: [{ label: 'Buscar agências com GDS', url: 'https://www.google.com/search?q=agencia+de+viagens+tarifa+consolidator+passagem+aerea' }],
        dateOptions,
        savingsHint: 'Maior chance de superar metabuscas quando há flexibilidade.'
      },
      {
        id: 'cash-metasearch-flex',
        source: 'Metabusca com datas flexíveis',
        price: 920,
        type: 'Dinheiro',
        priority: 'Alta',
        confidence: 'Média',
        details: 'Pesquisar em metabuscas usando janela de +/- 3 dias, comparando ida e volta com trechos separados.',
        tags: ['comparação ampla', 'datas flexíveis'],
        steps: ['Comparar calendário de preços.', 'Validar preço final no site da companhia.'],
        actions: [
          { label: 'Google Flights', url: 'https://www.google.com/travel/flights' },
          { label: 'Skyscanner', url: 'https://www.skyscanner.com.br/' }
        ],
        dateOptions,
        savingsHint: 'Boa primeira varredura para descobrir o piso de preço.'
      },
      {
        id: 'route-nearby-airports',
        source: 'Aeroportos alternativos',
        price: 'Verificar',
        type: 'Rotas alternativas',
        priority: 'Alta',
        confidence: 'Média',
        details: 'Testar aeroportos próximos na origem, destino e conexão antes de decidir.',
        tags: ['aeroportos próximos', 'conexões'],
        steps: ['Pesquisar por código metropolitano.', 'Somar custo de deslocamento terrestre.'],
        actions: [{ label: 'Pesquisar rotas', url: 'https://www.google.com/travel/flights' }]
      },
      {
        id: 'miles-programs',
        source: 'Milhas, pontos e parceiros',
        price: '35k a 90k milhas + taxas',
        type: 'Milhas',
        priority: 'Média',
        confidence: 'Média',
        details: 'Consultar programas nacionais e parceiros de aliança antes de transferir pontos.',
        tags: ['milhas', 'pontos transferíveis'],
        steps: ['Pesquisar no programa da companhia operadora.', 'Comparar com programas parceiros.'],
        actions: [{ label: 'Buscar programas', url: 'https://www.google.com/search?q=programas+de+milhas+passagens+aereas' }]
      },
      {
        id: 'agency-consolidator',
        source: 'Agências e consolidators',
        price: 'Cotação manual',
        type: 'Consolidator',
        priority: 'Média',
        confidence: 'Média',
        details: 'Pedir cotação assistida para itinerários complexos, bagagem ou grupos.',
        tags: ['cotação manual', 'tarifas negociadas'],
        steps: ['Enviar datas e flexibilidade.', 'Comparar regras de remarcação e reembolso.'],
        actions: [{ label: 'Buscar agências', url: 'https://www.google.com/search?q=agencia+de+viagens+tarifa+consolidator+passagem+aerea' }]
      },
    ];
    console.log('Setting mock results directly:', mockResults);
    setSearchResults(mockResults);
    setSearchSummary({
      route: 'São Paulo (GRU/CGH/VCP) -> Nova York (JFK/EWR/LGA)',
      market: 'Internacional',
      passengers: 1,
      cabin: 'economy',
      dateSearchMode: 'próximos 6 meses',
      dateWindow: 'próximos 6 meses',
      tripDurations: [5, 6, 7],
      suggestedDates: dateOptions,
      flexibility: 'janela de +/- 3 dias',
      includesNearbyAirports: true,
      knownLocations: true
    });

    // Se não temos parâmetros de busca, criar um conjunto padrão para demonstração
    if (!searchParams || Object.keys(searchParams).length === 0) {
      const defaultParams = {
        origin: 'São Paulo',
        destination: 'Nova York',
        departureDate: null,
        passengers: 1,
        cabin: 'economy',
        flexibility: 'threeDays',
        dateSearchMode: 'nextSixMonths',
        durationProfile: 'oneWeek',
        includeNearbyAirports: true
      };
      setSearchParams(defaultParams);
    }
  }, [setSearchResults, setSearchSummary, searchParams, setSearchParams]);

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
      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
      const response = await axios.post(`${backendUrl}/api/search`, searchParams);
      console.log('API Response:', response.data);
      
      // Ensure we have results before navigating
      if (response.data && Array.isArray(response.data.results)) {
        setSearchResults(response.data.results);
        setSearchSummary(response.data.summary || null);
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
