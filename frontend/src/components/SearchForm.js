import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import FormHelperText from '@mui/material/FormHelperText';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ptBR from 'date-fns/locale/pt-BR';
import { validateSearchForm } from '../utils/validation';

/**
 * Componente de formulário de busca de passagens aéreas
 * 
 * @param {Object} props - Propriedades do componente
 * @param {Function} props.onSearch - Função chamada ao submeter o formulário
 * @returns {JSX.Element} Formulário de busca
 */
const SearchForm = ({ onSearch }) => {
  // Estados para campos do formulário
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  
  // Estados para validação e feedback
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  /**
   * Manipula o envio do formulário
   */
  const handleSearch = async () => {
    setFormSubmitted(true);

    const formValues = { origin, destination, departureDate, returnDate };
    const validationErrors = validateSearchForm(formValues);
    
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Formatar datas para ISO string (YYYY-MM-DD)
      const formatDate = (date) => {
        if (!date) return null;
        // Garantir que a data seja um objeto Date válido antes de chamar toISOString
        const d = date instanceof Date ? date : new Date(date);
        return d.toISOString().split('T')[0];
      };
      
      await onSearch({
        origin: origin.trim(),
        destination: destination.trim(),
        departureDate: formatDate(departureDate),
        returnDate: returnDate ? formatDate(returnDate) : null
      });
    } catch (error) {
      console.error('Erro ao processar busca:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Box component="form" sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="origin"
              label="Origem (Cidade ou Aeroporto)"
              name="origin"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              error={formSubmitted && !!errors.origin}
              helperText={formSubmitted && errors.origin}
              disabled={isSubmitting}
              inputProps={{ 
                'aria-label': 'Origem',
                'data-testid': 'origin-input'
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="destination"
              label="Destino (Cidade ou Aeroporto)"
              name="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              error={formSubmitted && !!errors.destination}
              helperText={formSubmitted && errors.destination}
              disabled={isSubmitting}
              inputProps={{ 
                'aria-label': 'Destino',
                'data-testid': 'destination-input'
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Data de Partida *"
              inputFormat="dd/MM/yyyy"
              value={departureDate}
              onChange={(newValue) => setDepartureDate(newValue)}
              disabled={isSubmitting}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: false,
                  error: formSubmitted && !!errors.departureDate,
                  helperText: formSubmitted && errors.departureDate,
                  inputProps: { 
                    'aria-label': 'Data de Partida',
                    'data-testid': 'departure-date-input'
                  }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Data de Retorno (Opcional)"
              inputFormat="dd/MM/yyyy"
              value={returnDate}
              onChange={(newValue) => setReturnDate(newValue)}
              disabled={isSubmitting}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: formSubmitted && !!errors.returnDate,
                  helperText: formSubmitted && errors.returnDate,
                  inputProps: { 
                    'aria-label': 'Data de Retorno',
                    'data-testid': 'return-date-input'
                  }
                }
              }}
            />
          </Grid>
        </Grid>
        
        {formSubmitted && Object.keys(errors).length > 0 && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Por favor, corrija os erros no formulário antes de continuar.
          </Alert>
        )}
        
        <Button
          type="button"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleSearch}
          disabled={isSubmitting}
          data-testid="search-button"
        >
          {isSubmitting ? (
            <>
              <CircularProgress size={24} sx={{ mr: 1, color: 'white' }} />
              Buscando...
            </>
          ) : 'Buscar Passagens'}
        </Button>
        
        <FormHelperText>
          * Campos obrigatórios
        </FormHelperText>
      </Box>
    </LocalizationProvider>
  );
};

export default SearchForm;
