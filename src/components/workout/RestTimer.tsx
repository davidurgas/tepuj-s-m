// Oddychový časovač medzi sériami – plávajúci panel + kontext na spúšťanie.
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Minus, Pause, Play, Plus, Timer, X } from "lucide-react";
import { fmtClock } from "@/lib/workout/format";

interface TimerCtx {
  start: (seconds: number) => void;
  stop: () => void;
  running: boolean;
}

const RestTimerContext = createContext<TimerCtx | null>(null);

function beep(times = 2) {
  try {
    const AudioCtx =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    let t = ctx.currentTime;
    for (let i = 0; i < times; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 880;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.3, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.2);
      t += 0.28;
    }
    setTimeout(() => ctx.close(), 1200);
  } catch {
    // audio nedostupné – ignoruj
  }
}

function vibrate() {
  try {
    navigator.vibrate?.([120, 60, 120]);
  } catch {
    /* ignoruj */
  }
}

export function RestTimerProvider({
  children,
  soundEnabled = true,
}: {
  children: React.ReactNode;
  soundEnabled?: boolean;
}) {
  const [total, setTotal] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const deadline = useRef<number>(0);
  const soundRef = useRef(soundEnabled);
  soundRef.current = soundEnabled;

  const start = (seconds: number) => {
    setTotal(seconds);
    setRemaining(seconds);
    setPaused(false);
    setVisible(true);
    deadline.current = Date.now() + seconds * 1000;
  };

  const stop = () => {
    setVisible(false);
    setPaused(false);
    setRemaining(0);
  };

  useEffect(() => {
    if (!visible || paused) return;
    const id = window.setInterval(() => {
      const left = Math.max(0, Math.round((deadline.current - Date.now()) / 1000));
      setRemaining(left);
      if (left <= 0) {
        window.clearInterval(id);
        if (soundRef.current) beep();
        vibrate();
        setTimeout(() => setVisible(false), 1500);
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [visible, paused]);

  const adjust = (delta: number) => {
    setRemaining((r) => {
      const next = Math.max(0, r + delta);
      deadline.current = Date.now() + next * 1000;
      setTotal((t) => Math.max(t, next));
      return next;
    });
  };

  const togglePause = () => {
    setPaused((p) => {
      if (p) deadline.current = Date.now() + remaining * 1000;
      return !p;
    });
  };

  const pct = total > 0 ? (remaining / total) * 100 : 0;
  const done = visible && remaining <= 0;

  return (
    <RestTimerContext.Provider value={{ start, stop, running: visible }}>
      {children}
      {visible && (
        <div className="pointer-events-none fixed inset-x-0 bottom-[76px] z-50 flex justify-center px-4">
          <div
            className={`pointer-events-auto w-full max-w-md overflow-hidden rounded-2xl border shadow-hover backdrop-blur ${
              done ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card/95"
            }`}
          >
            <div className="relative h-1 w-full bg-black/10">
              <div
                className="absolute inset-y-0 left-0 bg-primary transition-[width] duration-300 ease-linear"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <Timer className="h-5 w-5 shrink-0 opacity-80" />
              {done ? (
                <span className="flex-1 text-sm font-semibold">Oddych hotový — pokračuj v ďalšej sérii 💪</span>
              ) : (
                <>
                  <span className="min-w-[3.5rem] font-mono text-2xl font-bold tabular-nums">
                    {fmtClock(remaining)}
                  </span>
                  <div className="ml-auto flex items-center gap-1.5">
                    <TimerBtn label="−15 s" onClick={() => adjust(-15)}>
                      <Minus className="h-4 w-4" />
                    </TimerBtn>
                    <TimerBtn label="+15 s" onClick={() => adjust(15)}>
                      <Plus className="h-4 w-4" />
                    </TimerBtn>
                    <TimerBtn label={paused ? "Pokračovať" : "Pauza"} onClick={togglePause}>
                      {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                    </TimerBtn>
                  </div>
                </>
              )}
              <button
                onClick={stop}
                aria-label="Zavrieť časovač"
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition ${
                  done ? "hover:bg-black/10" : "hover:bg-muted"
                }`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </RestTimerContext.Provider>
  );
}

function TimerBtn({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="grid h-8 w-8 place-items-center rounded-full bg-muted text-foreground transition hover:bg-muted/70"
    >
      {children}
    </button>
  );
}

export function useRestTimer(): TimerCtx {
  const ctx = useContext(RestTimerContext);
  if (!ctx) throw new Error("useRestTimer musí byť použité vnútri RestTimerProvider");
  return ctx;
}
