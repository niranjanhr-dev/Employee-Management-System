import axios from 'axios';

const BASE = '/api/project';

export const projectApi = {
  getAll: () => axios.get('/api/projects'),
  getById: (id) => axios.get(`${BASE}/${id}`),
  create: (data) => axios.post(BASE, data),
  update: (id, data) => axios.put(`${BASE}/${id}`, data),
  delete: (id) => axios.delete(`${BASE}/${id}`),
  getByStatus: (status) => axios.get(`${BASE}/status/${status}`),
  getEmployeesByProject: (id) => axios.get(`${BASE}/${id}/employees`),
};
