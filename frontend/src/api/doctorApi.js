import axiosClient from './axiosClient';

export const doctorApi = {
  searchPatients: async (query = '') => {
    // GET /api/doctor/patients?query=xxx
    const response = await axiosClient.get(`/doctor/patients`, {
      params: { query },
    });
    return response.data;
  },

  getPatient: async (patientId) => {
    // GET /api/doctor/patients/{patientId}
    const response = await axiosClient.get(`/doctor/patients/${patientId}`);
    return response.data;
  },
};

export default doctorApi;
