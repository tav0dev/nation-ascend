import { motion } from "framer-motion";
import { type Choice } from "@/lib/gameData";

interface ResultPanelProps {
  choice: Choice;
  onContinue: () => void;
}

export function ResultPanel({ choice, onContinue }: ResultPanelProps) {
  const effects = Object.entries(choice.effects).filter(([, v]) => v !== 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded border border-gold-dim bg-card p-6 glow-gold"
    >
      <p className="mb-4 font-display text-lg italic text-foreground">"{choice.flavor}"</p>

      <div className="mb-6 flex flex-wrap gap-2">
        {effects.map(([key, val]) => (
          <span
            key={key}
            className={`rounded px-2 py-1 font-mono text-xs ${
              (val as number) > 0
                ? 'bg-green-900/30 text-green-400'
                : 'bg-red-900/30 text-blood'
            }`}
          >
            {key}: {(val as number) > 0 ? '+' : ''}{val as number}
          </span>
        ))}
      </div>

      <button
        onClick={onContinue}
        className="w-full rounded border border-gold bg-gold/10 px-4 py-2.5 font-mono text-sm text-gold transition-colors hover:bg-gold/20"
      >
        PRÓXIMO TURNO →
      </button>
    </motion.div>
  );
}
