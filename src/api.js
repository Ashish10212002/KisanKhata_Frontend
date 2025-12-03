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

// --- Auth Endpoints ---
export const loginUser = (creds) => api.post('/auth/login', creds);
export const registerUser = (userData) => api.post('/auth/signup', userData);

// --- Data Endpoints (Secure) ---
export const getDashboardSummary = () => api.get('/dashboard/summary');
export const getFarms = () => api.get('/farms');
export const createFarm = (farm) => api.post('/farms', farm);
export const updateFarm = (id, farm) => api.put(`/farms/${id}`, farm);

export const getAllTransactions = () => api.get('/transactions');
export const getTransactionsByFarm = (farmId) => api.get(`/transactions/farm/${farmId}`);
export const getCommonTransactions = () => api.get('/transactions/common');
export const createTransaction = (tx) => api.post('/transactions', tx);
export const updateTransaction = (id, tx) => api.put(`/transactions/${id}`, tx);

export const askAI = (message) => api.post('/ai/chat', { message });

export default api;