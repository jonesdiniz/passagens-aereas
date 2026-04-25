import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';

const Footer = () => (
  <Box
    component="footer"
    sx={{
      py: 3,
      px: 2,
      mt: 'auto',
      backgroundColor: (theme) => theme.palette.grey[900],
      color: 'white'
    }}
  >
    <Container maxWidth="lg">
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'center', md: 'flex-start' },
          gap: 2
        }}
      >
        <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
          <Typography variant="h6" gutterBottom>
            GPS de Passagens Aéreas
          </Typography>
          <Typography variant="body2" color="grey.400">
            Sistema inteligente para encontrar as melhores tarifas utilizando
            estratégias avançadas de busca.
          </Typography>
        </Box>

        <Box sx={{ textAlign: { xs: 'center', md: 'right' } }}>
          <Typography variant="subtitle2" gutterBottom>
            Links Úteis
          </Typography>
          <Link
            href="https://www.google.com/travel/flights"
            target="_blank"
            rel="noopener noreferrer"
            color="inherit"
            sx={{ display: 'block', mb: 0.5 }}
          >
            Google Flights
          </Link>
          <Link
            href="https://www.skyscanner.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            color="inherit"
            sx={{ display: 'block', mb: 0.5 }}
          >
            Skyscanner
          </Link>
          <Link
            href="https://www.kayak.com.br/flights"
            target="_blank"
            rel="noopener noreferrer"
            color="inherit"
            sx={{ display: 'block' }}
          >
            Kayak
          </Link>
        </Box>
      </Box>

      <Divider sx={{ my: 2, borderColor: 'grey.700' }} />

      <Typography variant="body2" color="grey.500" align="center">
        &copy; {new Date().getFullYear()} Sistema GPS de Passagens Aéreas. Todos os direitos reservados.
      </Typography>
    </Container>
  </Box>
);

export default Footer;
