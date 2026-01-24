import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBook, FiPlus, FiX } from 'react-icons/fi';

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
        <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <span className="step-badge">Step 1</span>
            <h2 className="card-title">
                <FiBook style={{ marginRight: '8px' }} />
                Your Academic History
            </h2>

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
            <AnimatePresence mode="wait">
                {mode === 'detailed' && (
                    <motion.div
                        className="detailed-mode"
                        key="detailed"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <AnimatePresence>
                            {semesters.map((sem, index) => (
                                <motion.div
                                    key={index}
                                    className="semester-row"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div>
                                        <input
                                            type="number"
                                            placeholder={`SGPA ${index + 1}`}
                                            step="0.01"
                                            min="0"
                                            max="10"
                                            value={sem.sgpa}
                                            onChange={(e) => updateSemester(index, 'sgpa', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            placeholder="Credits"
                                            step="0.5"
                                            min="0"
                                            value={sem.credits}
                                            onChange={(e) => updateSemester(index, 'credits', e.target.value)}
                                        />
                                    </div>
                                    <motion.button
                                        className="btn-remove"
                                        onClick={() => removeSemester(index)}
                                        aria-label="Remove semester"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <FiX />
                                    </motion.button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <motion.button
                            className="btn-add"
                            onClick={addSemester}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <FiPlus style={{ marginRight: '6px' }} />
                            Add Semester
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Quick Mode */}
            <AnimatePresence mode="wait">
                {mode === 'quick' && (
                    <motion.div
                        className="quick-mode"
                        key="quick"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
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
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default HistoryCard;
