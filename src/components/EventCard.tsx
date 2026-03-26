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

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    x: -60,
    transition: { duration: 0.35, ease: "easeIn" },
  },
};

const headerVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

const choiceVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export function EventCard({ event, onChoice }: EventCardProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative overflow-hidden rounded border border-border bg-card p-6 glow-blood scanlines"
    >
      {/* Animated accent line */}
      <motion.div
        className="absolute left-0 top-0 h-full w-1 bg-blood"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        style={{ transformOrigin: "top" }}
      />

      <div className="relative z-10">
        <motion.div variants={headerVariants} className="mb-3 flex items-center gap-2">
          <motion.span
            className="text-lg"
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {CATEGORY_ICONS[event.category] || '📋'}
          </motion.span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {event.category}
          </span>
        </motion.div>

        <motion.h3
          variants={headerVariants}
          className="mb-2 font-display text-xl font-bold text-foreground"
        >
          {event.title}
        </motion.h3>

        <motion.p
          variants={headerVariants}
          className="mb-6 text-sm leading-relaxed text-secondary-foreground"
        >
          {event.description}
        </motion.p>

        <div className="space-y-2">
          {event.choices.map((choice, i) => (
            <motion.button
              key={i}
              variants={choiceVariants}
              whileHover={{ x: 6, backgroundColor: "rgba(255,255,255,0.05)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onChoice(choice)}
              className="group w-full rounded border border-border bg-secondary/50 px-4 py-3 text-left transition-colors hover:border-gold-dim hover:bg-secondary"
            >
              <span className="flex items-start gap-3">
                <motion.span
                  className="mt-0.5 font-mono text-xs text-gold"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                >
                  {String.fromCharCode(65 + i)}.
                </motion.span>
                <span className="text-sm text-foreground group-hover:text-gold transition-colors duration-200">
                  {choice.text}
                </span>
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
