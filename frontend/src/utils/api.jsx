import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const loginUser = async (
  username,
  password
) => {
  try {
    const response = await apiClient.post(
      "/auth/login",
      {
        username,
        password,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la connexion :",
      error
    );

    throw error;
  }
};