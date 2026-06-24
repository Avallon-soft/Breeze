import { apiClient } from "./apiClient";
import apiHandler from "../../utils/apiHandler";

const commentService = {
  // create: (data) => apiHandler(() => apiClient.post("/comments", data)),
  getById: (commentId) => apiHandler(() => apiClient.get(`/comments/${commentId}`)),
  create: (data, post_id) => apiHandler(() => apiClient.post(`/comments?post_id=${post_id}`, data)),
  delete: (commentId) => apiHandler(() => apiClient.delete(`/comments/${commentId}`)),
  createReply: (commentId, data) => apiHandler(() => apiClient.post(`/comments/${commentId}/replies`, data)),
  getReplies: (commentId) => apiHandler(() => apiClient.get(`/comments/${commentId}/replies`)),
  deleteReplies: (commentId) => apiHandler(() => apiClient.delete(`/comments/${commentId}/replies`)),
  like: (commentId) => apiHandler(() => apiClient.post(`/comments/${commentId}/like`)),
  getLikes: (commentId) => apiHandler(() => apiClient.get(`/comments/${commentId}/likes`)),
};

export default commentService;