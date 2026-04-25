import axios from 'axios';

const backendUrl = import.meta.env?.VITE_BACKEND_URL || process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

export const sendQuoteRequest = async (quoteData) => {
  try {
    const response = await axios.post(`${backendUrl}/api/quotes`, quoteData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
