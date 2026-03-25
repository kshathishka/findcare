import api from '../lib/api';

const toList = (payload) => (Array.isArray(payload) ? payload : payload?.content ?? []);

export const appointmentService = {
  create: (data) => api.post('/api/appointments', data).then((r) => r.data),
  getByPatient: (patientId) => api.get(`/api/appointments/patient/${patientId}`).then((r) => toList(r.data)),
  getByDoctor: (doctorId) => api.get(`/api/appointments/doctor/${doctorId}`).then((r) => toList(r.data)),
  getToday: () => api.get('/api/appointments/today').then((r) => toList(r.data)),
  search: (keyword) => api.get('/api/appointments/search', { params: { keyword } }).then((r) => toList(r.data)),
  cancel: (id) => api.put(`/api/appointments/${id}/cancel`).then((r) => r.data),
  checkIn: (id) => api.put(`/api/appointments/${id}/checkin`).then((r) => r.data),
  complete: (id, notes) => api.put(`/api/appointments/${id}/complete`, null, { params: { notes } }).then((r) => r.data),
};
