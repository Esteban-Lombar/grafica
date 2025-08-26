// src/components/GraficaVentas.jsx
import React, { useEffect, useState } from "react";
import { getEstadisticas } from "../services/api"; // Importamos la función que llama al backend
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const GraficaVentas = () => {
  // Estados para guardar los datos del backend
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect -> se ejecuta cuando carga el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getEstadisticas(); // Llamada al back
        setEstadisticas(data); // Guardamos los datos en el estado
      } catch (error) {
        console.error("Error al traer estadísticas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Mientras carga mostramos mensaje
  if (loading) return <p>Cargando datos...</p>;

  // Si no hay datos mostramos aviso
  if (!estadisticas) return <p>No hay datos de estadísticas</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📊 Dashboard de Ventas</h2>

      {/* Total de ventas */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold">💰 Total de Ventas</h3>
        <p className="text-xl">{estadisticas.totalVentas}</p>
      </div>

      {/* Productos más vendidos */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold">🔥 Productos Más Vendidos</h3>
        <ul>
          {estadisticas.productosMasVendidos.map((prod, i) => (
            <li key={i}>
              {prod.producto}: {prod.cantidad} ventas
            </li>
          ))}
        </ul>
      </div>

      {/* Ventas por mes - gráfico */}
      <div className="p-4 bg-gray-100 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">📅 Ventas por Mes</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={estadisticas.ventasPorMes}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="ventas" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GraficaVentas;
