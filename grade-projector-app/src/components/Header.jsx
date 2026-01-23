import React from 'react';

function Header({ onReset }) {
    const handleReset = () => {
        if (window.confirm('Clear all data and start over?')) {
            onReset();
        }
    };

    return (
        <header className="header">
            <h1>🎓 Grade Projector</h1>
            <p className="subtitle">Plan your academic success with style!</p>
            <button className="reset-btn" onClick={handleReset}>
                🔄 Reset Data
            </button>
        </header>
    );
}

export default Header;
