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
  const canImages = settings.imageSearchTerms.length > 0;
  const streakAtRisk = streak > 0 && !doneToday;

  useEffect(() => {
    initNotifications();
  }, []);

  function startExercise() {
    navigate("/exercise", { state: { minutes, mode } });
  }

  return (
    <div className="min-h-screen bg-[#f0edfb] text-[#1e1230] flex flex-col items-center justify-center p-6">
      {/* top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/settings")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-violet-50 border border-violet-200 hover:border-violet-400 text-violet-700 hover:text-violet-900 text-sm font-medium transition shadow-sm"
          >
            ⚙ Settings
          </button>
          <button
            onClick={() => navigate("/learn")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-violet-50 border border-violet-200 hover:border-violet-400 text-violet-700 hover:text-violet-900 text-sm font-medium transition shadow-sm"
          >
            📖 Learn
          </button>
        </div>

        <button
          onClick={() => navigate("/history")}
          className="flex items-center gap-2 group"
        >
          <div className="text-right">
            <div className={`text-xl font-bold leading-none ${streak > 0 ? "text-orange-500" : "text-gray-400"}`}>
              {streak}
            </div>
            <div className="text-xs text-[#8b80a5]">day streak</div>
          </div>
          <span className="text-xl">{streak > 0 ? "🔥" : "💤"}</span>
        </button>
      </div>

      <div className="text-center mb-8 mt-8">
        <h1 className="text-4xl font-bold mb-2 text-[#1e1230]">Habituate</h1>
        <p className="text-[#6b5f85] text-sm">A safe space to face what's hard</p>
      </div>

      {/* daily status card */}
      <div className={`w-full max-w-xs rounded-xl px-4 py-3 mb-6 flex items-center gap-3 border ${
        doneToday
          ? "bg-green-50 border-green-300"
          : streakAtRisk
          ? "bg-orange-50 border-orange-300"
          : "bg-white border-violet-200"
      }`}>
        <span className="text-2xl">
          {doneToday ? "✅" : streakAtRisk ? "⚠️" : "⭕"}
        </span>
        <div>
          <div className={`text-sm font-semibold ${doneToday ? "text-green-700" : streakAtRisk ? "text-orange-600" : "text-[#6b5f85]"}`}>
            {doneToday
              ? "Done for today!"
              : streakAtRisk
              ? "Streak at risk"
              : "No session yet today"}
          </div>
          <div className="text-xs text-[#8b80a5]">
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
        <div className="w-full max-w-xs rounded-xl px-4 py-3 mt-3 mb-4 border bg-red-50 border-red-200">
          <p className="text-red-600 text-xs font-semibold mb-1">{fact.stat}</p>
          <p className="text-[#6b5f85] text-xs leading-relaxed">{fact.detail}</p>
        </div>
      )}

      {!showStart ? (
        <div className="flex flex-col items-center gap-3 w-full max-w-xs">
          {!canStart && !canImages && (
            <p className="text-amber-600 text-sm text-center">
              Add trigger words or image terms in Settings to begin.
            </p>
          )}
          <button
            onClick={() => (canStart || canImages) && setShowStart(true)}
            disabled={!canStart && !canImages}
            className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl text-lg transition shadow-lg shadow-violet-300/50"
          >
            Start Session
          </button>
        </div>
      ) : (
        <div className="bg-white border border-violet-200 rounded-2xl p-6 w-full max-w-xs space-y-5 shadow-sm">
          <h2 className="text-lg font-semibold text-center text-[#1e1230]">Set up your session</h2>

          {/* duration */}
          <div>
            <label className="text-sm text-[#6b5f85] block mb-2">Duration</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMinutes((m) => Math.max(1, m - 1))}
                className="w-9 h-9 rounded-full bg-violet-100 hover:bg-violet-200 text-violet-700 font-bold text-lg flex items-center justify-center transition"
              >
                −
              </button>
              <span className="text-2xl font-bold w-16 text-center text-[#1e1230]">{minutes} min</span>
              <button
                onClick={() => setMinutes((m) => Math.min(60, m + 1))}
                className="w-9 h-9 rounded-full bg-violet-100 hover:bg-violet-200 text-violet-700 font-bold text-lg flex items-center justify-center transition"
              >
                +
              </button>
            </div>
          </div>

          {/* mode */}
          <div>
            <label className="text-sm text-[#6b5f85] block mb-2">Mode</label>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setMode("standard")}
                disabled={!canStart}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition border ${
                  mode === "standard"
                    ? "bg-violet-600 border-violet-500 text-white"
                    : "bg-violet-50 border-violet-200 text-violet-600 hover:border-violet-400"
                } disabled:opacity-40 disabled:cursor-not-allowed`}
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
                    : "bg-teal-50 border-teal-200 text-teal-600 hover:border-teal-400"
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
                    : "bg-violet-50 border-violet-200 text-violet-600 hover:border-violet-400"
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                Split
              </button>
              <button
                onClick={() => canImages && setMode("images")}
                disabled={!canImages}
                title={!canImages ? "Add image search terms in Settings → Images to enable" : ""}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition border ${
                  mode === "images"
                    ? "bg-indigo-600 border-indigo-500 text-white"
                    : "bg-indigo-50 border-indigo-200 text-indigo-600 hover:border-indigo-400"
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                Images
              </button>
            </div>
            {mode === "hybrid" && (
              <p className="text-xs text-[#8b80a5] mt-1.5">First half: trigger exposure · Second half: hobby search</p>
            )}
            {mode === "split" && (
              <p className="text-xs text-[#8b80a5] mt-1.5">Trigger mock and hobby side by side the whole session</p>
            )}
            {mode === "images" && (
              <p className="text-xs text-[#8b80a5] mt-1.5">Google Images opens in a new tab · SafeSearch on · timer runs here</p>
            )}
          </div>

          <button
            onClick={startExercise}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-violet-300/50"
          >
            Begin
          </button>
          <button
            onClick={() => setShowStart(false)}
            className="w-full text-[#8b80a5] hover:text-[#6b5f85] text-sm py-1 transition"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
