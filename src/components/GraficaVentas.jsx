// src/components/GraficaVentas.jsx
import React, { useEffect, useMemo, useState } from "react";
import { getEstadisticas } from "../services/api"; // ✅ Mantiene tu conexión existente
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

// --- Utilidades de presentación (no tocan el back) ---
const useCurrency = (currency = "COP", locale = "es-CO") => {
  const fmt = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }),
    [currency, locale]
  );
  return (n) => (typeof n === "number" ? fmt.format(n) : n);
};

const Skeleton = () => (
  <div className="max-w-6xl mx-auto p-4 md:p-8">
    <div className="h-8 w-64 bg-gray-200 rounded mb-6 animate-pulse" />
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl shadow p-5">
          <div className="h-4 w-24 bg-gray-200 rounded mb-3 animate-pulse" />
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      ))}
    </div>
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-2xl shadow p-6 lg:col-span-2">
        <div className="h-5 w-40 bg-gray-200 rounded mb-4 animate-pulse" />
        <div className="h-[300px] bg-gray-100 rounded animate-pulse" />
      </div>
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="h-5 w-56 bg-gray-200 rounded mb-4 animate-pulse" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-6 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

const StatCard = ({ label, value }) => (
  <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
    <p className="text-sm text-gray-500 mb-2">{label}</p>
    <p className="text-2xl font-bold tracking-tight">{value}</p>
  </div>
);

const GraficaVentas = () => {
  // Util para etiquetar meses del backend ("YYYY-M")
  function formatMes(raw) {
    if (!raw) return "";
    const [y, m] = String(raw).split("-").map(Number);
    const meses = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
    const idx = Math.max(1, Math.min(12, m || 1)) - 1;
    return `${meses[idx]} ${y || ""}`.trim();
  }

  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);

  const toCOP = useCurrency("COP", "es-CO");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getEstadisticas();
        setEstadisticas(data);
      } catch (error) {
        console.error("Error al traer estadísticas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Skeleton />;
  if (!estadisticas)
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <span className="text-3xl">📉</span>
        </div>
        <h3 className="text-xl font-semibold mb-1">No hay datos de estadísticas</h3>
        <p className="text-gray-600">Verifica que existan registros en el backend.</p>
      </div>
    );

  const { totalVentas, productosMasVendidos: _rawProductos = [], ventasPorMes: _rawVentasMes = [] } = estadisticas;

  // --- Adaptadores a tu payload real (según capturas) ---
  const productosAdaptados = Array.isArray(_rawProductos)
    ? _rawProductos.map((p) => ({
        producto: String(p?.nombre ?? "—"),
        cantidad: Number(p?.cantidad) || 0,
        marca: p?.marca ?? "",
        img: p?.img ?? "",
      }))
    : [];

  const ventasPorMesAdaptadas = Array.isArray(_rawVentasMes)
    ? _rawVentasMes.map((m) => ({
        mes: formatMes(m?.mes), // ej. "2025-8" -> "Ago 2025"
        ventas: Number(m?.totalVentas) || 0,
      }))
    : [];

  // --- Fallback para asegurar altura del gráfico aunque Tailwind no cargue ---
  const chartContainerStyle = { height: 320, minHeight: 320 };

  return (
    <div className="min-h-[60vh] bg-gray-50" style={{ backgroundColor: "#f9fafb" }}>
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">📊 Dashboard de Ventas</h2>
          <span className="text-xs md:text-sm text-gray-500">
            Actualizado {new Date().toLocaleDateString("es-CO")}
          </span>
        </div>

        {/* KPIs */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total de Ventas" value={toCOP(Number(totalVentas) || 0)} />
          <StatCard label="Productos listados" value={productosAdaptados.length} />
          <StatCard label="Meses en gráfico" value={ventasPorMesAdaptadas.length} />
          <StatCard
            label="Promedio mensual"
            value={toCOP(
              ventasPorMesAdaptadas.length
                ? Math.round(
                    ventasPorMesAdaptadas.reduce((a, b) => a + (Number(b.ventas) || 0), 0) /
                      ventasPorMesAdaptadas.length
                  )
                : 0
            )}
          />
        </div>

        {/* Contenido principal */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Gráfico */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">📅 Ventas por Mes</h3>
              <div className="text-xs text-gray-500">{ventasPorMesAdaptadas.length} puntos</div>
            </div>
            <div className="h-[320px]" style={chartContainerStyle}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ventasPorMesAdaptadas && ventasPorMesAdaptadas.length ? ventasPorMesAdaptadas : [{ mes: "—", ventas: 0 }]}
                  barCategoryGap={16}
                  margin={{ top: 20, right: 30, left: 60, bottom: 20 }} // 👈 margen izquierdo ampliado
                >
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                  <XAxis dataKey="mes" tickMargin={8} />
                  <YAxis width={100} tickFormatter={(v) => toCOP(v)} /> {/* 👈 más ancho y formateado */}
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid #eee" }}
                    formatter={(v, name) =>
                      name === "ventas" ? [toCOP(Number(v) || 0), "Ventas"] : [v, name]
                    }
                  />
                  <Legend />
                  <Bar dataKey="ventas" radius={[8, 8, 0, 0]} fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Productos más vendidos */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
            <h3 className="text-lg font-semibold mb-4">🔥 Productos Más Vendidos</h3>
            {productosAdaptados.length === 0 ? (
              <p className="text-gray-600 text-sm">Sin registros</p>
            ) : (
              <ul className="space-y-3">
                {productosAdaptados.map((prod, i) => (
                  <li key={`${prod.producto}-${i}`} className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-semibold">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{prod.producto}</p>
                        <span className="text-sm text-gray-600">{prod.cantidad} ventas</span>
                      </div>
                      {/* Barra de progreso (solo UI) */}
                      <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-2 rounded-full bg-gray-900/80"
                          style={{
                            width: `${
                              Math.min(
                                100,
                                (Number(prod.cantidad) /
                                  Math.max(
                                    1,
                                    ...productosAdaptados.map((p) => Number(p.cantidad) || 0)
                                  )) * 100
                              ).toFixed(2)
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraficaVentas;