import React, { createContext, useState, useContext, useEffect } from 'react';

/**
 * Contexto para gerenciar o estado global da busca de passagens
 * @type {React.Context}
 */
const SearchContext = createContext();

/**
 * Provider para o contexto de busca
 * 
 * Gerencia o estado global da aplicação relacionado à busca de passagens,
 * incluindo resultados, parâmetros, estado de carregamento e erros.
 * Implementa persistência via localStorage para manter dados entre sessões.
 * 
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Componentes filhos
 * @returns {JSX.Element} Provider do contexto
 */
export const SearchProvider = ({ children }) => {
  // Inicializa estados com valores do localStorage, se disponíveis
  const [searchResults, setSearchResults] = useState(() => {
    try {
      const savedResults = localStorage.getItem('searchResults');
      return savedResults ? JSON.parse(savedResults) : [];
    } catch (error) {
      console.error('Erro ao carregar resultados do localStorage:', error);
      return [];
    }
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [searchParams, setSearchParams] = useState(() => {
    try {
      const savedParams = localStorage.getItem('searchParams');
      return savedParams ? JSON.parse(savedParams) : {};
    } catch (error) {
      console.error('Erro ao carregar parâmetros do localStorage:', error);
      return {};
    }
  });

  // Persiste resultados no localStorage quando mudam
  useEffect(() => {
    if (searchResults && searchResults.length > 0) {
      try {
        localStorage.setItem('searchResults', JSON.stringify(searchResults));
      } catch (error) {
        console.error('Erro ao salvar resultados no localStorage:', error);
      }
    }
  }, [searchResults]);

  // Persiste parâmetros de busca no localStorage quando mudam
  useEffect(() => {
    if (searchParams && Object.keys(searchParams).length > 0) {
      try {
        localStorage.setItem('searchParams', JSON.stringify(searchParams));
      } catch (error) {
        console.error('Erro ao salvar parâmetros no localStorage:', error);
      }
    }
  }, [searchParams]);

  /**
   * Limpa todos os dados de busca (resultados e parâmetros)
   */
  const clearSearchData = () => {
    setSearchResults([]);
    setSearchParams({});
    try {
      localStorage.removeItem('searchResults');
      localStorage.removeItem('searchParams');
    } catch (error) {
      console.error('Erro ao limpar dados do localStorage:', error);
    }
  };

  // Values to be provided to consumers
  const value = {
    searchResults,
    setSearchResults,
    isLoading,
    setIsLoading,
    error,
    setError,
    searchParams,
    setSearchParams,
    clearSearchData
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

/**
 * Hook personalizado para acessar o contexto de busca
 * 
 * @returns {Object} Objeto contendo o estado e as funções do contexto de busca
 * @throws {Error} Se usado fora de um SearchProvider
 */
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch deve ser usado dentro de um SearchProvider');
  }
  return context;
};
