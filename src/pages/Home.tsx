import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSettings, getStreak, hasSessionToday } from "../store";
import { initNotifications } from "../notifications";
import { getDailyFact } from "../erpFacts";
import StreakGrid from "../components/StreakGrid";
import type { ExerciseMode } from "../types";

export default function Home() {
  const navigate = useNavigate();
  const [showStart, setShowStart] = useState(false);
  const [minutes, setMinutes] = useState(5);
  const [mode, setMode] = useState<ExerciseMode>("standard");

  const settings = getSettings();
  const streak = getStreak();
  const doneToday = hasSessionToday();
  const fact = getDailyFact();
  const canStart = settings.triggerWords.length > 0;
  const canHybrid = canStart && settings.hobbySearchTerms.length > 0;
  const streakAtRisk = streak > 0 && !doneToday;

  useEffect(() => {
    initNotifications();
  }, []);

  function startExercise() {
    navigate("/exercise", { state: { minutes, mode } });
  }

  return (
    <div className="min-h-screen bg-[#0d0f1a] text-white flex flex-col items-center justify-center p-6">
      {/* top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4">
        <button
          onClick={() => navigate("/settings")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white text-sm font-medium transition"
        >
          ⚙ Settings
        </button>

        <button
          onClick={() => navigate("/history")}
          className="flex items-center gap-2 group"
        >
          <div className="text-right">
            <div className={`text-xl font-bold leading-none ${streak > 0 ? "text-orange-400" : "text-gray-600"}`}>
              {streak}
            </div>
            <div className="text-xs text-gray-500">day streak</div>
          </div>
          <span className="text-xl">{streak > 0 ? "🔥" : "💤"}</span>
        </button>
      </div>

      <div className="text-center mb-8 mt-8">
        <h1 className="text-4xl font-bold mb-2">Habituate</h1>
        <p className="text-gray-400 text-sm">A safe space to face what's hard</p>
      </div>

      {/* daily status card */}
      <div className={`w-full max-w-xs rounded-xl px-4 py-3 mb-6 flex items-center gap-3 border ${
        doneToday
          ? "bg-[#0d2e1a] border-green-800"
          : streakAtRisk
          ? "bg-[#2a1c0d] border-orange-800"
          : "bg-[#171a2d] border-[#252a40]"
      }`}>
        <span className="text-2xl">
          {doneToday ? "✅" : streakAtRisk ? "⚠️" : "⭕"}
        </span>
        <div>
          <div className={`text-sm font-semibold ${doneToday ? "text-green-400" : streakAtRisk ? "text-orange-400" : "text-gray-400"}`}>
            {doneToday
              ? "Done for today!"
              : streakAtRisk
              ? "Streak at risk"
              : "No session yet today"}
          </div>
          <div className="text-xs text-gray-500">
            {doneToday
              ? "Great work. Come back tomorrow."
              : streakAtRisk
              ? `Complete a session to keep your ${streak}-day streak.`
              : "Start your first session for today."}
          </div>
        </div>
      </div>

      {/* streak grid */}
      {!showStart && <StreakGrid streak={streak} />}

      {/* daily fact */}
      {!showStart && (
        <div className="w-full max-w-xs rounded-xl px-4 py-3 mt-3 mb-4 border bg-[#1a0f0f] border-red-900/60">
          <p className="text-red-400 text-xs font-semibold mb-1">{fact.stat}</p>
          <p className="text-gray-400 text-xs leading-relaxed">{fact.detail}</p>
        </div>
      )}

      {!showStart ? (
        <div className="flex flex-col items-center gap-3 w-full max-w-xs">
          {!canStart && (
            <p className="text-amber-400 text-sm text-center">
              Add at least one trigger word in Settings to begin.
            </p>
          )}
          <button
            onClick={() => canStart && setShowStart(true)}
            disabled={!canStart}
            className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl text-lg transition shadow-lg shadow-violet-900/30"
          >
            Start Session
          </button>
        </div>
      ) : (
        <div className="bg-[#171a2d] border border-[#252a40] rounded-2xl p-6 w-full max-w-xs space-y-5">
          <h2 className="text-lg font-semibold text-center">Set up your session</h2>

          {/* duration */}
          <div>
            <label className="text-sm text-gray-400 block mb-2">Duration</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMinutes((m) => Math.max(1, m - 1))}
                className="w-9 h-9 rounded-full bg-[#1e2238] hover:bg-[#252a40] text-white font-bold text-lg flex items-center justify-center"
              >
                −
              </button>
              <span className="text-2xl font-bold w-16 text-center">{minutes} min</span>
              <button
                onClick={() => setMinutes((m) => Math.min(60, m + 1))}
                className="w-9 h-9 rounded-full bg-[#1e2238] hover:bg-[#252a40] text-white font-bold text-lg flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          {/* mode */}
          <div>
            <label className="text-sm text-gray-400 block mb-2">Mode</label>
            <div className="flex gap-2">
              <button
                onClick={() => setMode("standard")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition border ${
                  mode === "standard"
                    ? "bg-violet-600 border-violet-500 text-white"
                    : "bg-[#1e2238] border-[#252a40] text-gray-400 hover:border-gray-500"
                }`}
              >
                Standard
              </button>
              <button
                onClick={() => canHybrid && setMode("hybrid")}
                disabled={!canHybrid}
                title={!canHybrid ? "Add hobby search terms in Settings to enable" : ""}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition border ${
                  mode === "hybrid"
                    ? "bg-teal-600 border-teal-500 text-white"
                    : "bg-[#1e2238] border-[#252a40] text-gray-400 hover:border-gray-500"
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                Hybrid
              </button>
              <button
                onClick={() => canHybrid && setMode("split")}
                disabled={!canHybrid}
                title={!canHybrid ? "Add hobby search terms in Settings to enable" : ""}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition border ${
                  mode === "split"
                    ? "bg-violet-600 border-violet-500 text-white"
                    : "bg-[#1e2238] border-[#252a40] text-gray-400 hover:border-gray-500"
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                Split
              </button>
            </div>
            {mode === "hybrid" && (
              <p className="text-xs text-gray-500 mt-1.5">First half: trigger exposure · Second half: hobby search</p>
            )}
            {mode === "split" && (
              <p className="text-xs text-gray-500 mt-1.5">Trigger mock and hobby side by side the whole session</p>
            )}
          </div>

          <button
            onClick={startExercise}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-violet-900/30"
          >
            Begin
          </button>
          <button
            onClick={() => setShowStart(false)}
            className="w-full text-gray-500 hover:text-gray-300 text-sm py-1"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
