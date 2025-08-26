// src/services/api.js
import axios from "axios";

const API_URL = "https://zapateria-back.vercel.app"; // tu backend en vercel

// Función para obtener estadísticas del back
export const getEstadisticas = async () => {
  try {
    const res = await axios.get(`${API_URL}/zapatos/estadisticas`);
    return res.data;
  } catch (error) {
    console.error("Error en getEstadisticas:", error);
    return null;
  }
};
