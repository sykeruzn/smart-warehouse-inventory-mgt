import { Chart as ChartJS, Tooltip, Legend, Title, CategoryScale, LinearScale } from 'chart.js';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';
import { Chart } from 'react-chartjs-2';

// Register Chart.js + Matrix plugin
ChartJS.register(MatrixController, MatrixElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

export default function HeatmapChart({ data = [] }) {
  // Extract locations and hours
  const locations = [...new Set(data.map(r => r.location))];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const hourLabels = hours.map(h => `${h}:00`);

  // Count scans per (location, hour)
  const counts = {};
  data.forEach(r => {
    const loc = r.location;
    const hour = new Date(r.timestamp).getHours();
    const key = `${loc}-${hour}`;
    counts[key] = (counts[key] || 0) + 1;
  });

  const maxCount = Math.max(...Object.values(counts), 1); // avoid div by 0

  // Build dataset
  const datasets = [{
    label: 'RFID Heatmap',
    data: locations.flatMap(loc =>
      hours.map(hour => ({
        x: `${hour}:00`,
        y: loc,
        v: counts[`${loc}-${hour}`] || 0
      }))
    ),
    backgroundColor: ctx => {
        const value = ctx.raw?.v ?? 0;
        const intensity = value / maxCount; // 0 → 1

        // Base color = #f3e8ff (light purple), target color = #7c3aed (dark purple)
        const base = [243, 232, 255]; // RGB for #f3e8ff
        const target = [124, 58, 237]; // RGB for #7c3aed

        // Linear interpolation
        const r = Math.round(base[0] + (target[0] - base[0]) * intensity);
        const g = Math.round(base[1] + (target[1] - base[1]) * intensity);
        const b = Math.round(base[2] + (target[2] - base[2]) * intensity);

        return `rgb(${r}, ${g}, ${b})`;
        },

    borderWidth: 1,
    borderColor: 'white',
    width: ({ chart }) => {
      const area = chart.chartArea;
      return area ? (area.width / hours.length) - 2 : 20; // fallback size
    },
    height: ({ chart }) => {
      const area = chart.chartArea;
      return area ? (area.height / locations.length) - 2 : 20; // fallback size
    }
  }];

  // Chart config
  const chartData = {
    labels: hourLabels,
    datasets
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => `Count: ${ctx.raw?.v ?? 0}`
        }
      },
      title: { 
        display: true, 
        text: 'Product Movement Heatmap (Location × Hour)', 
        font: {
                family: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                size: 16,
            }
        }
    },
    scales: {
      x: {
        type: 'category',
        labels: hourLabels,
        title: { 
            display: true, 
            text: 'Hour of Day', 
            font: {
                family: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                size: 16,
            }
        },
        offset: true,
        grid: { display: false },
        ticks: {
          font: {
            family: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          },
        },
      },
      y: {
        type: 'category',
        labels: locations,
        title: { 
            display: true, 
            text: 'Location', 
            font: {
                family: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                size: 16,
            }
        },
        offset: true,
        grid: { display: false },
        ticks: {
          font: {
            family: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          },
        },
      },
    },
    font: {
      family: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }
  };

  return <Chart type="matrix" data={chartData} options={options} />;
}
