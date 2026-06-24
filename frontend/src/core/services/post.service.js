import { apiClient } from "./apiClient";
import apiHandler from "../../utils/apiHandler";

const postService = {
  getAll: () => apiHandler(() => apiClient.get("/posts")),
  getById: (id) => apiHandler(() => apiClient.get(`/posts/${id}`)),
  create: (data) => apiHandler(() => apiClient.post("/posts", data)),
  update: (id, data) => apiHandler(() => apiClient.put(`/posts/${id}`, data)),
  delete: (id) => apiHandler(() => apiClient.delete(`/posts/${id}`)),
  getComments: (postId) => apiHandler(() => apiClient.get(`/posts/${postId}/comments`)),
  getLikes: (postId) => apiHandler(() => apiClient.get(`/posts/${postId}/likes`)),
};

export default postService;