import axiosClient from './axiosClient';

export const documentApi = {
  upload: async (patientId, file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    const response = await axiosClient.post(`/documents/${patientId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  getDocuments: async (patientId) => {
    const response = await axiosClient.get(`/documents/${patientId}`);
    return response.data;
  },
  
  deleteDocument: async (documentId) => {
    const response = await axiosClient.delete(`/documents/${documentId}`);
    return response.data;
  },
};

export default documentApi;
