import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GameStats } from "@/lib/gameData";

export interface DecisionEntry {
  turn: number;
  eventTitle: string;
  choiceText: string;
  flavor: string;
  effects: Partial<GameStats>;
}

const EFFECT_LABELS: Record<string, { icon: string; label: string }> = {
  economy: { icon: "📊", label: "Economia" },
  military: { icon: "⚔️", label: "Militar" },
  happiness: { icon: "😐", label: "Felicidade" },
  corruption: { icon: "🐀", label: "Corrupção" },
  reputation: { icon: "🌐", label: "Reputação" },
  ego: { icon: "👑", label: "Ego" },
  treasury: { icon: "💰", label: "Tesouro" },
  population: { icon: "👥", label: "População" },
};

export function DecisionLog({ entries }: { entries: DecisionEntry[] }) {
  const [open, setOpen] = useState(false);

  if (entries.length === 0) return null;

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded border border-border bg-card px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        📜 Decisões ({entries.length})
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[80vh] w-full max-w-lg overflow-hidden rounded border border-border bg-card"
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <h2 className="font-display text-lg font-bold text-gold">
                  📜 Histórico de Decisões
                </h2>
                <button
                  onClick={() => setOpen(false)}
                  className="font-mono text-xs text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              <div className="overflow-y-auto max-h-[calc(80vh-56px)] p-4 space-y-3">
                {[...entries].reverse().map((entry, i) => (
                  <div
                    key={i}
                    className="rounded border border-border bg-background p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        Turno {entry.turn}
                      </span>
                      <span className="font-display text-xs font-semibold text-secondary-foreground">
                        {entry.eventTitle}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">
                      → {entry.choiceText}
                    </p>
                    <p className="text-xs italic text-muted-foreground">
                      "{entry.flavor}"
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(entry.effects).map(([key, val]) => {
                        if (!val || key === 'turn') return null;
                        const info = EFFECT_LABELS[key];
                        if (!info) return null;
                        const isPositive = key === 'corruption' ? val < 0 : val > 0;
                        return (
                          <span
                            key={key}
                            className={`font-mono text-[10px] ${isPositive ? 'text-green-400' : 'text-red-400'}`}
                          >
                            {info.icon} {val > 0 ? '+' : ''}{key === 'population' ? `${(val / 1_000_000).toFixed(1)}M` : key === 'treasury' ? `$${val}B` : val}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
