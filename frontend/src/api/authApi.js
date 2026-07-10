import apiClient from "./apiClient";

export const authApi = {
  login: async (email, password) => {
    const response = await apiClient.post("/login", { email, password });
    if (response.data && response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify({ email, role: "admin", collegeCode: response.data.college_code }));
      localStorage.setItem("college", JSON.stringify({ email })); // legacy
    }
    return response.data;
  },

  studentLogin: async (college_code, email, password) => {
    const response = await apiClient.post("/student/login", { college_code, email, password });
    if (response.data && response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify({ email, role: "student", id: response.data.student_id }));
    }
    return response.data;
  },

  register: async (name, email, password) => {
    const response = await apiClient.post("/register", { name, email, password });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("college");
    window.location.href = "/login";
  },

  getCurrentCollege: () => {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);
    const college = localStorage.getItem("college");
    return college ? JSON.parse(college) : null;
  },

  getUserRole: () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      return JSON.parse(userStr).role;
    }
    return null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  }
};
