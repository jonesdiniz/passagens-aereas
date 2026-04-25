import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Typography,
  Box
} from '@mui/material';
import { sendQuoteRequest } from '../services/api';

const QuoteModal = ({ open, onClose, flightDetails, benchmarkPrice, benchmarkCurrency }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) {
      setError('Nome e e-mail são obrigatórios.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await sendQuoteRequest({
        user: formData,
        flightDetails,
        benchmarkPrice: `${benchmarkCurrency || 'BRL'} ${benchmarkPrice}`
      });
      setSuccess(true);
    } catch (err) {
      setError('Erro ao enviar solicitação. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setError('');
    setFormData({ name: '', email: '', phone: '' });
    onClose();
  };

  if (success) {
    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Solicitação Enviada!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Recebemos seu pedido de cotação para a tarifa secreta. Um de nossos especialistas em emissão com consolidador entrará em contato em breve pelo e-mail ou WhatsApp informado.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Solicitar Tarifa Secreta (Consolidador)</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          O preço público atual (referência) é de <strong>{benchmarkCurrency} {benchmarkPrice}</strong>. 
          Nós temos parcerias que podem reduzir este valor. Preencha seus dados e nossa equipe buscará a tarifa privada exata para você.
        </DialogContentText>
        
        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Nome Completo"
            name="name"
            value={formData.name}
            onChange={handleChange}
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="E-mail"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="WhatsApp (opcional)"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit" disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Solicitar Cotação'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuoteModal;
