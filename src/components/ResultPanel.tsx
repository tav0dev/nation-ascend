import { motion } from "framer-motion";
import { type Choice } from "@/lib/gameData";

interface ResultPanelProps {
  choice: Choice;
  onContinue: () => void;
}

const containerVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.06,
      delayChildren: 0.15,
    },
  },
  exit: {
    opacity: 0,
    y: -30,
    scale: 0.95,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export function ResultPanel({ choice, onContinue }: ResultPanelProps) {
  const effects = Object.entries(choice.effects).filter(([, v]) => v !== 0);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="rounded border border-gold-dim bg-card p-6 glow-gold relative overflow-hidden"
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent"
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 2, delay: 0.5, ease: "linear" }}
      />

      <div className="relative z-10">
        <motion.p
          variants={itemVariants}
          className="mb-4 font-display text-lg italic text-foreground"
        >
          "{choice.flavor}"
        </motion.p>

        <motion.div variants={itemVariants} className="mb-6 flex flex-wrap gap-2">
          {effects.map(([key, val], i) => (
            <motion.span
              key={key}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.08, ease: "backOut" }}
              className={`rounded px-2 py-1 font-mono text-xs ${
                (val as number) > 0
                  ? 'bg-green-900/30 text-green-400'
                  : 'bg-red-900/30 text-blood'
              }`}
            >
              {key}: {(val as number) > 0 ? '+' : ''}{val as number}
            </motion.span>
          ))}
        </motion.div>

        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onContinue}
          className="w-full rounded border border-gold bg-gold/10 px-4 py-2.5 font-mono text-sm text-gold transition-colors hover:bg-gold/20"
        >
          PRÓXIMO TURNO →
        </motion.button>
      </div>
    </motion.div>
  );
}
