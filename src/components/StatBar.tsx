import { motion, AnimatePresence } from "framer-motion";

interface StatBarProps {
  label: string;
  value: number;
  max?: number;
  colorClass: string;
  icon: string;
  showChange?: number;
}

export function StatBar({ label, value, max = 100, colorClass, icon, showChange }: StatBarProps) {
  const pct = Math.min(100, (value / max) * 100);
  const isDanger = pct <= 15;
  const isHigh = pct >= 85;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between font-mono text-xs">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <motion.span
            animate={isDanger ? { scale: [1, 1.2, 1] } : isHigh ? { rotate: [0, 5, -5, 0] } : {}}
            transition={{ duration: 1, repeat: isDanger || isHigh ? Infinity : 0, repeatDelay: 1 }}
          >
            {icon}
          </motion.span>
          <span className="uppercase tracking-widest">{label}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <motion.span
            key={value}
            initial={{ scale: 1.3, color: "hsl(var(--gold))" }}
            animate={{ scale: 1, color: "hsl(var(--foreground))" }}
            transition={{ duration: 0.4 }}
            className="text-foreground"
          >
            {Math.round(value)}
          </motion.span>
          <AnimatePresence mode="wait">
            {showChange !== undefined && showChange !== 0 && (
              <motion.span
                key={`change-${showChange}`}
                initial={{ opacity: 0, y: -8, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.3, ease: "backOut" }}
                className={showChange > 0 ? 'text-green-400' : 'text-blood'}
              >
                {showChange > 0 ? '+' : ''}{showChange}
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-sm bg-secondary relative">
        <motion.div
          className={`h-full rounded-sm ${colorClass}`}
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        />
        {isDanger && (
          <motion.div
            className="absolute inset-0 rounded-sm bg-blood/20"
            animate={{ opacity: [0, 0.4, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        )}
      </div>
    </div>
  );
}
