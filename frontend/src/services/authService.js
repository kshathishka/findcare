import api from '../lib/api';

export const authService = {
  login: (email, password) =>
    api.post('/api/auth/login', { email, password }).then((r) => r.data),

  register: (payload) =>
    api.post('/api/auth/signup', payload).then((r) => r.data),
};
