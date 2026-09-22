// src/components/AlertaToast.jsx

import React, { useEffect, useState } from "react";

function AlertaToast({ alertas, onCerrar }) {
  return (
    <div style={{
      position: "fixed",
      bottom: "20px",
      left: "20px",
      zIndex: 1000,
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      maxWidth: "320px",
    }}>
      {alertas.map((alerta) => (
        <ToastItem key={alerta.id} alerta={alerta} onCerrar={onCerrar} />
      ))}
    </div>
  );
}

function ToastItem({ alerta, onCerrar }) {
  const [visible, setVisible] = useState(true);
  const [saliendo, setSaliendo] = useState(false);

  const colores = {
    verde:   { bg: "#2A7A50", border: "#1D5E3A", text: "#FFFFFF" },
    naranja: { bg: "#C4742A", border: "#A85E1E", text: "#FFFFFF" },
    rojo:    { bg: "#B83030", border: "#8A2020", text: "#FFFFFF" },
  };

  const iconos = {
    verde:   "✓",
    naranja: "⚠",
    rojo:    "✕",
  };

  const color = colores[alerta.nivel] || colores.verde;

  useEffect(() => {
    const timer = setTimeout(() => {
      setSaliendo(true);
      setTimeout(() => {
        setVisible(false);
        onCerrar(alerta.id);
      }, 300);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const cerrar = () => {
    setSaliendo(true);
    setTimeout(() => {
      setVisible(false);
      onCerrar(alerta.id);
    }, 300);
  };

  if (!visible) return null;

  return (
    <div style={{
      background: color.bg,
      border: `1px solid ${color.border}`,
      borderRadius: "10px",
      padding: "12px 14px",
      display: "flex",
      alignItems: "flex-start",
      gap: "10px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
      opacity: saliendo ? 0 : 1,
      transform: saliendo ? "translateX(-20px)" : "translateX(0)",
      transition: "all 0.3s ease",
      animation: "slideInLeft 0.3s ease",
    }}>

      {/* Ícono */}
      <div style={{
        width: "24px", height: "24px",
        borderRadius: "50%",
        background: "rgba(255,255,255,0.2)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "13px", fontWeight: 700,
        color: color.text,
        flexShrink: 0,
      }}>
        {iconos[alerta.nivel]}
      </div>

      {/* Texto */}
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: "12px", fontWeight: 600,
          color: color.text, marginBottom: "2px",
        }}>
          {alerta.titulo}
        </div>
        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.85)", lineHeight: 1.4 }}>
          {alerta.mensaje}
        </div>
      </div>

      {/* Cerrar */}
      <button
        onClick={cerrar}
        style={{
          background: "rgba(255,255,255,0.2)",
          border: "none",
          color: color.text,
          cursor: "pointer",
          borderRadius: "4px",
          padding: "2px 6px",
          fontSize: "12px",
          flexShrink: 0,
        }}
      >✕</button>

      {/* Barra de progreso */}
      <div style={{
        position: "absolute",
        bottom: 0, left: 0,
        height: "3px",
        background: "rgba(255,255,255,0.4)",
        borderRadius: "0 0 10px 10px",
        animation: "progressBar 10s linear forwards",
        width: "100%",
      }} />
    </div>
  );
}

export default AlertaToast;