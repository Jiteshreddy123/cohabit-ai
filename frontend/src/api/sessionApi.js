import apiClient from "./apiClient";

export const sessionApi = {
  getSessions: async () => {
    const response = await apiClient.get("/allocation-sessions");
    return response.data;
  },

  createSession: async (sessionData) => {
    const response = await apiClient.post("/allocation-sessions", sessionData);
    return response.data;
  }
};
