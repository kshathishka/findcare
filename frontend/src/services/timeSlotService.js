import api from '../lib/api';

export const timeSlotService = {
  getByDoctor: (doctorId) => api.get(`/api/timeslots/doctor/${doctorId}`).then((r) => r.data),
  getAvailable: (doctorId, date) =>
    api.get(`/api/timeslots/doctor/${doctorId}/available`, { params: { date } }).then((r) => r.data),
  create: (data) => api.post('/api/timeslots', data).then((r) => r.data),
  delete: (id) => api.delete(`/api/timeslots/${id}`).then((r) => r.data),
};
