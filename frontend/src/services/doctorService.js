import api from '../lib/api';

const toList = (payload) => (Array.isArray(payload) ? payload : payload?.content ?? []);

export const doctorService = {
  getAll: () => api.get('/api/doctors').then((r) => toList(r.data)),
  getById: (id) => api.get(`/api/doctors/${id}`).then((r) => r.data),
  getByHospital: (hospitalId) => api.get(`/api/doctors/hospital/${hospitalId}`).then((r) => toList(r.data)),
  getByDepartment: (deptId) => api.get(`/api/doctors/department/${deptId}`).then((r) => toList(r.data)),
  search: (keyword) => api.get('/api/doctors/search', { params: { keyword } }).then((r) => toList(r.data)),
  create: (data) => api.post('/api/doctors', data).then((r) => r.data),
  update: (id, data) => api.put(`/api/doctors/${id}`, data).then((r) => r.data),
  delete: (id) => api.delete(`/api/doctors/${id}`).then((r) => r.data),
};
