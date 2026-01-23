import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiLoader, FiCheck } from 'react-icons/fi';

function AnimatedButton({ children, onClick, isLoading = false, isSuccess = false, ...props }) {
  const [ripple, setRipple] = useState(null);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipple({ x, y });
    setTimeout(() => setRipple(null), 600);
    
    if (onClick) onClick(e);
  };

  return (
    <motion.button
      className="btn-calculate"
      onClick={handleClick}
      disabled={isLoading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {ripple && (
        <motion.span
          className="ripple-effect"
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
        />
      )}
      <span className="button-content">
        {isLoading ? (
          <>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <FiLoader />
            </motion.span>
            Calculating...
          </>
        ) : isSuccess ? (
          <>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500 }}
            >
              <FiCheck />
            </motion.span>
            {children}
          </>
        ) : (
          children
        )}
      </span>
    </motion.button>
  );
}

export default AnimatedButton;
