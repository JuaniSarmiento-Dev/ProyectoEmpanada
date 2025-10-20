

export interface Semana {
  id: number;
  nombre: string;
  ingresos: Ingreso[];
  gastos: Gasto[];
}

export interface SemanaCreate {
  nombre: string;
}

export interface Ingreso {
  id: number;
  descripcion: string;
  monto: number;
  semana_id: number;
}

export interface IngresoCreate {
  descripcion: string;
  monto: number;
}

export interface Gasto {
  id: number;
  descripcion: string;
  monto: number;
  semana_id: number;
}

export interface GastoCreate {
  descripcion: string;
  monto: number;
}

export interface Balance {
  total_ingresos: number;
  total_gastos: number;
  balance: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8010';

// --- Semanas ---
export const getSemanas = async (): Promise<Semana[]> => {
  const res = await fetch(`${API_URL}/semanas/`);
  if (!res.ok) throw new Error('Error al obtener semanas');
  return res.json();
};

export const createSemana = async (semana: SemanaCreate): Promise<Semana> => {
  const res = await fetch(`${API_URL}/semanas/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(semana),
  });
  if (!res.ok) throw new Error('Error al crear semana');
  return res.json();
};

export const updateSemana = async (semanaId: number, semana: SemanaCreate): Promise<Semana> => {
  const res = await fetch(`${API_URL}/semanas/${semanaId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(semana),
  });
  if (!res.ok) throw new Error('Error al actualizar semana');
  return res.json();
};

export const deleteSemana = async (semanaId: number): Promise<void> => {
  const res = await fetch(`${API_URL}/semanas/${semanaId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar semana');
};

// --- Ingresos ---
export const addIngreso = async (semanaId: number, ingreso: IngresoCreate): Promise<Ingreso> => {
  const res = await fetch(`${API_URL}/semanas/${semanaId}/ingresos/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ingreso),
  });
  if (!res.ok) throw new Error('Error al agregar ingreso');
  return res.json();
};

export const getIngresos = async (semanaId: number): Promise<Ingreso[]> => {
  const res = await fetch(`${API_URL}/semanas/${semanaId}/ingresos/`);
  if (!res.ok) throw new Error('Error al obtener ingresos');
  return res.json();
};

export const updateIngreso = async (ingresoId: number, ingreso: IngresoCreate): Promise<Ingreso> => {
  const res = await fetch(`${API_URL}/ingresos/${ingresoId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ingreso),
  });
  if (!res.ok) throw new Error('Error al actualizar ingreso');
  return res.json();
};

export const deleteIngreso = async (ingresoId: number): Promise<void> => {
  const res = await fetch(`${API_URL}/ingresos/${ingresoId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar ingreso');
};

// --- Gastos ---
export const addGasto = async (semanaId: number, gasto: GastoCreate): Promise<Gasto> => {
  const res = await fetch(`${API_URL}/semanas/${semanaId}/gastos/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(gasto),
  });
  if (!res.ok) throw new Error('Error al agregar gasto');
  return res.json();
};

export const getGastos = async (semanaId: number): Promise<Gasto[]> => {
  const res = await fetch(`${API_URL}/semanas/${semanaId}/gastos/`);
  if (!res.ok) throw new Error('Error al obtener gastos');
  return res.json();
};

export const updateGasto = async (gastoId: number, gasto: GastoCreate): Promise<Gasto> => {
  const res = await fetch(`${API_URL}/gastos/${gastoId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(gasto),
  });
  if (!res.ok) throw new Error('Error al actualizar gasto');
  return res.json();
};

export const deleteGasto = async (gastoId: number): Promise<void> => {
  const res = await fetch(`${API_URL}/gastos/${gastoId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar gasto');
};

// --- Balance ---
export const getBalance = async (semanaId: number): Promise<Balance> => {
  const res = await fetch(`${API_URL}/semanas/${semanaId}/balance/`);
  if (!res.ok) throw new Error('Error al obtener balance');
  return res.json();
};
