import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

export function NoResultsIcon() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="relative w-24 h-24 mx-auto"
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl"
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full border-4 border-dashed border-blue-300 opacity-30"
      />
      <Search className="w-full h-full text-blue-500 relative z-10" />
    </motion.div>
  );
}
