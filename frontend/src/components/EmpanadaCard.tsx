
import { Empanada } from "@/utils/apiClient";

interface EmpanadaCardProps {
  empanada: Empanada;
}

export default function EmpanadaCard({ empanada }: EmpanadaCardProps) {
  return (
    <div className="border border-gray-700 rounded-lg p-6 bg-gray-800 hover:bg-gray-700 transition-colors duration-300 ease-in-out shadow-lg hover:shadow-cyan-500/20">
      <h2 className="text-2xl font-semibold text-white mb-2">{empanada.nombre}</h2>
      <p className="text-lg text-cyan-400 font-mono">${empanada.precio.toFixed(2)}</p>
    </div>
  );
}
