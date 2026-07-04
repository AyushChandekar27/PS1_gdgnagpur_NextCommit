import axiosClient from './axiosClient';

export const authApi = {
  register: async (userData) => {
    // body: { name, email, password, role: "PATIENT"|"DOCTOR", dob, gender }
    const response = await axiosClient.post('/auth/register', userData);
    return response.data;
  },
  login: async (credentials) => {
    // body: { email, password }
    const response = await axiosClient.post('/auth/login', credentials);
    return response.data;
  },
};

export default authApi;
