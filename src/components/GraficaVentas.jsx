import { useEffect, useState } from "react";
import api from "../services/api";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function GraficaVentas({ idProducto }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Llamar al backend
    api.get(`/ventas/${idProducto}`)
      .then(res => setData(res.data))
      .catch(err => console.error("Error cargando ventas:", err));
  }, [idProducto]);

  return (
    <div className="w-full h-80 p-4 bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-bold mb-4">📊 Ventas del producto</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="#e0e0e0" strokeDasharray="5 5" />
          <XAxis dataKey="fecha" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="cantidad" stroke="#4f46e5" strokeWidth={2} dot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
