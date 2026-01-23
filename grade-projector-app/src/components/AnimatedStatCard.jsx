import React from 'react';
import { motion, useSpring, useTransform, useInView } from 'framer-motion';

function AnimatedStatCard({ label, value, isAccent = false }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  
  const spring = useSpring(0, { stiffness: 50, damping: 30 });
  const display = useTransform(spring, (current) => {
    if (typeof value === 'number') {
      return current.toFixed(2);
    }
    if (value === '--' || !value) {
      return value || '--';
    }
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      return numValue.toFixed(2);
    }
    return value;
  });

  React.useEffect(() => {
    if (isInView) {
      if (typeof value === 'number') {
        spring.set(value);
      } else if (value !== '--' && value) {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          spring.set(numValue);
        }
      }
    }
  }, [isInView, value, spring]);

  return (
    <motion.div
      ref={ref}
      className={`stat-card ${isAccent ? 'accent' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05, y: -4 }}
    >
      <div className="label">{label}</div>
      <motion.div 
        className="value"
        style={{ 
          background: isAccent ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)' : 'none',
          WebkitBackgroundClip: isAccent ? 'text' : 'none',
          WebkitTextFillColor: isAccent ? 'transparent' : 'inherit',
          backgroundClip: isAccent ? 'text' : 'none'
        }}
      >
        {typeof value === 'number' ? display : value}
      </motion.div>
    </motion.div>
  );
}

export default AnimatedStatCard;
