import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StatBar } from "@/components/StatBar";
import { EventCard } from "@/components/EventCard";
import { ResultPanel } from "@/components/ResultPanel";
import { GameOverScreen } from "@/components/GameOverScreen";
import { AdvisorPanel } from "@/components/AdvisorPanel";
import {
  type GameStats,
  type Choice,
  INITIAL_STATS,
  getRandomEvent,
  getRandomQuote,
  applyEffects,
  checkGameOver,
  getNationTier,
  TIER_LABELS,
  TIER_COLORS,
} from "@/lib/gameData";

type Phase = 'menu' | 'event' | 'result' | 'gameover';

export default function Index() {
  const [phase, setPhase] = useState<Phase>('menu');
  const [stats, setStats] = useState<GameStats>(INITIAL_STATS);
  const [currentEvent, setCurrentEvent] = useState(getRandomEvent());
  const [lastChoice, setLastChoice] = useState<Choice | null>(null);
  const [lastEffects, setLastEffects] = useState<Partial<GameStats>>({});
  const [gameOverInfo, setGameOverInfo] = useState({ reason: '', won: false });
  const [recentEvents, setRecentEvents] = useState<string[]>([]);
  const [quote] = useState(getRandomQuote());
  const [hasSave, setHasSave] = useState(() => !!localStorage.getItem('olider_save'));

  // Auto-save on every stat/phase change during gameplay
  useEffect(() => {
    if (phase === 'event' || phase === 'result') {
      const save = { stats, recentEvents, currentEvent, phase };
      localStorage.setItem('olider_save', JSON.stringify(save));
      setHasSave(true);
    }
  }, [stats, phase, recentEvents, currentEvent]);

  const startGame = useCallback(() => {
    localStorage.removeItem('olider_save');
    setStats(INITIAL_STATS);
    setRecentEvents([]);
    const evt = getRandomEvent([], INITIAL_STATS);
    setCurrentEvent(evt);
    setPhase('event');
  }, []);

  const loadGame = useCallback(() => {
    const raw = localStorage.getItem('olider_save');
    if (!raw) return;
    try {
      const save = JSON.parse(raw);
      setStats(save.stats);
      setRecentEvents(save.recentEvents || []);
      setCurrentEvent(save.currentEvent);
      setLastChoice(null);
      setLastEffects({});
      setPhase('event');
    } catch { /* corrupted save, ignore */ }
  }, []);

  const handleChoice = useCallback((choice: Choice) => {
    const newStats = applyEffects(stats, choice.effects);
    newStats.turn = stats.turn + 1;
    setStats(newStats);
    setLastChoice(choice);
    setLastEffects(choice.effects);

    const gameOver = checkGameOver(newStats);
    if (gameOver.over) {
      localStorage.removeItem('olider_save');
      setHasSave(false);
      setGameOverInfo({ reason: gameOver.reason!, won: !!gameOver.won });
      setPhase('gameover');
    } else {
      setPhase('result');
    }
  }, [stats]);

  const nextTurn = useCallback(() => {
    const recent = [...recentEvents, currentEvent.id].slice(-5);
    setRecentEvents(recent);
    const evt = getRandomEvent(recent, stats);
    setCurrentEvent(evt);
    setLastChoice(null);
    setLastEffects({});
    setPhase('event');
  }, [currentEvent.id, recentEvents]);

  const tier = getNationTier(stats);

  if (phase === 'gameover') {
    return <GameOverScreen reason={gameOverInfo.reason} won={gameOverInfo.won} stats={stats} onRestart={startGame} />;
  }

  if (phase === 'menu') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md text-center"
        >
          <h1 className="mb-2 font-display text-5xl font-black tracking-tight text-gold">
            O LÍDER
          </h1>
          <p className="mb-1 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Da ruína à supremacia
          </p>
          <div className="my-8 border-t border-b border-border py-4">
            <p className="font-display text-sm italic text-secondary-foreground">
              "{quote}"
            </p>
          </div>
          <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
            Você é o líder de uma nação falida. Egocêntrico, calculista e indiferente ao sofrimento alheio.
            Cada decisão molda o destino do país — e o tamanho do seu ego.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={startGame}
              className="rounded border border-gold bg-gold/10 px-8 py-3 font-mono text-sm uppercase tracking-widest text-gold transition-all hover:bg-gold/20 glow-gold"
            >
              Novo Jogo
            </button>
            {hasSave && (
              <button
                onClick={loadGame}
                className="rounded border border-border bg-card px-8 py-3 font-mono text-sm uppercase tracking-widest text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
              >
                Continuar
              </button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-2 border-b border-border pb-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-gold">O LÍDER</h1>
            <p className={`font-mono text-xs uppercase tracking-widest ${TIER_COLORS[tier]}`}>
              {TIER_LABELS[tier]}
            </p>
          </div>
          <div className="flex gap-4 font-mono text-xs text-muted-foreground">
            <span>Turno {stats.turn}</span>
            <span>💰 ${stats.treasury}B</span>
            <span>👥 {(stats.population / 1_000_000).toFixed(1)}M</span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[280px_1fr]">
          {/* Stats Panel */}
          <div className="space-y-4">
            <div className="space-y-3 rounded border border-border bg-card p-4">
              <h2 className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Indicadores Nacionais
              </h2>
              <StatBar label="Economia" value={stats.economy} colorClass="stat-economy" icon="📊" showChange={lastEffects.economy} />
              <StatBar label="Militar" value={stats.military} colorClass="stat-military" icon="⚔️" showChange={lastEffects.military} />
              <StatBar label="Felicidade" value={stats.happiness} colorClass="stat-happiness" icon="😐" showChange={lastEffects.happiness} />
              <StatBar label="Corrupção" value={stats.corruption} colorClass="stat-corruption" icon="🐀" showChange={lastEffects.corruption} />
              <StatBar label="Reputação" value={stats.reputation} colorClass="stat-reputation" icon="🌐" showChange={lastEffects.reputation} />
              <StatBar label="Ego" value={stats.ego} colorClass="stat-ego" icon="👑" showChange={lastEffects.ego} />
            </div>
            <AdvisorPanel stats={stats} />
          </div>

          {/* Main Panel */}
          <div>
            <AnimatePresence mode="wait">
              {phase === 'event' && (
                <EventCard key={currentEvent.id} event={currentEvent} onChoice={handleChoice} />
              )}
              {phase === 'result' && lastChoice && (
                <ResultPanel key="result" choice={lastChoice} onContinue={nextTurn} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
