// httpClient.js
export const customFetch = async (url, options) => {
  const token = localStorage.getItem("jwtToken");

  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  // Adăugăm mode: "cors"
  const response = await fetch(url, {
    ...options,
    mode: "cors", // Adaugă acest parametru
  });

  return response;
};
