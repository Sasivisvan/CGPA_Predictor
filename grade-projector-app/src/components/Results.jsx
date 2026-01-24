import React from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiCopy, FiAlertOctagon, FiBarChart2 } from 'react-icons/fi';
import AnimatedStatCard from './AnimatedStatCard';
import CGPAProgressRing from './CGPAProgressRing';
import ScenarioChart from './ScenarioChart';

function Results({ results }) {
    if (!results) return null;

    const {
        currentCGPA,
        pastCredits,
        targetCGPA,
        requiredSGPA,
        maxPossibleCGPA,
        isGoalReachable,
        difficulty,
        scenarios
    } = results;

    // Get difficulty badge class
    const getDifficultyClass = () => {
        switch (difficulty) {
            case 'COMFORTABLE': return 'comfortable';
            case 'EASY REACH': return 'easy';
            case 'MODERATE': return 'moderate';
            case 'HARD GRIND': return 'hard';
            case 'IMPOSSIBLE': return 'impossible';
            default: return '';
        }
    };

    // Copy results to clipboard
    const copyResults = () => {
        let text = `CGPA Projection Results\n\n`;
        text += `Current CGPA: ${currentCGPA.toFixed(2)}\n`;
        text += `Past Credits: ${pastCredits}\n`;
        if (targetCGPA) {
            text += `Target CGPA: ${targetCGPA}\n`;
            if (isGoalReachable) {
                text += `Required SGPA: ${requiredSGPA.toFixed(2)}\n`;
                text += `Difficulty: ${difficulty}\n`;
            } else {
                text += `Max Possible: ${maxPossibleCGPA.toFixed(2)}\n`;
            }
        }
        text += `\nScenarios:\n`;
        scenarios.slice(0, 5).forEach(s => {
            text += `SGPA ${s.sgpa.toFixed(1)} → CGPA ${s.newCGPA.toFixed(2)} (${s.change > 0 ? '+' : ''}${s.change.toFixed(2)})\n`;
        });

        navigator.clipboard.writeText(text).then(() => {
            toast.success('Results copied to clipboard!');
        }).catch(() => {
            toast.error('Failed to copy results');
        });
    };

    return (
        <motion.div
            className="results-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            {/* Copy Button */}
            <motion.button
                className="copy-results-btn"
                onClick={copyResults}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                    marginBottom: 'var(--spacing-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: 'var(--spacing-sm) var(--spacing-lg)',
                    background: 'var(--bg-input)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                }}
            >
                <FiCopy />
                Copy Results
            </motion.button>

            {/* Stats Header */}
            <div className="results-header">
                <AnimatedStatCard
                    label="Current CGPA"
                    value={currentCGPA}
                />
                <AnimatedStatCard
                    label="Past Credits"
                    value={pastCredits}
                />
                <AnimatedStatCard
                    label="Goal"
                    value={targetCGPA || '--'}
                    isAccent={!!targetCGPA}
                />
            </div>

            {/* Progress Ring */}
            <div className="progress-ring-wrapper">
                <CGPAProgressRing
                    current={currentCGPA}
                    target={targetCGPA}
                    max={maxPossibleCGPA}
                    difficulty={difficulty}
                />
            </div>

            {/* Feedback Box */}
            {targetCGPA && (
                <div className="feedback-box">
                    {isGoalReachable ? (
                        <>
                            <div className="required-label">Required Performance</div>
                            <div className="required-value">
                                {requiredSGPA.toFixed(2)} <span>SGPA</span>
                            </div>
                            <span className={`difficulty-badge ${getDifficultyClass()}`}>
                                {difficulty}
                            </span>
                        </>
                    ) : (
                        <>
                            <div className="required-label" style={{ color: 'var(--danger)', fontWeight: 700, fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <FiAlertOctagon /> Goal Unreachable
                            </div>
                            <div style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
                                Maximum possible CGPA is <strong>{maxPossibleCGPA.toFixed(2)}</strong>
                            </div>
                            <span className="difficulty-badge impossible">IMPOSSIBLE</span>
                        </>
                    )}
                </div>
            )}



            {/* Scenarios Table */}
            <motion.div
                className="results-table-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <div className="table-title">
                    <FiBarChart2 style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                    Detailed Performance Scenarios
                </div>
                <table className="results-table">
                    <thead>
                        <tr>
                            <th>SGPA</th>
                            <th>New CGPA</th>
                            <th className="change-col">Change</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scenarios.map((scenario, index) => {
                            const changeClass = scenario.change > 0.01 ? 'positive' :
                                scenario.change < -0.01 ? 'negative' : 'neutral';
                            const isHighlighted = targetCGPA && scenario.newCGPA >= targetCGPA - 0.001;

                            return (
                                <motion.tr
                                    key={index}
                                    className={isHighlighted ? 'highlighted' : ''}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.02 }}
                                >
                                    <td className="performance">{scenario.sgpa.toFixed(1)}</td>
                                    <td>{scenario.newCGPA.toFixed(2)}</td>
                                    <td className={`change-col ${changeClass}`}>
                                        {scenario.change > 0 ? '+' : ''}{scenario.change.toFixed(2)}
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </motion.div>
        </motion.div>
    );
}

export default Results;
