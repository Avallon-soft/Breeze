import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE + "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const loginUser = async (
  email,
  password
) => {
  try {
    const response = await apiClient.post(
      "/auth/login",
      {
        email,
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