import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiRefreshCw, FiFileText } from 'react-icons/fi';
import ConfirmModal from './ConfirmModal';

function Header({ onReset, onLoadExample }) {
    const [showModal, setShowModal] = useState(false);

    const handleReset = () => {
        onReset();
    };

    return (
        <>
            <motion.header
                className="header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1>
                    <FiAward style={{ display: 'inline', marginRight: '12px' }} />
                    Grade Projector
                </h1>
                <p className="subtitle">Plan your academic success with style!</p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {onLoadExample && (
                        <motion.button
                            className="example-btn"
                            onClick={onLoadExample}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FiFileText style={{ marginRight: '6px' }} />
                            Load Example
                        </motion.button>
                    )}
                    <motion.button
                        className="reset-btn"
                        onClick={() => setShowModal(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FiRefreshCw style={{ marginRight: '6px' }} />
                        Reset Data
                    </motion.button>
                </div>
            </motion.header>

            <ConfirmModal
                open={showModal}
                onOpenChange={setShowModal}
                onConfirm={handleReset}
                title="Reset All Data"
                message="Are you sure you want to clear all data and start over? This action cannot be undone."
            />
        </>
    );
}

export default Header;
