import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GameStats } from "@/lib/gameData";
import { getNationTier } from "@/lib/gameData";

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  condition: (stats: GameStats, turn: number) => boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const RARITY_COLORS: Record<string, string> = {
  common: 'border-muted-foreground/50 text-muted-foreground',
  rare: 'border-blue-500 text-blue-400',
  epic: 'border-purple-500 text-purple-400',
  legendary: 'border-gold text-gold glow-gold',
};

const RARITY_LABELS: Record<string, string> = {
  common: 'Comum',
  rare: 'Raro',
  epic: 'Épico',
  legendary: 'Lendário',
};

export const ACHIEVEMENTS: Achievement[] = [
  // Progression
  { id: 'first_steps', icon: '👶', title: 'Primeiros Passos', description: 'Sobreviva 5 turnos', condition: (_, t) => t >= 5, rarity: 'common' },
  { id: 'survivor', icon: '🏚️', title: 'Sobrevivente', description: 'Sobreviva 15 turnos', condition: (_, t) => t >= 15, rarity: 'rare' },
  { id: 'veteran', icon: '🎖️', title: 'Veterano', description: 'Sobreviva 30 turnos', condition: (_, t) => t >= 30, rarity: 'epic' },
  { id: 'immortal', icon: '♾️', title: 'Imortal', description: 'Sobreviva 50 turnos', condition: (_, t) => t >= 50, rarity: 'legendary' },

  // Economy
  { id: 'capitalist', icon: '💵', title: 'Capitalista', description: 'Economia acima de 80', condition: (s) => s.economy >= 80, rarity: 'rare' },
  { id: 'billionaire', icon: '🏦', title: 'Bilionário', description: 'Tesouro acima de $200B', condition: (s) => s.treasury >= 200, rarity: 'epic' },
  { id: 'bankrupt_recovery', icon: '📈', title: 'Fênix Econômica', description: 'Economia abaixo de 10 e depois acima de 60', condition: (s) => s.economy >= 60, rarity: 'rare' },

  // Military
  { id: 'warlord', icon: '⚔️', title: 'Senhor da Guerra', description: 'Militar acima de 80', condition: (s) => s.military >= 80, rarity: 'rare' },
  { id: 'pacifist', icon: '🕊️', title: 'Pacifista Forçado', description: 'Militar abaixo de 10', condition: (s) => s.military <= 10, rarity: 'common' },

  // Corruption
  { id: 'clean_hands', icon: '🧤', title: 'Mãos Limpas', description: 'Corrupção abaixo de 15', condition: (s) => s.corruption <= 15, rarity: 'rare' },
  { id: 'mafia_state', icon: '🐀', title: 'Estado Mafioso', description: 'Corrupção acima de 90', condition: (s) => s.corruption >= 90, rarity: 'epic' },

  // Ego
  { id: 'narcissist', icon: '🪞', title: 'Narcisista', description: 'Ego acima de 80', condition: (s) => s.ego >= 80, rarity: 'rare' },
  { id: 'humble', icon: '🙏', title: 'Humilde (Impossível)', description: 'Ego abaixo de 15', condition: (s) => s.ego <= 15, rarity: 'epic' },
  { id: 'god_complex', icon: '⚡', title: 'Complexo de Deus', description: 'Ego a 100', condition: (s) => s.ego >= 100, rarity: 'legendary' },

  // Happiness
  { id: 'beloved', icon: '❤️', title: 'Amado pelo Povo', description: 'Felicidade acima de 85', condition: (s) => s.happiness >= 85, rarity: 'rare' },
  { id: 'tyrant', icon: '😈', title: 'Tirano', description: 'Felicidade abaixo de 10 e Militar acima de 70', condition: (s) => s.happiness <= 10 && s.military >= 70, rarity: 'epic' },

  // Population
  { id: 'megalopolis', icon: '🏙️', title: 'Megalópole', description: 'População acima de 80M', condition: (s) => s.population >= 80_000_000, rarity: 'rare' },

  // Reputation
  { id: 'world_leader', icon: '🌍', title: 'Líder Mundial', description: 'Reputação acima de 85', condition: (s) => s.reputation >= 85, rarity: 'epic' },
  { id: 'pariah', icon: '🚫', title: 'Pária Global', description: 'Reputação abaixo de 10', condition: (s) => s.reputation <= 10, rarity: 'common' },

  // Tier
  { id: 'emerging', icon: '🌱', title: 'Nação Emergente', description: 'Alcance o tier Emergente', condition: (s) => getNationTier(s) === 'emergente' || getNationTier(s) === 'desenvolvida' || getNationTier(s) === 'potencia' || getNationTier(s) === 'superpotencia', rarity: 'common' },
  { id: 'superpower', icon: '🏆', title: 'Superpotência', description: 'Alcance o tier Superpotência', condition: (s) => getNationTier(s) === 'superpotencia', rarity: 'legendary' },

  // Combos
  { id: 'balanced', icon: '⚖️', title: 'Equilibrista', description: 'Todos os stats entre 40 e 60', condition: (s) => [s.economy, s.military, s.happiness, s.corruption, s.reputation, s.ego].every(v => v >= 40 && v <= 60), rarity: 'legendary' },
];

function getUnlockedIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem('olider_achievements') || '[]');
  } catch { return []; }
}

function saveUnlockedIds(ids: string[]) {
  localStorage.setItem('olider_achievements', JSON.stringify(ids));
}

export function useAchievements(stats: GameStats, turn: number) {
  const [unlocked, setUnlocked] = useState<string[]>(getUnlockedIds);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement | null>(null);
  const prevTurnRef = useRef(turn);

  useEffect(() => {
    if (turn === prevTurnRef.current) return;
    prevTurnRef.current = turn;

    const currentIds = getUnlockedIds();
    for (const ach of ACHIEVEMENTS) {
      if (currentIds.includes(ach.id)) continue;
      if (ach.condition(stats, turn)) {
        const updated = [...currentIds, ach.id];
        saveUnlockedIds(updated);
        setUnlocked(updated);
        setNewlyUnlocked(ach);
        break; // show one at a time
      }
    }
  }, [stats, turn]);

  const dismissNew = () => setNewlyUnlocked(null);

  return { unlocked, newlyUnlocked, dismissNew };
}

export function AchievementToast({ achievement, onDismiss }: { achievement: Achievement; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className={`fixed top-4 left-1/2 z-[100] -translate-x-1/2 rounded border px-5 py-3 bg-card shadow-lg cursor-pointer ${RARITY_COLORS[achievement.rarity]}`}
      onClick={onDismiss}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{achievement.icon}</span>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest opacity-70">
            Conquista Desbloqueada • {RARITY_LABELS[achievement.rarity]}
          </p>
          <p className="font-display text-sm font-bold">{achievement.title}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function AchievementPanel() {
  const [open, setOpen] = useState(false);
  const unlocked = getUnlockedIds();

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded border border-border bg-card px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        🏆 {unlocked.length}/{ACHIEVEMENTS.length}
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
                  🏆 Conquistas ({unlocked.length}/{ACHIEVEMENTS.length})
                </h2>
                <button
                  onClick={() => setOpen(false)}
                  className="font-mono text-xs text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              <div className="overflow-y-auto max-h-[calc(80vh-56px)] p-4 grid grid-cols-1 gap-2">
                {ACHIEVEMENTS.map((ach) => {
                  const isUnlocked = unlocked.includes(ach.id);
                  return (
                    <div
                      key={ach.id}
                      className={`flex items-center gap-3 rounded border p-3 transition-colors ${
                        isUnlocked
                          ? RARITY_COLORS[ach.rarity] + ' bg-background'
                          : 'border-border bg-background/50 opacity-40'
                      }`}
                    >
                      <span className="text-xl">{isUnlocked ? ach.icon : '🔒'}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-display text-sm font-bold truncate">
                            {isUnlocked ? ach.title : '???'}
                          </span>
                          <span className={`font-mono text-[9px] uppercase tracking-widest ${isUnlocked ? '' : 'text-muted-foreground'}`}>
                            {RARITY_LABELS[ach.rarity]}
                          </span>
                        </div>
                        <p className="font-mono text-[10px] text-muted-foreground truncate">
                          {ach.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
