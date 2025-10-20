"use client";

import { useEffect, useState } from "react";
import { getSemanas, createSemana, Semana, SemanaCreate, getBalance, Balance, addIngreso, addGasto, getIngresos, getGastos, Ingreso, Gasto, deleteSemana, deleteIngreso, deleteGasto } from "@/utils/apiClient";
import dynamic from "next/dynamic";
// Importa el gráfico de forma dinámica para evitar problemas SSR
const BalanceChart = dynamic(() => import("./BalanceChart"), { ssr: false });

export default function HomePage() {
  const [semanas, setSemanas] = useState<Semana[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<SemanaCreate>({ nombre: "" });
  const [ingresoForm, setIngresoForm] = useState({ descripcion: "", monto: "" });
  const [gastoForm, setGastoForm] = useState({ descripcion: "", monto: "" });
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedSemana, setSelectedSemana] = useState<Semana | null>(null);
  const [balance, setBalance] = useState<Balance | null>(null);

  const fetchSemanas = async () => {
    setLoading(true);
    try {
      const data = await getSemanas();
      setSemanas(data);
    } catch (e) {
      setError("Error al cargar semanas");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSemanas();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleIngresoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIngresoForm({ ...ingresoForm, [e.target.name]: e.target.value });
  };
  const handleGastoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGastoForm({ ...gastoForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await createSemana(form);
      setForm({ nombre: "" });
      fetchSemanas();
    } catch (e) {
      setError("Error al crear semana");
    }
  };

  const handleAddIngreso = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSemana) return;
    try {
      await addIngreso(selectedSemana.id, { descripcion: ingresoForm.descripcion, monto: parseFloat(ingresoForm.monto) });
      setIngresoForm({ descripcion: "", monto: "" });
      fetchIngresos(selectedSemana.id);
      fetchBalance(selectedSemana.id);
    } catch {
      setError("Error al agregar ingreso");
    }
  };

  const handleAddGasto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSemana) return;
    try {
      await addGasto(selectedSemana.id, { descripcion: gastoForm.descripcion, monto: parseFloat(gastoForm.monto) });
      setGastoForm({ descripcion: "", monto: "" });
      fetchGastos(selectedSemana.id);
      fetchBalance(selectedSemana.id);
    } catch {
      setError("Error al agregar gasto");
    }
  };

  const fetchIngresos = async (semanaId: number) => {
    try {
      const data = await getIngresos(semanaId);
      setIngresos(data);
    } catch (error) {
      console.error('Error fetching ingresos:', error);
      setIngresos([]);
    }
  };
  const fetchGastos = async (semanaId: number) => {
    try {
      const data = await getGastos(semanaId);
      setGastos(data);
    } catch (error) {
      console.error('Error fetching gastos:', error);
      setGastos([]);
    }
  };
  const fetchBalance = async (semanaId: number) => {
    try {
      const bal = await getBalance(semanaId);
      setBalance(bal);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance(null);
    }
  };

  const handleSelectSemana = async (semana: Semana) => {
    setSelectedSemana(semana);
    await Promise.all([
      fetchIngresos(semana.id),
      fetchGastos(semana.id),
      fetchBalance(semana.id),
    ]);
  };

  const handleDeleteSemana = async (semanaId: number) => {
    if (!confirm('¿Estás seguro de eliminar esta semana? Se eliminarán todos sus ingresos y gastos.')) return;
    try {
      await deleteSemana(semanaId);
      setSelectedSemana(null);
      fetchSemanas();
    } catch {
      setError("Error al eliminar semana");
    }
  };

  const handleDeleteIngreso = async (ingresoId: number) => {
    if (!selectedSemana) return;
    try {
      await deleteIngreso(ingresoId);
      await Promise.all([
        fetchIngresos(selectedSemana.id),
        fetchBalance(selectedSemana.id),
      ]);
    } catch {
      setError("Error al eliminar ingreso");
    }
  };

  const handleDeleteGasto = async (gastoId: number) => {
    if (!selectedSemana) return;
    try {
      await deleteGasto(gastoId);
      await Promise.all([
        fetchGastos(selectedSemana.id),
        fetchBalance(selectedSemana.id),
      ]);
    } catch {
      setError("Error al eliminar gasto");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 px-3 sm:px-6 py-6 sm:py-10">
      {/* Header con efecto glassmorphism */}
      <header className="text-center mb-8 sm:mb-12 animate-fade-in">
        <div className="inline-block mb-4">
          <div className="p-4 rounded-full bg-gradient-to-br from-cyan-500/20 to-pink-500/20 border border-cyan-500/30 backdrop-blur-sm">
            <svg className="w-12 h-12 sm:w-16 sm:h-16 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black mb-3 bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-500 bg-clip-text text-transparent drop-shadow-2xl tracking-tight">
          Balance Semanal
        </h1>
        <p className="text-base sm:text-xl text-gray-400 font-light max-w-2xl mx-auto px-4">
          Gestiona tus <span className="text-cyan-400 font-semibold">ingresos</span> y <span className="text-pink-400 font-semibold">gastos</span> de forma simple, visual y elegante
        </p>
      </header>

      {/* Formulario de creación de semana */}
      <section className="max-w-md mx-auto mb-8 sm:mb-12">
        <form onSubmit={handleSubmit} className="relative overflow-hidden bg-gradient-to-br from-gray-900/90 to-gray-800/90 p-6 sm:p-8 rounded-3xl shadow-2xl border border-gray-700/50 backdrop-blur-xl hover:border-cyan-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl"></div>
          
          <h2 className="text-xl sm:text-2xl font-bold mb-5 text-transparent bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text flex items-center gap-2">
            <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nueva semana
          </h2>
          
          <div className="relative mb-4">
            <input
              type="text"
              name="nombre"
              placeholder="Ej: Semana 1, Enero 2025..."
              value={form.nombre}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl bg-gray-800/80 border-2 border-gray-700/50 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 outline-none text-base sm:text-lg transition-all duration-300"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-cyan-500 via-pink-500 to-purple-500 hover:from-cyan-600 hover:via-pink-600 hover:to-purple-600 text-white font-bold py-3 sm:py-4 px-6 rounded-2xl shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            ✨ Crear semana
          </button>
          
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-xl">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </form>
      </section>

      {/* Lista de semanas */}
      <section className="max-w-3xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-6">
          <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text">
            Tus semanas
          </h2>
        </div>
        
        {loading ? (
          <div className="text-center text-gray-400 py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500/20 border-t-cyan-500"></div>
            <p className="mt-4">Cargando semanas...</p>
          </div>
        ) : semanas.length === 0 ? (
          <div className="text-center py-12 px-6 bg-gray-900/50 rounded-3xl border border-gray-800/50">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-500">No hay semanas creadas aún.</p>
            <p className="text-gray-600 text-sm mt-2">¡Crea tu primera semana arriba!</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {semanas.map((semana, index) => (
              <li 
                key={semana.id} 
                className="group relative overflow-hidden bg-gradient-to-r from-gray-900/80 to-gray-800/80 p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 border border-gray-800/50 shadow-lg hover:shadow-cyan-500/20 hover:border-cyan-500/30 transition-all duration-300 backdrop-blur-sm"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="flex items-center gap-3 z-10">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-pink-500/20 flex items-center justify-center border border-cyan-500/30">
                    <span className="text-cyan-400 font-bold text-lg">{index + 1}</span>
                  </div>
                  <span className="font-bold text-lg sm:text-xl text-white">{semana.nombre}</span>
                </div>
                
                <div className="flex gap-2 z-10">
                  <button
                    className="bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 text-white font-bold py-2 px-6 rounded-xl shadow-lg hover:shadow-pink-500/30 transition-all duration-300 transform hover:scale-105 active:scale-95 whitespace-nowrap"
                    onClick={() => handleSelectSemana(semana)}
                  >
                    📊 Ver balance
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl shadow-lg hover:shadow-red-500/30 transition-all duration-300 transform hover:scale-105 active:scale-95"
                    onClick={() => handleDeleteSemana(semana.id)}
                    title="Eliminar semana"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {selectedSemana && (
        <section className="max-w-4xl mx-auto mt-10 relative">
          {/* Efectos de fondo */}
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative bg-gradient-to-br from-gray-900/95 to-gray-800/95 p-6 sm:p-10 rounded-3xl shadow-2xl border border-gray-700/50 backdrop-blur-xl">
            {/* Header de gestión */}
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
                Gestión de <span className="text-transparent bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text">"{selectedSemana.nombre}"</span>
              </h2>
              <p className="text-gray-400 text-sm">Agrega y visualiza tus movimientos financieros</p>
            </div>
            
            {/* Grid de Ingresos y Gastos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-10">
              {/* Ingresos */}
              <div className="bg-gray-800/50 p-6 rounded-2xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <h3 className="text-xl font-bold text-cyan-400">Ingresos</h3>
                </div>
                
                <form onSubmit={handleAddIngreso} className="flex gap-2 mb-4">
                  <input 
                    type="text" 
                    name="descripcion" 
                    placeholder="Descripción" 
                    value={ingresoForm.descripcion} 
                    onChange={handleIngresoChange} 
                    className="flex-1 p-3 rounded-xl bg-gray-900/80 border border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all" 
                    required 
                  />
                  <input 
                    type="number" 
                    step="0.01"
                    name="monto" 
                    placeholder="$" 
                    value={ingresoForm.monto} 
                    onChange={handleIngresoChange} 
                    className="w-24 sm:w-28 p-3 rounded-xl bg-gray-900/80 border border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all" 
                    required 
                  />
                  <button 
                    type="submit" 
                    className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-5 rounded-xl shadow-lg hover:shadow-cyan-500/30 transition-all transform hover:scale-105 active:scale-95"
                  >
                    +
                  </button>
                </form>
                
                <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                  {ingresos.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">Sin ingresos registrados</p>
                  ) : (
                    ingresos.map((i) => (
                      <div 
                        key={i.id} 
                        className="flex justify-between items-center p-3 rounded-xl bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-all group"
                      >
                        <div className="flex-1">
                          <span className="text-green-300 font-medium">{i.descripcion}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-400 font-bold">${i.monto.toFixed(2)}</span>
                          <button
                            onClick={() => handleDeleteIngreso(i.id)}
                            className="opacity-0 group-hover:opacity-100 bg-red-500/20 hover:bg-red-500/40 text-red-400 p-1 rounded transition-all"
                            title="Eliminar ingreso"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              {/* Gastos */}
              <div className="bg-gray-800/50 p-6 rounded-2xl border border-pink-500/20 hover:border-pink-500/40 transition-all">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                  <h3 className="text-xl font-bold text-pink-400">Gastos</h3>
                </div>
                
                <form onSubmit={handleAddGasto} className="flex gap-2 mb-4">
                  <input 
                    type="text" 
                    name="descripcion" 
                    placeholder="Descripción" 
                    value={gastoForm.descripcion} 
                    onChange={handleGastoChange} 
                    className="flex-1 p-3 rounded-xl bg-gray-900/80 border border-gray-700 text-white placeholder-gray-500 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all" 
                    required 
                  />
                  <input 
                    type="number" 
                    step="0.01"
                    name="monto" 
                    placeholder="$" 
                    value={gastoForm.monto} 
                    onChange={handleGastoChange} 
                    className="w-24 sm:w-28 p-3 rounded-xl bg-gray-900/80 border border-gray-700 text-white placeholder-gray-500 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all" 
                    required 
                  />
                  <button 
                    type="submit" 
                    className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-5 rounded-xl shadow-lg hover:shadow-pink-500/30 transition-all transform hover:scale-105 active:scale-95"
                  >
                    +
                  </button>
                </form>
                
                <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                  {gastos.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">Sin gastos registrados</p>
                  ) : (
                    gastos.map((g) => (
                      <div 
                        key={g.id} 
                        className="flex justify-between items-center p-3 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all group"
                      >
                        <div className="flex-1">
                          <span className="text-red-300 font-medium">{g.descripcion}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-red-400 font-bold">${g.monto.toFixed(2)}</span>
                          <button
                            onClick={() => handleDeleteGasto(g.id)}
                            className="opacity-0 group-hover:opacity-100 bg-red-500/20 hover:bg-red-500/40 text-red-400 p-1 rounded transition-all"
                            title="Eliminar gasto"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            
            {/* Balance y Gráfico */}
            {balance && (
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-8 rounded-2xl border border-gray-700/50">
                <h3 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                  Balance visual
                </h3>
                
                {/* Gráfico */}
                <div className="flex justify-center mb-8">
                  <div className="w-full max-w-md bg-gray-900/50 p-6 rounded-2xl border border-gray-700/30">
                    <BalanceChart balance={balance} />
                  </div>
                </div>
                
                {/* Resumen numérico */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="bg-cyan-500/10 p-4 rounded-xl border border-cyan-500/30">
                    <p className="text-cyan-400 text-sm font-semibold mb-1">Total Ingresos</p>
                    <p className="text-cyan-300 text-2xl font-black">${balance.total_ingresos.toFixed(2)}</p>
                  </div>
                  
                  <div className="bg-pink-500/10 p-4 rounded-xl border border-pink-500/30">
                    <p className="text-pink-400 text-sm font-semibold mb-1">Total Gastos</p>
                    <p className="text-pink-300 text-2xl font-black">${balance.total_gastos.toFixed(2)}</p>
                  </div>
                  
                  <div className={`p-4 rounded-xl border ${balance.balance >= 0 ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                    <p className={`text-sm font-semibold mb-1 ${balance.balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      Balance Final
                    </p>
                    <p className={`text-3xl font-black ${balance.balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ${balance.balance.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}