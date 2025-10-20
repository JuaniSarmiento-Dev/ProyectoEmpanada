"use client";

import { useState, useEffect } from 'react';
import { use } from 'react';
import apiClient from '@/utils/apiClient';

interface Balance {
  total_ingresos: number;
  total_egresos: number;
  balance_neto: number;
}

interface Transaccion {
  id: string;
  tipo: string;
  monto: number;
  descripcion: string;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function SemanaDetail({ params }: PageProps) {
  const { id } = use(params);

  const [balance, setBalance] = useState<Balance>({
    total_ingresos: 0,
    total_egresos: 0,
    balance_neto: 0,
  });

  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [tipo, setTipo] = useState('ingreso');
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');

  useEffect(() => {
    if (id) {
      apiClient.get<Balance>(`/semanas/${id}/balance`)
        .then((response: { data: Balance }) => setBalance(response.data))
        .catch((error: unknown) => console.error('Error fetching balance:', error));

      apiClient.get<Transaccion[]>(`/semanas/${id}/transacciones`)
        .then((response: { data: Transaccion[] }) => setTransacciones(response.data))
        .catch((error: unknown) => console.error('Error fetching transactions:', error));
    }
  }, [id]);

  const handleAddTransaction = () => {
    apiClient.post('/transacciones', {
      tipo,
      monto: parseFloat(monto),
      descripcion,
      semana_id: id,
    })
      .then(() => {
        // Refresh balance and transactions
        apiClient.get<Balance>(`/semanas/${id}/balance`)
          .then((response: { data: Balance }) => setBalance(response.data));

        apiClient.get<Transaccion[]>(`/semanas/${id}/transacciones`)
          .then((response: { data: Transaccion[] }) => setTransacciones(response.data));
        
        // Clear form
        setMonto('');
        setDescripcion('');
      })
      .catch((error: unknown) => console.error('Error adding transaction:', error));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Detalle de Semana</h1>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="p-4 bg-green-100 rounded">
          <h2 className="text-lg font-bold">Ingresos</h2>
          <p className="text-xl">${balance.total_ingresos}</p>
        </div>
        <div className="p-4 bg-red-100 rounded">
          <h2 className="text-lg font-bold">Egresos</h2>
          <p className="text-xl">${balance.total_egresos}</p>
        </div>
        <div className="p-4 bg-blue-100 rounded">
          <h2 className="text-lg font-bold">Balance Neto</h2>
          <p className="text-xl">${balance.balance_neto}</p>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-bold mb-2">Añadir Movimiento</h2>
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="border p-2 mr-2"
        >
          <option value="ingreso">Ingreso</option>
          <option value="egreso">Egreso</option>
        </select>
        <input
          type="number"
          placeholder="Monto"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="border p-2 mr-2"
        />
        <button
          onClick={handleAddTransaction}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Guardar
        </button>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-2">Transacciones</h2>
        <ul>
          {transacciones.map((t) => (
            <li key={t.id} className="border-b py-2">
              <p><strong>{t.tipo}</strong>: ${t.monto} - {t.descripcion}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}