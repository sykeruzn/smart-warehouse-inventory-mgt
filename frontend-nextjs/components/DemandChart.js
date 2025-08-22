import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function DemandChart({ actual = [], predicted = [] }) {
  const months = Array.from(
    new Set([...actual.map(a => a.month), ...predicted.map(p => p.month)])
  ).sort((a, b) => a - b);

  const labels = months.map(m => MONTHS[m - 1] || `M${m}`);

  const actMap = new Map(actual.map(a => [a.month, a.sales]));
  const predMap = new Map(predicted.map(p => [p.month, p.predicted]));

  const data = {
    labels,
    datasets: [
      {
        label: 'Actual Sales',
        data: months.map(m => actMap.get(m) ?? 0),
        tension: 0.3,
        borderColor: '#3b82f6',      // blue line
        backgroundColor: '#3b82f6',  // legend dot
      },
      {
        label: 'Predicted Demand',
        data: months.map(m => predMap.get(m) ?? 0),
        borderDash: [6, 6],
        tension: 0.3,
        borderColor: '#dbeafe',      // light blue dashed line
        backgroundColor: '#dbeafe',  // legend dot
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          },
        },
      },
      title: {
        display: true,
        text: 'Predicted vs Actual Demand',
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

  return <Line data={data} options={options} />;
}
