import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type GameStats } from "@/lib/gameData";

interface Advisor {
  name: string;
  role: string;
  icon: string;
  getAdvice: (stats: GameStats) => string | null;
}

const ADVISORS: Advisor[] = [
  {
    name: "Gen. Ferro",
    role: "Conselheiro Militar",
    icon: "🎖️",
    getAdvice: (s) => {
      if (s.military <= 10) return "Senhor, nossas forças armadas são uma piada. Até escoteiros nos venceriam.";
      if (s.military <= 25) return "Precisamos de investimento militar urgente. Nossos tanques funcionam a pedal.";
      if (s.military >= 80) return "Somos imbatíveis! Hora de... flexionar os músculos? Diplomaticamente, claro.";
      if (s.military >= 60 && s.economy <= 20) return "Temos armas, mas os soldados estão com fome. Prioridades, Senhor.";
      if (s.happiness <= 15) return "O povo quer revolução. Posso posicionar tanques nas praças... preventivamente.";
      return null;
    },
  },
  {
    name: "Dra. Cifra",
    role: "Ministra da Economia",
    icon: "📉",
    getAdvice: (s) => {
      if (s.treasury <= 15) return "Os cofres estão vazios. Literalmente. Vi uma mariposa lá dentro ontem.";
      if (s.economy <= 10) return "A economia está em coma. Nem milagre salva... mas talvez petróleo.";
      if (s.economy >= 70 && s.corruption >= 60) return "A economia cresce! Pena que 80% vai pro bolso dos amigos do rei.";
      if (s.economy >= 70) return "Números excelentes! Posso emoldurar esse gráfico pra sua parede de troféus?";
      if (s.treasury >= 80) return "Muito dinheiro nos cofres. O que poderia dar errado? Tudo, historicamente.";
      if (s.corruption >= 80) return "Senhor, os desvios são tão grandes que até os contadores desistiram.";
      return null;
    },
  },
  {
    name: "Pe. Moral",
    role: "Assessor Popular",
    icon: "🗣️",
    getAdvice: (s) => {
      if (s.happiness <= 10) return "O povo te odeia. Tipo, REALMENTE te odeia. Talvez pare de ignorá-los?";
      if (s.happiness <= 25) return "As ruas estão tensas. Sugiro não sair do palácio sem colete à prova de tomates.";
      if (s.happiness >= 75) return "O povo te ama! Aproveite, porque isso nunca dura com você no comando.";
      if (s.ego >= 80 && s.happiness <= 40) return "Seu ego é gigante e a aprovação é mínima. Não vê um padrão aí?";
      if (s.corruption >= 70 && s.happiness <= 30) return "O povo sabe dos esquemas. WhatsApp é implacável, Senhor.";
      if (s.happiness >= 50 && s.economy <= 20) return "Felizes mas pobres. Não vai durar. A fome fala mais alto que slogans.";
      return null;
    },
  },
  {
    name: "Emb. Seda",
    role: "Chanceler",
    icon: "🌐",
    getAdvice: (s) => {
      if (s.reputation <= 10) return "Nenhum país atende nossos telefonemas. Nem os golpistas de telemarketing.";
      if (s.reputation <= 25) return "Nossa imagem lá fora é... digamos... de vilão de filme B.";
      if (s.reputation >= 70) return "Somos respeitados! Finalmente. Não estrague tudo... por favor.";
      if (s.ego >= 85) return "Seus discursos na ONU viraram compilação de humor. Não é elogio.";
      if (s.military >= 70 && s.reputation <= 30) return "Somos fortes e odiados. A comunidade internacional nos chama de ameaça.";
      return null;
    },
  },
  {
    name: "Sr. Sombra",
    role: "Chefe de Inteligência",
    icon: "🕵️",
    getAdvice: (s) => {
      if (s.corruption >= 85) return "Senhor, até EU perdi a conta dos esquemas. E eu sei de TUDO.";
      if (s.ego >= 90) return "Relatório confidencial: o maior risco ao país é... o senhor. Com todo respeito.";
      if (s.happiness <= 15 && s.military <= 20) return "Interceptamos planos de golpe. De cinco grupos diferentes. Simultaneamente.";
      if (s.economy >= 60 && s.corruption >= 60) return "Os ricos ficam mais ricos. Os pobres... bem, eles têm criatividade.";
      if (s.ego >= 70 && s.reputation >= 60) return "Curiosidade: lá fora te respeitam, aqui dentro te temem. Equilíbrio perfeito?";
      return null;
    },
  },
];

interface AdvisorPanelProps {
  stats: GameStats;
}

export function AdvisorPanel({ stats }: AdvisorPanelProps) {
  const activeAdvice = useMemo(() => {
    return ADVISORS
      .map((advisor) => ({ ...advisor, advice: advisor.getAdvice(stats) }))
      .filter((a) => a.advice !== null)
      .slice(0, 3); // Show max 3 at a time
  }, [stats]);

  if (activeAdvice.length === 0) return null;

  return (
    <div className="space-y-2">
      <h2 className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        Conselheiros
      </h2>
      <AnimatePresence mode="popLayout">
        {activeAdvice.map((advisor) => (
          <motion.div
            key={advisor.name + advisor.advice}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="rounded border border-border bg-secondary/30 p-3"
          >
            <div className="mb-1 flex items-center gap-2">
              <span className="text-sm">{advisor.icon}</span>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-foreground">
                {advisor.name}
              </span>
              <span className="font-mono text-[9px] text-muted-foreground">
                {advisor.role}
              </span>
            </div>
            <p className="text-xs italic leading-relaxed text-secondary-foreground">
              "{advisor.advice}"
            </p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
