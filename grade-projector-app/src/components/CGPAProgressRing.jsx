import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';

function CGPAProgressRing({ current, target, max, difficulty }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  // Increased size slightly to fit content comfortably without clustering
  const size = 160;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate progress (0-10 scale, but show as percentage of max)
  const currentProgress = (current / 10) * 100;
  const targetProgress = target ? (target / 10) * 100 : null;
  const maxProgress = (max / 10) * 100;

  const currentOffset = circumference - (currentProgress / 100) * circumference;
  const targetOffset = targetProgress ? circumference - (targetProgress / 100) * circumference : null;
  const maxOffset = circumference - (maxProgress / 100) * circumference;

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'COMFORTABLE': return '#10b981';
      case 'EASY REACH': return '#3b82f6';
      case 'MODERATE': return '#f59e0b';
      case 'HARD GRIND': return '#ef4444';
      case 'IMPOSSIBLE': return '#ef4444';
      default: return '#6366f1';
    }
  };

  return (
    <motion.div
      ref={ref}
      className="progress-ring-container"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, type: 'spring' }}
    >
      <svg width={size} height={size} className="progress-ring-svg">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(148, 163, 184, 0.1)"
          strokeWidth={strokeWidth}
        />

        {/* Max possible circle (subtle) */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(99, 102, 241, 0.2)"
          strokeWidth={strokeWidth - 4}
          strokeDasharray={circumference}
          strokeDashoffset={maxOffset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={isInView ? { strokeDashoffset: maxOffset } : {}}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />

        {/* Target circle (if exists) */}
        {targetOffset !== null && (
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getDifficultyColor()}
            strokeWidth={strokeWidth - 6}
            strokeLinecap="round"
            strokeDasharray={`${circumference * (targetProgress / 100)} ${circumference}`}
            initial={{ strokeDashoffset: circumference }}
            animate={isInView ? { strokeDashoffset: targetOffset } : {}}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            opacity={0.6}
          />
        )}

        {/* Current CGPA circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={currentOffset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={isInView ? { strokeDashoffset: currentOffset } : {}}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />

        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>

      <div className="progress-ring-content">
        <div className="progress-ring-value">{current.toFixed(2)}</div>
        <div className="progress-ring-label">Current CGPA</div>
        {target && (
          <>
            <div className="progress-ring-target">Target: {target.toFixed(2)}</div>
            <div className="progress-ring-max">Max: {max.toFixed(2)}</div>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default CGPAProgressRing;
