import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { saveSession, getStreak, hasSessionToday } from "../store";
import type { ExerciseMode, Platform } from "../types";

interface LocationState {
  minutes: number;
  mode: ExerciseMode;
  platform: Platform;
  imageTerm?: string;
  sessionDate: string;
}

const LABELS: Record<number, string> = {
  1: "Very mild",
  2: "Mild",
  3: "Moderate",
  4: "Noticeable",
  5: "High",
  6: "Very high",
  7: "Extreme",
};

function AnxietyPicker({ value, onChange }: { value: number | null; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-2 justify-center flex-wrap">
      {[1, 2, 3, 4, 5, 6, 7].map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={`w-11 h-11 rounded-full font-bold text-sm transition border-2 ${
            value === n
              ? "bg-violet-600 border-violet-400 text-white scale-110"
              : "bg-violet-50 border-violet-200 text-violet-600 hover:border-violet-500 hover:bg-violet-100"
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

function StreakCelebration({ streak }: { streak: number }) {
  return (
    <div className="bg-orange-50 border border-orange-300 rounded-xl px-4 py-3 flex items-center gap-3 mb-4">
      <span className="text-3xl">🔥</span>
      <div>
        <div className="text-orange-600 font-bold text-sm">{streak}-day streak!</div>
        <div className="text-[#8b80a5] text-xs">Keep showing up. It gets easier.</div>
      </div>
    </div>
  );
}

export default function PostExercise() {
  const navigate = useNavigate();
  const location = useLocation();
  const { minutes, mode, platform, imageTerm, sessionDate } = (location.state as LocationState) ?? {
    minutes: 5,
    mode: "standard",
    platform: "reddit",
    sessionDate: new Date().toISOString(),
  };
  const sessionLabel = mode === "images" && imageTerm ? imageTerm : platform;

  const hadSessionBeforeThis = hasSessionToday();
  const streakBefore = getStreak();

  const [peak, setPeak] = useState<number | null>(null);
  const [current, setCurrent] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [newStreak, setNewStreak] = useState<number | null>(null);

  function submit() {
    if (peak === null || current === null) return;
    saveSession({
      id: crypto.randomUUID(),
      date: sessionDate,
      durationMinutes: minutes,
      mode,
      platform,
      peakAnxiety: peak,
      currentAnxiety: current,
    });

    const streak = getStreak();
    const extended = !hadSessionBeforeThis && streak > streakBefore;
    if (extended || streak >= 1) setNewStreak(streak);
    setSaved(true);
  }

  if (saved) {
    return (
      <div className="min-h-screen bg-[#f0edfb] text-[#1e1230] flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-4 text-center">
          <div className="text-5xl mb-2">✓</div>
          <h1 className="text-2xl font-bold text-[#1e1230]">Well done.</h1>
          <p className="text-[#6b5f85] text-sm">{minutes} min · {mode} · {sessionLabel}</p>

          {newStreak !== null && newStreak > 0 && (
            <StreakCelebration streak={newStreak} />
          )}

          <div className="bg-white border border-violet-200 rounded-xl px-4 py-3 text-sm text-[#6b5f85] text-left space-y-1 shadow-sm">
            <div className="flex justify-between">
              <span>Peak anxiety</span>
              <span className="text-[#1e1230] font-medium">{peak}/7 — {LABELS[peak!]}</span>
            </div>
            <div className="flex justify-between">
              <span>Current anxiety</span>
              <span className="text-[#1e1230] font-medium">{current}/7 — {LABELS[current!]}</span>
            </div>
          </div>

          <button
            onClick={() => navigate("/")}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition mt-2 shadow-lg shadow-violet-300/40"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0edfb] text-[#1e1230] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="text-4xl mb-3">✓</div>
          <h1 className="text-2xl font-bold text-[#1e1230]">You did it.</h1>
          <p className="text-[#6b5f85] text-sm mt-1">{minutes} min · {mode} · {sessionLabel}</p>
        </div>

        <div className="bg-white border border-violet-200 rounded-2xl p-5 space-y-6 shadow-sm">
          <div>
            <h2 className="text-sm font-semibold text-center mb-1 text-[#1e1230]">Peak anxiety during the session</h2>
            {peak !== null && <p className="text-xs text-center text-[#8b80a5] mb-3">{LABELS[peak]}</p>}
            {peak === null && <div className="mb-3" />}
            <AnxietyPicker value={peak} onChange={setPeak} />
          </div>

          <div className="border-t border-violet-100 pt-4">
            <h2 className="text-sm font-semibold text-center mb-1 text-[#1e1230]">Where are you right now?</h2>
            {current !== null && <p className="text-xs text-center text-[#8b80a5] mb-3">{LABELS[current]}</p>}
            {current === null && <div className="mb-3" />}
            <AnxietyPicker value={current} onChange={setCurrent} />
          </div>
        </div>

        <button
          onClick={submit}
          disabled={peak === null || current === null}
          className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-violet-300/40"
        >
          Save & finish
        </button>
      </div>
    </div>
  );
}
