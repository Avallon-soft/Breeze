import { apiClient } from "./apiClient";
import apiHandler from "../../utils/apiHandler";

const authService = {
  login: (email, password) => apiHandler(() => apiClient.post("/auth/login", { email, password })),
  register: (data) => apiHandler(() => apiClient.post("/auth/register", data)),
  logout: () => apiHandler(() => apiClient.post("/auth/logout")),
};

export default authService;