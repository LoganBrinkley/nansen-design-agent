import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black cursor-pointer"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none"
          >
            <div 
              className="bg-[#121C26] p-6 rounded-lg shadow-xl max-w-md w-full mx-4 pointer-events-auto"
              onClick={e => e.stopPropagation()}
            >
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 