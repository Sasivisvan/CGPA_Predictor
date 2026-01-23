import React from 'react';

function HistoryCard({
    mode,
    setMode,
    semesters,
    setSemesters,
    quickData,
    setQuickData
}) {

    const addSemester = () => {
        setSemesters([...semesters, { sgpa: '', credits: '' }]);
    };

    const removeSemester = (index) => {
        const updated = semesters.filter((_, i) => i !== index);
        setSemesters(updated.length > 0 ? updated : [{ sgpa: '', credits: '' }]);
    };

    const updateSemester = (index, field, value) => {
        const updated = [...semesters];
        updated[index] = { ...updated[index], [field]: value };
        setSemesters(updated);
    };

    return (
        <div className="card">
            <span className="step-badge">Step 1</span>
            <h2 className="card-title">📚 Your Academic History</h2>

            {/* Mode Tabs */}
            <div className="tabs">
                <button
                    className={`tab ${mode === 'detailed' ? 'active' : ''}`}
                    onClick={() => setMode('detailed')}
                >
                    Detailed Input
                </button>
                <button
                    className={`tab ${mode === 'quick' ? 'active' : ''}`}
                    onClick={() => setMode('quick')}
                >
                    Quick Input
                </button>
            </div>

            {/* Detailed Mode */}
            {mode === 'detailed' && (
                <div className="detailed-mode">
                    {semesters.map((sem, index) => (
                        <div key={index} className="semester-row">
                            <input
                                type="number"
                                placeholder={`SGPA Sem ${index + 1}`}
                                step="0.01"
                                min="0"
                                max="10"
                                value={sem.sgpa}
                                onChange={(e) => updateSemester(index, 'sgpa', e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Credits"
                                step="0.5"
                                min="0"
                                value={sem.credits}
                                onChange={(e) => updateSemester(index, 'credits', e.target.value)}
                            />
                            <button
                                className="btn-remove"
                                onClick={() => removeSemester(index)}
                                aria-label="Remove semester"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                    <button className="btn-add" onClick={addSemester}>
                        + Add Semester
                    </button>
                </div>
            )}

            {/* Quick Mode */}
            {mode === 'quick' && (
                <div className="quick-mode">
                    <div className="input-group">
                        <label>Current CGPA</label>
                        <input
                            type="number"
                            placeholder="e.g. 8.4"
                            step="0.01"
                            min="0"
                            max="10"
                            value={quickData.cgpa}
                            onChange={(e) => setQuickData({ ...quickData, cgpa: e.target.value })}
                        />
                    </div>
                    <div className="input-group">
                        <label>Total Past Credits</label>
                        <input
                            type="number"
                            placeholder="e.g. 82"
                            step="0.5"
                            min="0"
                            value={quickData.credits}
                            onChange={(e) => setQuickData({ ...quickData, credits: e.target.value })}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default HistoryCard;
