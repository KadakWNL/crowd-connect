import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const signup = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/signup`, userData);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getCurrentUser = async () => {
  const response = await axios.get(`${API_URL}/users/me`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const toggleHost = async () => {
  const response = await axios.patch(`${API_URL}/users/toggle-host`, {}, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const getAllEvents = async () => {
  const response = await axios.get(`${API_URL}/events`);
  return response.data;
};

export const getEventById = async (id) => {
  const response = await axios.get(`${API_URL}/events/${id}`);
  return response.data;
};

export const createEvent = async (eventData) => {
  const response = await axios.post(`${API_URL}/events`, eventData, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const updateEvent = async (id, eventData) => {
  const response = await axios.put(`${API_URL}/events/${id}`, eventData, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const deleteEvent = async (id) => {
  const response = await axios.delete(`${API_URL}/events/${id}`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const toggleAttendEvent = async (id) => {
  const response = await axios.post(`${API_URL}/events/${id}/attend`, {}, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const getMyEvents = async () => {
  const response = await axios.get(`${API_URL}/users/my-events`, {
    headers: getAuthHeader()
  });
  return response.data;
};
