import { motion } from "framer-motion";
import { type GameEvent, type Choice } from "@/lib/gameData";

interface EventCardProps {
  event: GameEvent;
  onChoice: (choice: Choice) => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  economy: '💰',
  military: '⚔️',
  social: '👥',
  political: '🏛️',
  international: '🌍',
};

export function EventCard({ event, onChoice }: EventCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded border border-border bg-card p-6 glow-blood scanlines"
    >
      <div className="relative z-10">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-lg">{CATEGORY_ICONS[event.category] || '📋'}</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {event.category}
          </span>
        </div>
        <h3 className="mb-2 font-display text-xl font-bold text-foreground">{event.title}</h3>
        <p className="mb-6 text-sm leading-relaxed text-secondary-foreground">{event.description}</p>

        <div className="space-y-2">
          {event.choices.map((choice, i) => (
            <motion.button
              key={i}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChoice(choice)}
              className="group w-full rounded border border-border bg-secondary/50 px-4 py-3 text-left transition-colors hover:border-gold-dim hover:bg-secondary"
            >
              <span className="flex items-start gap-3">
                <span className="mt-0.5 font-mono text-xs text-gold">{String.fromCharCode(65 + i)}.</span>
                <span className="text-sm text-foreground group-hover:text-gold">{choice.text}</span>
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
