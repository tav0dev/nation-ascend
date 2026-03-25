import { motion } from "framer-motion";

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

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between font-mono text-xs">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <span>{icon}</span>
          <span className="uppercase tracking-widest">{label}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="text-foreground">{Math.round(value)}</span>
          {showChange !== undefined && showChange !== 0 && (
            <motion.span
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className={showChange > 0 ? 'text-green-400' : 'text-blood'}
            >
              {showChange > 0 ? '+' : ''}{showChange}
            </motion.span>
          )}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-sm bg-secondary">
        <motion.div
          className={`h-full rounded-sm ${colorClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
