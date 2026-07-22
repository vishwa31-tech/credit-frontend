import axios from 'axios';

export const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const eventService = {
  getAll: () => axios.get(`${API_BASE}/events`),
  getById: (id) => axios.get(`${API_BASE}/events/${id}`),
  create: (data) => axios.post(`${API_BASE}/events`, data, { headers: getAuthHeaders() }),
  update: (id, data) => axios.put(`${API_BASE}/events/${id}`, data, { headers: getAuthHeaders() }),
  delete: (id) => axios.delete(`${API_BASE}/events/${id}`, { headers: getAuthHeaders() }),
};

export const businessService = {
  getAll: () => axios.get(`${API_BASE}/businesses`),
  getById: (id) => axios.get(`${API_BASE}/businesses/${id}`),
  create: (data) => axios.post(`${API_BASE}/businesses`, data, { headers: getAuthHeaders() }),
  addReview: (id, data) => axios.post(`${API_BASE}/businesses/${id}/review`, data, { headers: getAuthHeaders() }),
  bookService: (id, data) => axios.post(`${API_BASE}/businesses/${id}/book`, data, { headers: getAuthHeaders() }),
};

export const jobService = {
  getAll: () => axios.get(`${API_BASE}/jobs`),
  getById: (id) => axios.get(`${API_BASE}/jobs/${id}`),
  create: (data) => axios.post(`${API_BASE}/jobs`, data, { headers: getAuthHeaders() }),
};

export const registrationService = {
  create: (data) => axios.post(`${API_BASE}/registrations`, data, { headers: getAuthHeaders() }),
  getMyRequests: () => axios.get(`${API_BASE}/registrations/my-requests`, { headers: getAuthHeaders() }),
  withdraw: (id) => axios.delete(`${API_BASE}/registrations/${id}`, { headers: getAuthHeaders() }),
};

export const adminService = {
  checkAdmin: () => axios.get(`${API_BASE}/admin/check-admin`, { headers: getAuthHeaders() }),
  getDashboard: () => axios.get(`${API_BASE}/admin/dashboard`, { headers: getAuthHeaders() }),
  getRoleRequests: (status = 'pending') => axios.get(`${API_BASE}/admin/role-requests?status=${status}`, { headers: getAuthHeaders() }),
  approveRoleRequest: (requestId, data) => axios.post(`${API_BASE}/admin/role-requests/${requestId}/approve`, data, { headers: getAuthHeaders() }),
  rejectRoleRequest: (requestId, data) => axios.post(`${API_BASE}/admin/role-requests/${requestId}/reject`, data, { headers: getAuthHeaders() }),
  getServiceLeads: () => axios.get(`${API_BASE}/admin/service-leads`, { headers: getAuthHeaders() }),
  updateServiceLeadStatus: (leadId, data) => axios.put(`${API_BASE}/admin/service-leads/${leadId}`, data, { headers: getAuthHeaders() }),
};

export const newsService = {
  getAll: () => axios.get(`${API_BASE}/news`),
  getById: (id) => axios.get(`${API_BASE}/news/${id}`),
};
