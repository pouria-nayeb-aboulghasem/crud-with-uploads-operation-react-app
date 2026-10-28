const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API_ENDPOINTS = {
  products: "api/products",
} as const;

export { API_BASE_URL, API_ENDPOINTS };
