import axios from 'axios';

export const dashboardApi = {
  getStats: () => axios.get('/api/dashboard'),
};
