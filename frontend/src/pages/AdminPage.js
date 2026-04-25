import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Alert,
    CircularProgress,
    Grid,
    Card,
    CardContent,
    InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LockIcon from '@mui/icons-material/Lock';
import axios from 'axios';

const backendUrl = import.meta.env?.VITE_BACKEND_URL || 'http://localhost:3001';

const STATUS_COLORS = {
    pending: 'warning',
    contacted: 'info',
    quoted: 'success',
    accepted: 'success',
    rejected: 'error',
    cancelled: 'default'
};

const STATUS_LABELS = {
    pending: 'Pendente',
    contacted: 'Contactado',
    quoted: 'Cotado',
    accepted: 'Aceito',
    rejected: 'Rejeitado',
    cancelled: 'Cancelado'
};

const AdminPage = () => {
    const [quotes, setQuotes] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedQuote, setSelectedQuote] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [secretFareDialog, setSecretFareDialog] = useState(false);
    const [secretFareData, setSecretFareData] = useState({ price: '', currency: 'BRL', provider: '', details: '', deadline: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchQuotes = async () => {
        try {
            setLoading(true);
            const url = searchTerm
                ? `${backendUrl}/api/quotes?search=${encodeURIComponent(searchTerm)}`
                : `${backendUrl}/api/quotes`;
            const res = await axios.get(url);
            setQuotes(res.data.data || []);
        } catch (err) {
            setError('Erro ao carregar cotações.');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await axios.get(`${backendUrl}/api/quotes/stats`);
            setStats(res.data.data);
        } catch (err) {
            console.error('Erro ao carregar estatísticas:', err);
        }
    };

    useEffect(() => {
        fetchQuotes();
        fetchStats();
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchQuotes();
        }, 500);
        return () => clearTimeout(timeout);
    }, [searchTerm]);

    const handleViewQuote = (quote) => {
        setSelectedQuote(quote);
        setOpenDialog(true);
    };

    const handleAddSecretFare = (quote) => {
        setSelectedQuote(quote);
        setSecretFareDialog(true);
    };

    const submitSecretFare = async () => {
        try {
            setError('');
            const res = await axios.patch(
                `${backendUrl}/api/quotes/${selectedQuote.id}/secret-fare`,
                secretFareData
            );
            setSuccess('Tarifa secreta adicionada com sucesso!');
            setSecretFareDialog(false);
            setSecretFareData({ price: '', currency: 'BRL', provider: '', details: '', deadline: '' });
            fetchQuotes();
            fetchStats();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.error?.message || 'Erro ao adicionar tarifa secreta.');
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.patch(`${backendUrl}/api/quotes/${id}/status`, { status: newStatus });
            fetchQuotes();
            fetchStats();
        } catch (err) {
            setError('Erro ao atualizar status.');
        }
    };

    const formatPrice = (price, currency = 'BRL') => {
        if (!price || isNaN(Number(price))) return '-';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: currency
        }).format(Number(price));
    };

    const copyBriefing = (quote) => {
        const text = `BRIEFING PARA CONSOLIDATOR

Rota: ${quote.flightDetails.route || 'N/A'}
Data: ${quote.flightDetails.date || 'N/A'}
Passageiros: ${quote.flightDetails.passengers || 'N/A'}
Tarifa pública de referência: ${quote.benchmarkPrice || 'N/A'}

Cliente: ${quote.user.name}
Email: ${quote.user.email}
Telefone: ${quote.user.phone || 'N/A'}

Solicitação recebida em: ${new Date(quote.createdAt).toLocaleString('pt-BR')}
`;
        navigator.clipboard.writeText(text);
        setSuccess('Briefing copiado para a área de transferência!');
        setTimeout(() => setSuccess(''), 3000);
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
                Painel Administrativo - Cotações
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            {/* Estatísticas */}
            {stats && (
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>Total de Cotações</Typography>
                                <Typography variant="h4">{stats.total}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>Com Tarifa Secreta</Typography>
                                <Typography variant="h4" color="success.main">{stats.withSecretFare}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>Pendentes</Typography>
                                <Typography variant="h4" color="warning.main">{stats.byStatus.pending || 0}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>Cotadas</Typography>
                                <Typography variant="h4" color="info.main">{stats.byStatus.quoted || 0}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Busca */}
            <TextField
                fullWidth
                placeholder="Buscar por nome, email ou rota..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 3 }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />

            {/* Tabela */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Cliente</strong></TableCell>
                            <TableCell><strong>Rota</strong></TableCell>
                            <TableCell><strong>Data</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                            <TableCell><strong>Tarifa Pública</strong></TableCell>
                            <TableCell><strong>Tarifa Secreta</strong></TableCell>
                            <TableCell><strong>Ações</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    <CircularProgress sx={{ my: 2 }} />
                                </TableCell>
                            </TableRow>
                        ) : quotes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    Nenhuma cotação encontrada.
                                </TableCell>
                            </TableRow>
                        ) : (
                            quotes.map((quote) => (
                                <TableRow key={quote.id} hover>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="medium">{quote.user.name}</Typography>
                                        <Typography variant="caption" color="textSecondary">{quote.user.email}</Typography>
                                    </TableCell>
                                    <TableCell>{quote.flightDetails.route || 'N/A'}</TableCell>
                                    <TableCell>
                                        {quote.flightDetails.date
                                            ? new Date(quote.flightDetails.date).toLocaleDateString('pt-BR')
                                            : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={STATUS_LABELS[quote.status] || quote.status}
                                            color={STATUS_COLORS[quote.status] || 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>{quote.benchmarkPrice || 'N/A'}</TableCell>
                                    <TableCell>
                                        {quote.secretFare ? (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <LockIcon fontSize="small" color="success" />
                                                <Typography variant="body2" color="success.main" fontWeight="bold">
                                                    {formatPrice(quote.secretFare.price, quote.secretFare.currency)}
                                                </Typography>
                                            </Box>
                                        ) : (
                                            <Typography variant="body2" color="textSecondary">-</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleViewQuote(quote)}
                                                title="Ver detalhes"
                                            >
                                                <VisibilityIcon fontSize="small" />
                                            </IconButton>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="success"
                                                startIcon={<LockIcon fontSize="small" />}
                                                onClick={() => handleAddSecretFare(quote)}
                                                disabled={!!quote.secretFare}
                                            >
                                                {quote.secretFare ? 'Já cotado' : 'Add Tarifa'}
                                            </Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog de detalhes */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Detalhes da Cotação</DialogTitle>
                <DialogContent>
                    {selectedQuote && (
                        <Box sx={{ mt: 1 }}>
                            <Typography variant="h6" gutterBottom>{selectedQuote.user.name}</Typography>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                {selectedQuote.user.email} | {selectedQuote.user.phone || 'Sem telefone'}
                            </Typography>
                            <Box sx={{ my: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                                <Typography><strong>Rota:</strong> {selectedQuote.flightDetails.route || 'N/A'}</Typography>
                                <Typography><strong>Data:</strong> {selectedQuote.flightDetails.date || 'N/A'}</Typography>
                                <Typography><strong>Passageiros:</strong> {selectedQuote.flightDetails.passengers || 'N/A'}</Typography>
                                <Typography><strong>Tarifa pública:</strong> {selectedQuote.benchmarkPrice || 'N/A'}</Typography>
                            </Box>

                            {selectedQuote.secretFare && (
                                <Alert severity="success" sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2">Tarifa Secreta Encontrada!</Typography>
                                    <Typography variant="body2">
                                        <strong>Preço:</strong> {formatPrice(selectedQuote.secretFare.price, selectedQuote.secretFare.currency)}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Fornecedor:</strong> {selectedQuote.secretFare.provider}
                                    </Typography>
                                    {selectedQuote.secretFare.details && (
                                        <Typography variant="body2">
                                            <strong>Detalhes:</strong> {selectedQuote.secretFare.details}
                                        </Typography>
                                    )}
                                </Alert>
                            )}

                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" gutterBottom>Atualizar Status:</Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {Object.entries(STATUS_LABELS).map(([key, label]) => (
                                        <Button
                                            key={key}
                                            size="small"
                                            variant={selectedQuote.status === key ? 'contained' : 'outlined'}
                                            onClick={() => handleStatusChange(selectedQuote.id, key)}
                                        >
                                            {label}
                                        </Button>
                                    ))}
                                </Box>
                            </Box>

                            <Box sx={{ mt: 3 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => copyBriefing(selectedQuote)}
                                >
                                    Copiar Briefing para Consolidator
                                </Button>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Fechar</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog de tarifa secreta */}
            <Dialog open={secretFareDialog} onClose={() => setSecretFareDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Adicionar Tarifa Secreta</DialogTitle>
                <DialogContent>
                    {selectedQuote && (
                        <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                Cotação: {selectedQuote.flightDetails.route} - {selectedQuote.user.name}
                            </Typography>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Preço"
                                        type="number"
                                        fullWidth
                                        value={secretFareData.price}
                                        onChange={(e) => setSecretFareData({ ...secretFareData, price: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Moeda"
                                        fullWidth
                                        value={secretFareData.currency}
                                        onChange={(e) => setSecretFareData({ ...secretFareData, currency: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Fornecedor (Consolidator)"
                                        fullWidth
                                        placeholder="Ex: Central de Emissão, Fly Miles..."
                                        value={secretFareData.provider}
                                        onChange={(e) => setSecretFareData({ ...secretFareData, provider: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Detalhes da Tarifa"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        placeholder="Regras, bagagem, horários, conexões..."
                                        value={secretFareData.details}
                                        onChange={(e) => setSecretFareData({ ...secretFareData, details: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Validade da Oferta"
                                        fullWidth
                                        type="datetime-local"
                                        value={secretFareData.deadline}
                                        onChange={(e) => setSecretFareData({ ...secretFareData, deadline: e.target.value })}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSecretFareDialog(false)}>Cancelar</Button>
                    <Button onClick={submitSecretFare} variant="contained" color="success">
                        Salvar Tarifa Secreta
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AdminPage;
