import apiClient from "./apiClient";

export const authApi = {
  login: async (email, password) => {
    const response = await apiClient.post("/login", { email, password });
    if (response.data && response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      // Store basic info for header
      localStorage.setItem("college", JSON.stringify({ email }));
    }
    return response.data;
  },

  register: async (name, email, password) => {
    const response = await apiClient.post("/register", { name, email, password });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("college");
    window.location.href = "/login";
  },

  getCurrentCollege: () => {
    const college = localStorage.getItem("college");
    return college ? JSON.parse(college) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  }
};
