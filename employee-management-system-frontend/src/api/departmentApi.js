import axios from 'axios';

const BASE = '/api/department';

export const departmentApi = {
  getAll: () => axios.get('/api/departments'),
  getById: (id) => axios.get(`${BASE}/${id}`),
  create: (data) => axios.post(BASE, data),
  update: (id, data) => axios.put(`${BASE}/${id}`, data),
  delete: (id) => axios.delete(`${BASE}/${id}`),
};
