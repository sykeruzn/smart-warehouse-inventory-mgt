import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function InventoryChart({ data = [] }) {
  const labels = data.map(i => i.product_id);
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Stock Level',
        data: data.map(i => i.stock),
        backgroundColor: data.map(i => '#fef3c7'),
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          font: {
            family: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          },
        },
      },
      title: {
        display: true,
        text: 'Inventory Stock Levels',
        font: {
          family: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          size: 16,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            family: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          },
        },
      },
      y: {
        ticks: {
          font: {
            family: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          },
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}
