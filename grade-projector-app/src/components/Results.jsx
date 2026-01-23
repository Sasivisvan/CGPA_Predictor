import React from 'react';

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

    return (
        <div className="results-section">
            {/* Stats Header */}
            <div className="results-header">
                <div className="stat-card">
                    <div className="label">Current CGPA</div>
                    <div className="value">{currentCGPA.toFixed(2)}</div>
                </div>
                <div className="stat-card">
                    <div className="label">Past Credits</div>
                    <div className="value">{pastCredits}</div>
                </div>
                <div className="stat-card accent">
                    <div className="label">Goal</div>
                    <div className="value">{targetCGPA || '--'}</div>
                </div>
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
                            <div className="required-label" style={{ color: 'var(--danger)', fontWeight: 700, fontSize: '1.1rem' }}>
                                🚫 Goal Unreachable
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
            <div className="results-table-container">
                <div className="table-title">📈 Performance Scenarios</div>
                <table className="results-table">
                    <thead>
                        <tr>
                            <th>Performance (SGPA)</th>
                            <th>New CGPA</th>
                            <th>Change</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scenarios.map((scenario, index) => {
                            const changeClass = scenario.change > 0.01 ? 'positive' :
                                scenario.change < -0.01 ? 'negative' : 'neutral';
                            const isHighlighted = targetCGPA && scenario.newCGPA >= targetCGPA - 0.001;

                            return (
                                <tr key={index} className={isHighlighted ? 'highlighted' : ''}>
                                    <td className="performance">{scenario.sgpa.toFixed(1)}</td>
                                    <td>{scenario.newCGPA.toFixed(2)}</td>
                                    <td className={changeClass}>
                                        {scenario.change > 0 ? '+' : ''}{scenario.change.toFixed(2)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Results;
