"use client";

import { useState, useEffect } from "react";
import apiClient from "@/utils/apiClient";
import Link from "next/link";

interface Semana {
  id: string;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
}

export default function Home() {
  const [semanas, setSemanas] = useState<Semana[]>([]);
  const [nombre, setNombre] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  useEffect(() => {
    apiClient
      .get("/semanas")
      .then((response: { data: Semana[] }) => setSemanas(response.data))
      .catch((error: unknown) => console.error("Error fetching semanas:", error));
  }, []);

  const handleCreateSemana = () => {
    apiClient
      .post("/semanas", {
        nombre,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
      })
      .then((response: { data: Semana }) => setSemanas([...semanas, response.data]))
      .catch((error: unknown) => console.error("Error creating semana:", error));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Semanas</h1>

      <ul className="mb-4">
        {semanas.map((semana) => (
          <li key={semana.id}>
            <Link
              href={`/semana/${semana.id}`}
              className="text-blue-500 underline"
            >
              {semana.nombre}
            </Link>
          </li>
        ))}
      </ul>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="date"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
          className="border p-2 mr-2"
        />
        <button
          onClick={handleCreateSemana}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Crear Semana
        </button>
      </div>
    </div>
  );
}
