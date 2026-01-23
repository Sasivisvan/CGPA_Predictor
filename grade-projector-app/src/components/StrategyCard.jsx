import React from 'react';

function StrategyCard({ strategy, setStrategy, futureCredits, setFutureCredits, targetCGPA, setTargetCGPA }) {

    const isNextSem = strategy === 'next';

    return (
        <div className="card">
            <span className="step-badge">Step 2</span>
            <h2 className="card-title">🎯 Your Strategy</h2>

            {/* Strategy Selection */}
            <div className="strategy-grid">
                <div
                    className={`radio-card ${strategy === 'next' ? 'active' : ''}`}
                    onClick={() => setStrategy('next')}
                >
                    <input
                        type="radio"
                        name="strategy"
                        value="next"
                        checked={strategy === 'next'}
                        onChange={() => setStrategy('next')}
                    />
                    Next Sem Only
                </div>
                <div
                    className={`radio-card ${strategy === 'degree' ? 'active' : ''}`}
                    onClick={() => setStrategy('degree')}
                >
                    <input
                        type="radio"
                        name="strategy"
                        value="degree"
                        checked={strategy === 'degree'}
                        onChange={() => setStrategy('degree')}
                    />
                    Rest of Degree
                </div>
            </div>

            {/* Future Credits Input */}
            <div className="input-group">
                <label>
                    {isNextSem ? '📅 Next Semester Credits' : '📊 Total Course Credits'}
                </label>
                <input
                    type="number"
                    placeholder={isNextSem ? 'e.g. 24' : 'e.g. 160'}
                    step="0.5"
                    min="0"
                    value={futureCredits}
                    onChange={(e) => setFutureCredits(e.target.value)}
                />
            </div>

            {/* Target CGPA Input */}
            <div className="input-group">
                <label>🌟 Target CGPA Goal</label>
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
        </div>
    );
}

export default StrategyCard;
