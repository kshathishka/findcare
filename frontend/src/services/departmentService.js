import api from '../lib/api';

export const departmentService = {
  getAll: () => api.get('/api/departments').then((r) => r.data),
  getById: (id) => api.get(`/api/departments/${id}`).then((r) => r.data),
  getByHospital: (hospitalId) => api.get(`/api/departments/hospital/${hospitalId}`).then((r) => r.data),
  create: (data) => api.post('/api/departments', data).then((r) => r.data),
  update: (id, data) => api.put(`/api/departments/${id}`, data).then((r) => r.data),
  delete: (id) => api.delete(`/api/departments/${id}`).then((r) => r.data),
};
