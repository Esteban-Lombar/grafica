import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // cambia a la URL de tu backend
});

export default api;
