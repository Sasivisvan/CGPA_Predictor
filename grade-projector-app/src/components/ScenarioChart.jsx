import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { motion } from 'framer-motion';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="chart-tooltip">
        <p className="tooltip-label">SGPA: {data.sgpa}</p>
        <p className="tooltip-value">New CGPA: {data.cgpa.toFixed(2)}</p>
        <p className={`tooltip-change ${data.change > 0 ? 'positive' : data.change < 0 ? 'negative' : 'neutral'}`}>
          Change: {data.change > 0 ? '+' : ''}{data.change.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

function ScenarioChart({ scenarios, targetCGPA, currentCGPA }) {
  // Transform scenarios data for chart
  const chartData = scenarios.map(scenario => ({
    sgpa: scenario.sgpa,
    cgpa: scenario.newCGPA,
    change: scenario.change
  })).reverse(); // Reverse to show from low to high

  return (
    <motion.div
      className="scenario-chart-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="chart-title">📈 CGPA Projection Chart</div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
          <XAxis
            dataKey="sgpa"
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
            label={{ value: 'SGPA', position: 'insideBottom', offset: -5, fill: '#94a3b8' }}
          />
          <YAxis
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
            label={{ value: 'CGPA', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
            domain={['dataMin - 0.5', 'dataMax + 0.5']}
          />
          <Tooltip content={<CustomTooltip />} />
          {targetCGPA && (
            <ReferenceLine
              y={targetCGPA}
              stroke="#f59e0b"
              strokeDasharray="5 5"
              label={{ value: 'Target', position: 'right', fill: '#f59e0b' }}
            />
          )}
          <ReferenceLine
            y={currentCGPA}
            stroke="#6366f1"
            strokeDasharray="3 3"
            label={{ value: 'Current', position: 'right', fill: '#6366f1' }}
          />
          <Line
            type="monotone"
            dataKey="cgpa"
            stroke="url(#colorGradient)"
            strokeWidth={3}
            dot={{ fill: '#6366f1', r: 4 }}
            activeDot={{ r: 6, fill: '#8b5cf6' }}
          />
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export default ScenarioChart;
