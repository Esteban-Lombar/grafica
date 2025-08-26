// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000", 
});

export const getCompras = async () => {
  try {
    const response = await api.get("/zapatos/getTodasCompras");
    return response.data;
  } catch (error) {
    console.error("Error al obtener compras:", error);
    throw error;
  }
};
