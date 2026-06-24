import { apiClient } from "./apiClient";
import apiHandler from "../../utils/apiHandler";

const likeService = {
  toggleLike: (post_id) => apiHandler(() => apiClient.post(`/likes?post_id=${post_id}`)),
};

export default likeService;