import { apiClient } from "./apiClient";
import apiHandler from "../../utils/apiHandler";

const meService = {
  getProfile: () => apiHandler(() => apiClient.get("/me/profile")),
  getProfileById: (userId) => apiHandler(() => apiClient.get(`/users/${userId}/profile`)),
  upsertProfile: (data) => apiHandler(() => apiClient.put("/me/profile", data)),
  getLikes: () => apiHandler(() => apiClient.get("/me/likes")),
};

export default meService;