import {
  Chart as ChartJS,
  registerables,
} from 'chart.js';

// Register all standard Chart.js controllers, elements, scales, and plugins
// (including LineController, BarController, DoughnutController, RadarController, etc.)
ChartJS.register(...registerables);

// Warm Natural Elegance Chart.js Defaults
ChartJS.defaults.font.family = "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif";
ChartJS.defaults.color = '#748077';
ChartJS.defaults.borderColor = '#E4E4D9';
ChartJS.defaults.plugins.tooltip.backgroundColor = '#244C3A';
ChartJS.defaults.plugins.tooltip.titleColor = '#FFFEFA';
ChartJS.defaults.plugins.tooltip.bodyColor = '#DCE8D8';
ChartJS.defaults.plugins.tooltip.borderColor = '#72966F';
ChartJS.defaults.plugins.tooltip.borderWidth = 1;
ChartJS.defaults.plugins.tooltip.cornerRadius = 8;
ChartJS.defaults.plugins.tooltip.padding = 10;

export default ChartJS;
