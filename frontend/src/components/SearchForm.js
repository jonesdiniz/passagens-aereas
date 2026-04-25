import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ptBR } from 'date-fns/locale/pt-BR';
import { validateSearchForm } from '../utils/validation';

const getNextMonthValue = () => {
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  return `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}`;
};

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
  const [passengers, setPassengers] = useState(1);
  const [cabin, setCabin] = useState('economy');
  const [flexibility, setFlexibility] = useState('threeDays');
  const [dateSearchMode, setDateSearchMode] = useState('nextSixMonths');
  const [targetMonth, setTargetMonth] = useState(getNextMonthValue());
  const [durationProfile, setDurationProfile] = useState('oneWeek');
  const [includeNearbyAirports, setIncludeNearbyAirports] = useState(true);
  const [preferredStrategy, setPreferredStrategy] = useState('commercialAgreements');
  
  // Estados para validação e feedback
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  /**
   * Manipula o envio do formulário
   */
  const handleSearch = async () => {
    setFormSubmitted(true);

    const formValues = {
      origin,
      destination,
      departureDate,
      returnDate,
      passengers,
      dateSearchMode,
      targetMonth
    };
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
        departureDate: dateSearchMode === 'exact' ? formatDate(departureDate) : null,
        returnDate: dateSearchMode === 'exact' && returnDate ? formatDate(returnDate) : null,
        passengers,
        cabin,
        flexibility,
        dateSearchMode,
        targetMonth: dateSearchMode === 'flexibleMonth' ? targetMonth : null,
        durationProfile,
        includeNearbyAirports,
        preferredStrategy
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
            <FormControl fullWidth disabled={isSubmitting}>
              <InputLabel id="date-search-mode-label">Quando viajar</InputLabel>
              <Select
                labelId="date-search-mode-label"
                id="dateSearchMode"
                value={dateSearchMode}
                label="Quando viajar"
                onChange={(e) => setDateSearchMode(e.target.value)}
                inputProps={{ 'data-testid': 'date-search-mode-select' }}
              >
                <MenuItem value="nextSixMonths">Qualquer data nos próximos 6 meses</MenuItem>
                <MenuItem value="flexibleMonth">Mês específico, sem datas fixas</MenuItem>
                <MenuItem value="nextThreeMonths">Próximos 3 meses</MenuItem>
                <MenuItem value="nextYear">Próximos 12 meses</MenuItem>
                <MenuItem value="exact">Datas exatas</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {dateSearchMode === 'flexibleMonth' && (
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="targetMonth"
                label="Mês da viagem"
                name="targetMonth"
                type="month"
                value={targetMonth}
                onChange={(e) => setTargetMonth(e.target.value)}
                error={formSubmitted && !!errors.targetMonth}
                helperText={formSubmitted && errors.targetMonth}
                disabled={isSubmitting}
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  'aria-label': 'Mês da viagem',
                  'data-testid': 'target-month-input'
                }}
              />
            </Grid>
          )}
          {dateSearchMode === 'exact' && (
            <>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Data de Partida *"
                  format="dd/MM/yyyy"
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
                  format="dd/MM/yyyy"
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
            </>
          )}
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              id="passengers"
              label="Passageiros"
              name="passengers"
              type="number"
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
              error={formSubmitted && !!errors.passengers}
              helperText={formSubmitted && errors.passengers}
              disabled={isSubmitting}
              inputProps={{
                min: 1,
                max: 9,
                'aria-label': 'Passageiros',
                'data-testid': 'passengers-input'
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth disabled={isSubmitting}>
              <InputLabel id="cabin-label">Cabine</InputLabel>
              <Select
                labelId="cabin-label"
                id="cabin"
                value={cabin}
                label="Cabine"
                onChange={(e) => setCabin(e.target.value)}
                inputProps={{ 'data-testid': 'cabin-select' }}
              >
                <MenuItem value="economy">Econômica</MenuItem>
                <MenuItem value="premium">Premium economy</MenuItem>
                <MenuItem value="business">Executiva</MenuItem>
                <MenuItem value="first">Primeira classe</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth disabled={isSubmitting}>
              <InputLabel id="duration-profile-label">Duração</InputLabel>
              <Select
                labelId="duration-profile-label"
                id="durationProfile"
                value={durationProfile}
                label="Duração"
                onChange={(e) => setDurationProfile(e.target.value)}
                inputProps={{ 'data-testid': 'duration-profile-select' }}
              >
                <MenuItem value="quick">3 ou 4 dias</MenuItem>
                <MenuItem value="oneWeek">5, 6 ou 7 dias</MenuItem>
                <MenuItem value="standard">7, 8 ou 10 dias</MenuItem>
                <MenuItem value="twoWeeks">12, 14 ou 16 dias</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth disabled={isSubmitting}>
              <InputLabel id="flexibility-label">Flexibilidade</InputLabel>
              <Select
                labelId="flexibility-label"
                id="flexibility"
                value={flexibility}
                label="Flexibilidade"
                onChange={(e) => setFlexibility(e.target.value)}
                inputProps={{ 'data-testid': 'flexibility-select' }}
              >
                <MenuItem value="exact">Datas exatas</MenuItem>
                <MenuItem value="threeDays">+/- 3 dias</MenuItem>
                <MenuItem value="week">Uma semana</MenuItem>
                <MenuItem value="month">Mês inteiro</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth disabled={isSubmitting}>
              <InputLabel id="preferred-strategy-label">Prioridade</InputLabel>
              <Select
                labelId="preferred-strategy-label"
                id="preferredStrategy"
                value={preferredStrategy}
                label="Prioridade"
                onChange={(e) => setPreferredStrategy(e.target.value)}
                inputProps={{ 'data-testid': 'preferred-strategy-select' }}
              >
                <MenuItem value="commercialAgreements">Acordos comerciais</MenuItem>
                <MenuItem value="balanced">Equilibrada</MenuItem>
                <MenuItem value="cash">Menor preço em dinheiro</MenuItem>
                <MenuItem value="miles">Milhas e pontos</MenuItem>
                <MenuItem value="agency">Agência/consolidator</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              sx={{ height: '100%', alignItems: 'center', ml: 0 }}
              control={(
                <Switch
                  checked={includeNearbyAirports}
                  onChange={(e) => setIncludeNearbyAirports(e.target.checked)}
                  disabled={isSubmitting}
                  inputProps={{ 'data-testid': 'nearby-airports-switch' }}
                />
              )}
              label="Incluir aeroportos próximos"
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
