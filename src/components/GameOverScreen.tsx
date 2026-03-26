import { motion } from "framer-motion";
import type { GameStats } from "@/lib/gameData";

interface GameOverScreenProps {
  reason: string;
  won: boolean;
  stats: GameStats;
  onRestart: () => void;
}

export function GameOverScreen({ reason, won, stats, onRestart }: GameOverScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex min-h-screen flex-col items-center justify-center p-8"
    >
      {/* Background pulse */}
      <motion.div
        className={`fixed inset-0 ${won ? 'bg-gold/5' : 'bg-blood/5'}`}
        animate={{ opacity: [0, 0.3, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <motion.div
        initial={{ scale: 0.8, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: 0.2 }}
        className={`relative max-w-lg rounded border p-8 text-center ${won ? 'border-gold glow-gold' : 'border-blood glow-blood'}`}
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className={`mb-4 font-display text-4xl font-black ${won ? 'text-gold' : 'text-blood'}`}
        >
          {won ? 'VITÓRIA' : 'FIM DO REGIME'}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mb-6 text-lg text-secondary-foreground"
        >
          {reason}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.4 }}
          className="mb-6 grid grid-cols-2 gap-2 font-mono text-xs text-muted-foreground"
        >
          {[
            { label: 'Turnos', value: stats.turn },
            { label: 'Tesouro', value: `$${stats.treasury}B` },
            { label: 'População', value: `${(stats.population / 1_000_000).toFixed(1)}M` },
            { label: 'Ego Final', value: `${stats.ego}%` },
          ].map((item, i) => (
            <motion.span
              key={item.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 + i * 0.1, duration: 0.3 }}
            >
              {item.label}: {item.value}
            </motion.span>
          ))}
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRestart}
          className={`rounded border px-6 py-3 font-mono text-sm transition-colors ${
            won
              ? 'border-gold text-gold hover:bg-gold/10'
              : 'border-blood text-blood hover:bg-blood/10'
          }`}
        >
          TENTAR NOVAMENTE
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
