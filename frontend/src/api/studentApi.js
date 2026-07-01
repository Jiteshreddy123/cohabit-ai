import apiClient from "./apiClient";

export const studentApi = {
  getStudents: async (sessionId = null) => {
    const url = sessionId ? `/students?session_id=${sessionId}` : "/students";
    const response = await apiClient.get(url);
    return response.data;
  },

  getStudentById: async (id) => {
    const response = await apiClient.get(`/students/${id}`);
    return response.data;
  },

  createStudent: async (studentData) => {
    const response = await apiClient.post("/students", studentData);
    return response.data;
  }
};
