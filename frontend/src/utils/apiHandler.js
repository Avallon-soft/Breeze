const apiHandler = async (requestFn) => {
  try {
    const response = await requestFn();
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Une erreur est survenue";
    throw new Error(message);
  }
};

export default apiHandler;