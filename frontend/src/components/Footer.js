import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/**
 * Componente de rodapé da aplicação
 * @returns {JSX.Element} Componente Footer
 */
const Footer = () => (
  <Box 
    component="footer" 
    sx={{ 
      py: 3, 
      px: 2, 
      mt: 'auto', 
      backgroundColor: (theme) => theme.palette.grey[200],
      textAlign: 'center'
    }}
  >
    <Typography variant="body2" color="text.secondary">
      © {new Date().getFullYear()} Sistema GPS de Passagens Aéreas
    </Typography>
  </Box>
);

export default Footer;
