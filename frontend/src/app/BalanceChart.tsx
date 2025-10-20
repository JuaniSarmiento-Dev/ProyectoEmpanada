"use client";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Balance } from "@/utils/apiClient";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function BalanceChart({ balance }: { balance: Balance }) {
  const data = {
    labels: ["Ingresos", "Gastos", "Balance"],
    datasets: [
      {
        label: "$",
        data: [balance.total_ingresos, balance.total_gastos, balance.balance],
        backgroundColor: [
          "#06b6d4", // cyan
          "#ec4899", // pink
          balance.balance >= 0 ? "#22c55e" : "#ef4444", // green/red
        ],
        borderRadius: 8,
        barPercentage: 0.6,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "#334155" }, beginAtZero: true },
    },
  };
  return <Bar data={data} options={options} />;
}
