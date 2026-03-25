import api from '../lib/api';

const toList = (payload) => (Array.isArray(payload) ? payload : payload?.content ?? []);

export const hospitalService = {
  getAll: () => api.get('/api/hospitals').then((r) => toList(r.data)),
  getById: (id) => api.get(`/api/hospitals/${id}`).then((r) => r.data),
  search: (keyword) => api.get('/api/hospitals/search', { params: { keyword } }).then((r) => toList(r.data)),
  getByType: (type) => api.get(`/api/hospitals/type/${type}`).then((r) => toList(r.data)),
  getByCity: (city) => api.get(`/api/hospitals/city/${city}`).then((r) => toList(r.data)),
  create: (data) => api.post('/api/hospitals', data).then((r) => r.data),
  update: (id, data) => api.put(`/api/hospitals/${id}`, data).then((r) => r.data),
  delete: (id) => api.delete(`/api/hospitals/${id}`).then((r) => r.data),
};
