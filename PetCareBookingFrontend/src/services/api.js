import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: { "Content-Type": "application/json" },
});

// Attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Services
export const getServices = () => api.get("/services").then((r) => r.data);
export const getServiceById = (id) => api.get(`/services/${id}`).then((r) => r.data);

// Bookings (create: customerName, owner, phoneNumber, petName, appointmentDateTime, serviceId, notes)
export const createBooking = (body) => api.post("/bookings", body).then((r) => r.data);
export const getUserBookings = (userId) =>
  api.get(`/bookings/user/${userId}`).then((r) => r.data);
export const getBookingById = (id) => api.get(`/bookings/${id}`).then((r) => r.data);
export const updateBooking = (id, body) =>
  api.put(`/bookings/${id}`, body).then((r) => r.data);
export const cancelBooking = (id) =>
  api.put(`/bookings/${id}/cancel`).then((r) => r.data);
export const deleteBooking = (id) => api.delete(`/bookings/${id}`).then((r) => r.data);

// Pets (รายการสัตว์เลี้ยงของ user)
export const getPets = (ownerId) =>
  api.get("/pets", { params: { owner: ownerId } }).then((r) => r.data);
// createPet รับ FormData (แนบไฟล์) หรือ object (ส่งแบบ JSON)
export const createPet = (bodyOrFormData) => {
  if (bodyOrFormData instanceof FormData) {
    const url = `${BASE_URL}/api/v1/pets/create`;
    const token = localStorage.getItem("accessToken");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    return axios.post(url, bodyOrFormData, { headers }).then((r) => r.data);
  }
  return api.post("/pets/create", bodyOrFormData).then((r) => r.data);
};

// User auth
export const register = (username, password) =>
  api.post("/user/register", { username, password }).then((r) => r.data);
export const login = (username, password) =>
  api.post("/user/login", { username, password }).then((r) => r.data);

export default api;
