import { apiClient } from "./apiClient";
import apiHandler from "../../utils/apiHandler";

const userService = {
  searchUsers: (username) => apiHandler(() => apiClient.get(`/users/search?username=${username}`)),
  getFollowers: (userId) => apiHandler(() => apiClient.get(`/users/${userId}/followers`)),
  getFollowing: (userId) => apiHandler(() => apiClient.get(`/users/${userId}/following`)),
  getSuggestions: () => apiHandler(() => apiClient.get("/users/suggestions")),
};

export default userService;