// src/components/GraficaVentas.jsx
import React, { useEffect, useState } from "react";
import { getCompras } from "../services/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const GraficaVentas = () => {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCompras();
        setCompras(data);
      } catch (err) {
        console.error("Error cargando compras:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Cargando datos...</p>;
  if (!compras.length) return <p>No hay datos de compras</p>;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={compras} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="nombre" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="cantidad" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default GraficaVentas;
