import React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/**
 * Página de estratégias e dicas
 * @returns {JSX.Element} Componente da página de estratégias
 */
const StrategiesPage = () => (
  <Container>
    <Box sx={{ my: 4 }}>
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
        Estratégias e Dicas
      </Typography>
      <Typography paragraph>
        Aprenda mais sobre como encontrar passagens baratas utilizando milhas, acordos comerciais e outras técnicas.
      </Typography>
    </Box>
    
    <Box sx={{ mb: 5 }}>
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          mt: 4,
          color: 'secondary.main',
          fontWeight: 'medium'
        }}
      >
        Utilizando Milhas de Forma Estratégica
      </Typography>
      
      <Typography paragraph>
        As milhas aéreas são uma das formas mais eficientes de economizar em passagens, especialmente em rotas internacionais e classes executivas. Aqui estão algumas estratégias essenciais:
      </Typography>
      
      <Typography 
        variant="h6" 
        gutterBottom
        sx={{ fontWeight: 'medium' }}
      >
        1. Tabelas Fixas vs. Dinâmicas
      </Typography>
      
      <Typography paragraph>
        Programas com tabelas fixas (como Smiles e TAP Miles&Go) oferecem previsibilidade e geralmente melhores valores em rotas específicas. Já programas com precificação dinâmica (como LATAM Pass) variam conforme a demanda, mas podem ter promoções interessantes em baixa temporada.
      </Typography>
      
      <Typography 
        variant="h6" 
        gutterBottom
        sx={{ fontWeight: 'medium' }}
      >
        2. Parceiros e Alianças
      </Typography>
      
      <Typography paragraph>
        Muitas vezes, usar milhas de um programa para voar em uma companhia parceira oferece melhor custo-benefício. Por exemplo, milhas Smiles para voar Emirates ou milhas Avianca LifeMiles para voar Lufthansa geralmente custam menos do que usar milhas dos programas dessas próprias companhias.
      </Typography>
      
      <Typography 
        variant="h6" 
        gutterBottom
        sx={{ fontWeight: 'medium' }}
      >
        3. Acúmulo Estratégico
      </Typography>
      
      <Typography paragraph>
        Concentre suas milhas em programas com boas opções de resgate e transferência. Cartões de crédito com pontos flexíveis que podem ser transferidos para múltiplos programas oferecem maior versatilidade.
      </Typography>
    </Box>
    
    <Box sx={{ mb: 5 }}>
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          mt: 4,
          color: 'secondary.main',
          fontWeight: 'medium'
        }}
      >
        Tarifas Consolidator e Emissões por Lote
      </Typography>
      
      <Typography paragraph>
        Consolidators são empresas que compram grandes volumes de passagens diretamente das companhias aéreas a preços reduzidos. Essas tarifas geralmente não estão disponíveis para o público geral, mas podem ser acessadas através de:
      </Typography>
      
      <Typography 
        variant="h6" 
        gutterBottom
        sx={{ fontWeight: 'medium' }}
      >
        1. Agências de Viagens Especializadas
      </Typography>
      
      <Typography paragraph>
        Algumas agências têm acesso a tarifas consolidator e podem oferecer preços significativamente mais baixos, especialmente para rotas internacionais complexas ou em classe executiva.
      </Typography>
      
      <Typography 
        variant="h6" 
        gutterBottom
        sx={{ fontWeight: 'medium' }}
      >
        2. Plataformas de Emissão em Lote
      </Typography>
      
      <Typography paragraph>
        Serviços como CentralDeEmissao.com.br permitem que agências credenciadas acessem tarifas especiais negociadas em volume.
      </Typography>
    </Box>
    
    <Box sx={{ mb: 5 }}>
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          mt: 4,
          color: 'secondary.main',
          fontWeight: 'medium'
        }}
      >
        Acordos Comerciais entre Companhias
      </Typography>
      
      <Typography paragraph>
        Companhias aéreas formam alianças e acordos que podem ser aproveitados para encontrar melhores tarifas:
      </Typography>
      
      <Typography 
        variant="h6" 
        gutterBottom
        sx={{ fontWeight: 'medium' }}
      >
        1. Codeshare
      </Typography>
      
      <Typography paragraph>
        Voos operados por uma companhia mas vendidos por outra podem ter preços diferentes. Compare sempre o mesmo voo em diferentes sites de companhias parceiras.
      </Typography>
      
      <Typography 
        variant="h6" 
        gutterBottom
        sx={{ fontWeight: 'medium' }}
      >
        2. Alianças Globais
      </Typography>
      
      <Typography paragraph>
        Star Alliance, Oneworld e SkyTeam oferecem passagens com múltiplas companhias que podem ser mais baratas que comprar separadamente.
      </Typography>
    </Box>
    
    <Box sx={{ mb: 5 }}>
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          mt: 4,
          color: 'secondary.main',
          fontWeight: 'medium'
        }}
      >
        Técnicas Avançadas
      </Typography>
      
      <Typography 
        variant="h6" 
        gutterBottom
        sx={{ fontWeight: 'medium' }}
      >
        1. Múltiplos Trechos vs. Ida e Volta
      </Typography>
      
      <Typography paragraph>
        Em alguns casos, comprar trechos separados em diferentes companhias pode ser mais barato que uma passagem de ida e volta tradicional.
      </Typography>
      
      <Typography 
        variant="h6" 
        gutterBottom
        sx={{ fontWeight: 'medium' }}
      >
        2. Aeroportos Alternativos
      </Typography>
      
      <Typography paragraph>
        Considere aeroportos secundários ou em cidades próximas, que frequentemente oferecem tarifas mais competitivas.
      </Typography>
      
      <Typography 
        variant="h6" 
        gutterBottom
        sx={{ fontWeight: 'medium' }}
      >
        3. Flexibilidade de Datas
      </Typography>
      
      <Typography paragraph>
        Diferenças de poucos dias podem representar economias significativas. Use calendários de preços para identificar as melhores datas.
      </Typography>
    </Box>
  </Container>
);

export default StrategiesPage;
