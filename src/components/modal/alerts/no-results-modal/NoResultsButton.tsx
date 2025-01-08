import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface NoResultsButtonProps {
  onClose: () => void;
}

export function NoResultsButton({ onClose }: NoResultsButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="flex justify-center"
    >
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={onClose}
          onKeyDown={(e) => e.preventDefault()}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-2 rounded-lg shadow-lg shadow-blue-500/20 border-2 border-blue-400/50 transition-all duration-300 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
          autoFocus={false}
          tabIndex={-1}
        >
          Cerrar
        </Button>
      </motion.div>
    </motion.div>
  );
}
