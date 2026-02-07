import React from 'react';
import { motion } from 'framer-motion';
import { FiTarget, FiCalendar, FiTrendingUp, FiAward } from 'react-icons/fi';

function StrategyCard({ strategy, setStrategy, futureCredits, setFutureCredits, targetCGPA, setTargetCGPA }) {

    const isNextSem = strategy === 'next';

    return (
        <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
        >
            <span className="step-badge">Step 2</span>
            <h2 className="card-title">
                <FiTarget style={{ marginRight: '8px' }} />
                Your Strategy
            </h2>

            {/* Strategy Selection */}
            <div className="strategy-grid">
                <motion.div
                    className={`radio-card ${strategy === 'next' ? 'active' : ''}`}
                    onClick={() => setStrategy('next')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <input
                        type="radio"
                        name="strategy"
                        value="next"
                        checked={strategy === 'next'}
                        onChange={() => setStrategy('next')}
                    />
                    <FiCalendar style={{ marginRight: '6px' }} />
                    Next Sem Only
                </motion.div>
                <motion.div
                    className={`radio-card ${strategy === 'degree' ? 'active' : ''}`}
                    onClick={() => setStrategy('degree')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <input
                        type="radio"
                        name="strategy"
                        value="degree"
                        checked={strategy === 'degree'}
                        onChange={() => setStrategy('degree')}
                    />
                    <FiTrendingUp style={{ marginRight: '6px' }} />
                    Rest of Degree
                </motion.div>
            </div>

            {/* Future Credits Input */}
            <div className="input-group">
                <label>
                    {isNextSem ? (
                        <>
                            <FiCalendar style={{ marginRight: '4px' }} />
                            Next Semester Credits
                        </>
                    ) : (
                        <>
                            <FiTrendingUp style={{ marginRight: '4px' }} />
                            Total Course Credits
                        </>
                    )}
                </label>
                <input
                    type="number"
                    placeholder={isNextSem ? 'e.g. 24' : 'e.g. 160'}
                    step="any"
                    min="0"
                    value={futureCredits}
                    onChange={(e) => setFutureCredits(e.target.value)}
                />
            </div>

            {/* Target CGPA Input */}
            <div className="input-group">
                <label>
                    <FiAward style={{ marginRight: '4px' }} />
                    Target CGPA Goal
                </label>
                <input
                    type="number"
                    placeholder="e.g. 9.0"
                    step="0.01"
                    min="0"
                    max="10"
                    value={targetCGPA}
                    onChange={(e) => setTargetCGPA(e.target.value)}
                    style={{ borderColor: 'var(--accent-primary)' }}
                />
            </div>
        </motion.div>
    );
}

export default StrategyCard;
