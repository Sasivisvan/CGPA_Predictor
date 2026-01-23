import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

function ConfirmModal({ open, onOpenChange, onConfirm, title, message }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <>
            <Dialog.Portal>
              <Dialog.Overlay asChild>
                <motion.div
                  className="modal-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div
                  className="modal-content"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                >
                  <Dialog.Title className="modal-title">{title}</Dialog.Title>
                  <Dialog.Description className="modal-description">
                    {message}
                  </Dialog.Description>
                  <div className="modal-actions">
                    <button
                      className="modal-btn modal-btn-secondary"
                      onClick={() => onOpenChange(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="modal-btn modal-btn-primary"
                      onClick={() => {
                        onConfirm();
                        onOpenChange(false);
                      }}
                    >
                      Confirm
                    </button>
                  </div>
                  <Dialog.Close asChild>
                    <button className="modal-close" aria-label="Close">
                      <FiX />
                    </button>
                  </Dialog.Close>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          </>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

export default ConfirmModal;
