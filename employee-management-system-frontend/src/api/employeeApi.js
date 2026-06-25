import axios from 'axios';

const BASE = '/api/employee';

export const employeeApi = {
  getAll: () => axios.get('/api/employees'),
  getById: (id) => axios.get(`${BASE}/${id}`),
  create: (data) => axios.post(BASE, data),
  update: (id, data) => axios.put(`${BASE}/${id}`, data),
  delete: (id) => axios.delete(`${BASE}/${id}`),
  getByName: (name) => axios.get(`${BASE}/name/${name}`),
  getByDesignation: (designation) => axios.get(`${BASE}/designation/${designation}`),
  getBySalaryGreaterThan: (salary) => axios.get(`${BASE}/salary/${salary}`),
  getBySalaryBetween: (min, max) => axios.get(`${BASE}/salary/${min}/${max}`),
  getByDepartmentName: (name) => axios.get(`${BASE}/department/${name}`),
  getProjectsByEmployee: (id) => axios.get(`${BASE}/${id}/projects`),
};
