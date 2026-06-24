import { apiClient } from "./apiClient";
import apiHandler from "../../utils/apiHandler";

const feedService = {
  get: () => apiHandler(() => apiClient.get("/feed")),
};

export default feedService;