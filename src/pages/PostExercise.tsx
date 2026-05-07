import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { saveSession, getStreak, hasSessionToday } from "../store";
import type { ExerciseMode, Platform } from "../types";

interface LocationState {
  minutes: number;
  mode: ExerciseMode;
  platform: Platform;
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
              : "bg-[#1e2238] border-[#252a40] text-gray-400 hover:border-violet-500 hover:text-white"
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
    <div className="bg-[#1a1a0a] border border-orange-700 rounded-xl px-4 py-3 flex items-center gap-3 mb-4">
      <span className="text-3xl">🔥</span>
      <div>
        <div className="text-orange-400 font-bold text-sm">{streak}-day streak!</div>
        <div className="text-gray-400 text-xs">Keep showing up. It gets easier.</div>
      </div>
    </div>
  );
}

export default function PostExercise() {
  const navigate = useNavigate();
  const location = useLocation();
  const { minutes, mode, platform, sessionDate } = (location.state as LocationState) ?? {
    minutes: 5,
    mode: "standard",
    platform: "reddit",
    sessionDate: new Date().toISOString(),
  };

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
      <div className="min-h-screen bg-[#0d0f1a] text-white flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-4 text-center">
          <div className="text-5xl mb-2">✓</div>
          <h1 className="text-2xl font-bold">Well done.</h1>
          <p className="text-gray-400 text-sm">{minutes} min · {mode} · {platform}</p>

          {newStreak !== null && newStreak > 0 && (
            <StreakCelebration streak={newStreak} />
          )}

          <div className="bg-[#171a2d] border border-[#252a40] rounded-xl px-4 py-3 text-sm text-gray-400 text-left space-y-1">
            <div className="flex justify-between">
              <span>Peak anxiety</span>
              <span className="text-white font-medium">{peak}/7 — {LABELS[peak!]}</span>
            </div>
            <div className="flex justify-between">
              <span>Current anxiety</span>
              <span className="text-white font-medium">{current}/7 — {LABELS[current!]}</span>
            </div>
          </div>

          <button
            onClick={() => navigate("/")}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition mt-2"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0f1a] text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="text-4xl mb-3">✓</div>
          <h1 className="text-2xl font-bold">You did it.</h1>
          <p className="text-gray-400 text-sm mt-1">{minutes} min · {mode} · {platform}</p>
        </div>

        <div className="bg-[#171a2d] border border-[#252a40] rounded-2xl p-5 space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-center mb-1">Peak anxiety during the session</h2>
            {peak !== null && <p className="text-xs text-center text-gray-500 mb-3">{LABELS[peak]}</p>}
            {peak === null && <div className="mb-3" />}
            <AnxietyPicker value={peak} onChange={setPeak} />
          </div>

          <div className="border-t border-[#2a2a2a] pt-4">
            <h2 className="text-sm font-semibold text-center mb-1">Where are you right now?</h2>
            {current !== null && <p className="text-xs text-center text-gray-500 mb-3">{LABELS[current]}</p>}
            {current === null && <div className="mb-3" />}
            <AnxietyPicker value={current} onChange={setCurrent} />
          </div>
        </div>

        <button
          onClick={submit}
          disabled={peak === null || current === null}
          className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition"
        >
          Save & finish
        </button>
      </div>
    </div>
  );
}
