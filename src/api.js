import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// --- INTERCEPTOR: Attach Token to every request ---
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Auth Endpoints (FIXED: Added /api) ---
export const loginUser = (creds) => api.post('/api/auth/login', creds);
export const registerUser = (userData) => api.post('/api/auth/signup', userData);

// --- Data Endpoints (FIXED: Added /api) ---
export const getDashboardSummary = () => api.get('/api/dashboard/summary');
export const getFarms = () => api.get('/api/farms');
export const createFarm = (farm) => api.post('/api/farms', farm);
export const updateFarm = (id, farm) => api.put(`/api/farms/${id}`, farm);

export const getAllTransactions = () => api.get('/api/transactions');
export const getTransactionsByFarm = (farmId) => api.get(`/api/transactions/farm/${farmId}`);
export const getCommonTransactions = () => api.get('/api/transactions/common');
export const createTransaction = (tx) => api.post('/api/transactions', tx);
export const updateTransaction = (id, tx) => api.put(`/api/transactions/${id}`, tx);

export const askAI = (message) => api.post('/api/ai/chat', { message });

export default api;