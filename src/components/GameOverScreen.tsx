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
      className="flex min-h-screen flex-col items-center justify-center p-8"
    >
      <div className={`max-w-lg rounded border p-8 text-center ${won ? 'border-gold glow-gold' : 'border-blood glow-blood'}`}>
        <h1 className={`mb-4 font-display text-4xl font-black ${won ? 'text-gold' : 'text-blood'}`}>
          {won ? 'VITÓRIA' : 'FIM DO REGIME'}
        </h1>
        <p className="mb-6 text-lg text-secondary-foreground">{reason}</p>
        <div className="mb-6 grid grid-cols-2 gap-2 font-mono text-xs text-muted-foreground">
          <span>Turnos: {stats.turn}</span>
          <span>Tesouro: ${stats.treasury}B</span>
          <span>População: {(stats.population / 1_000_000).toFixed(1)}M</span>
          <span>Ego Final: {stats.ego}%</span>
        </div>
        <button
          onClick={onRestart}
          className={`rounded border px-6 py-3 font-mono text-sm transition-colors ${
            won
              ? 'border-gold text-gold hover:bg-gold/10'
              : 'border-blood text-blood hover:bg-blood/10'
          }`}
        >
          TENTAR NOVAMENTE
        </button>
      </div>
    </motion.div>
  );
}
