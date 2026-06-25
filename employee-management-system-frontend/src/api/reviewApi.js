import axios from 'axios';

export const reviewApi = {
  getAll: () => axios.get('/api/reviews'),
  getById: (id) => axios.get(`/api/review/${id}`),
  create: (data) => axios.post('/api/review', data),
  update: (id, data) => axios.put(`/api/review/${id}`, data),
  delete: (id) => axios.delete(`/api/review/${id}`),
  getByRatingGreaterThan: (rating) => axios.get(`/api/review/rating/${rating}`),
  getByDateRange: (startDate, endDate) =>
    axios.get(`/api/review/date`, { params: { startDate, endDate } }),
};
