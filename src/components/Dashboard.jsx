// src/components/Dashboard.jsx

import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

function Dashboard({
  totalVentas,
  pedidosCount,
  gastos,
  abrirGastos,
  abrirCierre,
  dark,
  efectivoRecibido = 0,
  cambioEntregado = 0,
  transferenciaTotal = 0,
  tarjetaTotal = 0,
  baseCaja = 0,
  efectivoEnCaja = 0,
  diaAbierto = false,
  abrirApertura,
  historialAlertas = [],
}) {
  const chartHorasRef = useRef(null);
  const chartSemanalRef = useRef(null);
  const chartHorasInstance = useRef(null);
  const chartSemanalInstance = useRef(null);

  const fmt = (n) => "$" + Math.round(n).toLocaleString("es-CO");

  const totalGastos = gastos.reduce((s, g) => s + g.val, 0);
  const utilidad = totalVentas - totalGastos;
  const margen =
    totalVentas > 0 ? Math.round((utilidad / totalVentas) * 100) : 0;



  useEffect(() => {
    const tc = dark ? "#6A6560" : "#9A978E";
    const gc = dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";

    if (chartHorasInstance.current) chartHorasInstance.current.destroy();
    if (chartSemanalInstance.current) chartSemanalInstance.current.destroy();

    if (chartHorasRef.current) {
      chartHorasInstance.current = new Chart(chartHorasRef.current, {
        type: "bar",
        data: {
          labels: [
            "7am",
            "8am",
            "9am",
            "10am",
            "11am",
            "12pm",
            "1pm",
            "2pm",
            "3pm",
          ],
          datasets: [
            {
              label: "Ventas",
              data: [],
              backgroundColor: "#C4742A",
              borderRadius: 5,
              borderSkipped: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: {
              ticks: { color: tc, font: { size: 11 } },
              grid: { color: gc },
            },
            y: {
              ticks: {
                color: tc,
                font: { size: 11 },
                callback: (v) => "$" + Math.round(v / 1000) + "k",
              },
              grid: { color: gc },
            },
          },
        },
      });
    }

    if (chartSemanalRef.current) {
      chartSemanalInstance.current = new Chart(chartSemanalRef.current, {
        type: "line",
        data: {
          labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
          datasets: [
            {
              label: "Ingresos",
              data: [],
              borderColor: "#C4742A",
              backgroundColor: "rgba(196,116,42,0.08)",
              borderWidth: 2,
              pointRadius: 3,
              pointBackgroundColor: "#C4742A",
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: {
              ticks: { color: tc, font: { size: 10 } },
              grid: { display: false },
            },
            y: {
              ticks: {
                color: tc,
                font: { size: 10 },
                callback: (v) => "$" + Math.round(v / 1000) + "k",
              },
              grid: { color: gc },
            },
          },
        },
      });
    }

    return () => {
      chartHorasInstance.current?.destroy();
      chartSemanalInstance.current?.destroy();
    };
  }, [dark]);

  return (
    <div className="main active fade-in" id="tab-dashboard">
      {/* ── MÉTRICAS ── */}
      <div className="section-label">Resumen del día</div>
      <div className="dash-metrics">
        <div className="metric-card">
          <div className="metric-label">Ingresos totales</div>
          <div
            className="metric-value number"
            style={{ color: "var(--green)" }}
          >
            {fmt(totalVentas)}
          </div>
          <div className="metric-sub">
            {pedidosCount} pedido{pedidosCount !== 1 ? "s" : ""} registrado
            {pedidosCount !== 1 ? "s" : ""}
          </div>
        </div>

        <div className="metric-card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "6px",
            }}
          >
            <div className="metric-label">Gastos del día</div>
            <button
              className="btn btn-sm"
              onClick={abrirGastos}
              style={{ fontSize: "10px", padding: "3px 8px" }}
            >
              + Editar
            </button>
          </div>
          <div className="metric-value number" style={{ color: "var(--red)" }}>
            {fmt(totalGastos)}
          </div>
          <div className="metric-sub">
            {gastos.length > 0
              ? [...new Set(gastos.map((g) => g.cat))].join(" · ")
              : "Sin gastos aún"}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Utilidad neta</div>
          <div
            className="metric-value number"
            style={{ color: utilidad >= 0 ? "var(--amber)" : "var(--red)" }}
          >
            {fmt(utilidad)}
          </div>
          <div className="metric-sub">{margen}% margen</div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Efectivo en caja</div>
          <div
            className="metric-value number"
            style={{ color: "var(--green)" }}
          >
            {fmt(efectivoRecibido - cambioEntregado)}
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "var(--text3)",
              marginTop: "4px",
            }}
          >
            Recibido: {fmt(efectivoRecibido)}
          </div>
          <div
            style={{ fontSize: "11px", color: "var(--red)", marginTop: "2px" }}
          >
            Cambio: -{fmt(cambioEntregado)}
          </div>
        </div>
      </div>

      {/* ── GRÁFICAS ── */}
      <div className="dash-row">
        <div className="card">
          <div className="card-title-row">
            <span className="card-title">Ventas por hora</span>
            <span className="badge badge-gray">Pico: 1pm</span>
          </div>
          <div className="chart-wrap" style={{ height: "200px" }}>
            <canvas ref={chartHorasRef}></canvas>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Platos más pedidos hoy</div>
          <div
            style={{
              textAlign: "center",
              padding: "30px 0",
              color: "var(--text3)",
              fontSize: "12px",
            }}
          >
            Las ventas del día aparecerán aquí
          </div>
        </div>
      </div>

      {/* ── CUENTAS + SEMANAL + ALERTAS ── */}
      <div className="dash-bottom">
        <div className="card">
          <div className="card-title-row">
            <span className="card-title">Cuentas del día</span>
          </div>

          {/* Ingresos */}
          <div className="item-row">
            <span className="item-row-label">Ingresos brutos</span>
            <span
              className="item-row-val number"
              style={{ color: "var(--green)" }}
            >
              {fmt(totalVentas)}
            </span>
          </div>

          {/* Gastos */}
          {gastos.map((g) => (
            <div key={g.id} className="item-row">
              <span
                className="item-row-label"
                style={{ color: "var(--text2)" }}
              >
                {g.desc}
              </span>
              <span
                className="item-row-val number"
                style={{ color: "var(--red)" }}
              >
                -{fmt(g.val)}
              </span>
            </div>
          ))}

          <hr className="divider" style={{ margin: "8px 0" }} />

          {/* Control de efectivo */}
          <div className="metric-card">
            <div className="metric-label">Efectivo en gaveta</div>
            <div
              className="metric-value number"
              style={{ color: "var(--green)" }}
            >
              {fmt(efectivoEnCaja)}
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "var(--text3)",
                marginTop: "4px",
              }}
            >
              Base: {fmt(baseCaja)}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text3)" }}>
              Cobros: +{fmt(efectivoRecibido)}
            </div>
            <div style={{ fontSize: "11px", color: "var(--red)" }}>
              Cambios: -{fmt(cambioEntregado)}
            </div>
          </div>

          {/* Utilidad neta */}
          <div
            className="item-row"
            style={{
              background: "transparent",
              paddingLeft: 0,
              paddingRight: 0,
            }}
          >
            <span
              className="item-row-label"
              style={{ fontWeight: 600, fontSize: "13px" }}
            >
              Utilidad neta
            </span>
            <span
              className="item-row-val number"
              style={{
                fontSize: "14px",
                color: utilidad >= 0 ? "var(--amber)" : "var(--red)",
              }}
            >
              {fmt(utilidad)}
            </span>
          </div>

          <div style={{ marginTop: "12px" }}>
            {!diaAbierto ? (
              <button
                className="btn btn-full btn-lg"
                style={{
                  background: "var(--green)",
                  color: "white",
                  border: "none",
                }}
                onClick={abrirApertura}
              >
                🌅 Generar apertura de caja
              </button>
            ) : (
              <button
                className="btn btn-accent btn-full btn-lg"
                onClick={abrirCierre}
              >
                🌙 Generar cierre de caja
              </button>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-title">Rendimiento semanal</div>
          <div className="chart-wrap" style={{ height: "170px" }}>
            <canvas ref={chartSemanalRef}></canvas>
          </div>
        </div>

{/* ── HISTORIAL DE ALERTAS ── */}
<div className="card" style={{ marginTop: "14px" }}>
  <div className="card-title-row">
    <span className="card-title">Alertas del día</span>
    <span className="badge badge-gray">{historialAlertas.length} alertas</span>
  </div>
  {historialAlertas.length === 0 ? (
    <div style={{ textAlign: "center", padding: "20px", color: "var(--text3)", fontSize: "12px" }}>
      Sin alertas registradas
    </div>
  ) : (
    historialAlertas.slice(0, 10).map((a, i) => {
      const colores = {
        verde:   { bg: "var(--green-bg)",  color: "var(--green)",  border: "var(--green)"  },
        naranja: { bg: "var(--amber-bg)",  color: "var(--amber)",  border: "var(--amber)"  },
        rojo:    { bg: "var(--red-bg)",    color: "var(--red)",    border: "var(--red)"    },
      };
      const c = colores[a.nivel] || colores.verde;
      return (
        <div key={a.id} style={{
          display: "flex", alignItems: "flex-start", gap: "10px",
          padding: "9px 12px", marginBottom: "5px",
          background: c.bg, borderRadius: "var(--r-sm)",
          borderLeft: `3px solid ${c.border}`,
        }}>
          <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: c.color, flexShrink: 0, marginTop: "4px" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "12px", fontWeight: 600, color: c.color }}>{a.titulo}</div>
            <div style={{ fontSize: "11px", color: c.color, opacity: 0.8, marginTop: "1px" }}>{a.mensaje}</div>
          </div>
          <span style={{ fontSize: "10px", color: c.color, opacity: 0.7, flexShrink: 0 }}>{a.hora}</span>
        </div>
      );
    })
  )}
</div>
      </div>
    </div>
  );
}

export default Dashboard;
