import { apiClient } from "./apiClient";
import apiHandler from "../../utils/apiHandler";

const followService = {
  follow: (userId) =>
    apiHandler(() => apiClient.post(`/subscribe?user_id=${userId}`)),
  unfollow: (userId) =>
    apiHandler(() => apiClient.delete(`/subscribe?user_id=${userId}`)),
  checkFollow: (userId) =>
    apiHandler(() => apiClient.get(`/subscribe/check?user_id=${userId}`)),
};

export default followService;