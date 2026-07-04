import axiosClient from './axiosClient';

export const patientApi = {
  getProfile: async (patientId) => {
    const response = await axiosClient.get(`/patient/${patientId}/profile`);
    return response.data;
  },

  addMedication: async (patientId, medicationData) => {
    // body: { name, dosage, frequency, startDate }
    const response = await axiosClient.post(`/patient/${patientId}/medications`, medicationData);
    return response.data;
  },

  addAllergy: async (patientId, allergyData) => {
    // body: { name, severity }
    const response = await axiosClient.post(`/patient/${patientId}/allergies`, allergyData);
    return response.data;
  },

  addChronicDisease: async (patientId, chronicDiseaseData) => {
    // body: { name, diagnosedDate }
    const response = await axiosClient.post(`/patient/${patientId}/chronic-diseases`, chronicDiseaseData);
    return response.data;
  },
};

export default patientApi;
