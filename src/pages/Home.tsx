import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSettings, getStreak } from "../store";
import type { ExerciseMode } from "../types";

export default function Home() {
  const navigate = useNavigate();
  const streak = getStreak();
  const settings = getSettings();
  const [showStart, setShowStart] = useState(false);
  const [minutes, setMinutes] = useState(5);
  const [mode, setMode] = useState<ExerciseMode>("standard");

  const canStart = settings.triggerWords.length > 0;
  const canHybrid = canStart && settings.hobbySearchTerms.length > 0;

  function startExercise() {
    navigate("/exercise", { state: { minutes, mode } });
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col items-center justify-center p-6">
      {/* streak */}
      <div className="absolute top-4 right-6 text-right">
        <div className="text-2xl font-bold text-orange-400">{streak}</div>
        <div className="text-xs text-gray-500">day streak</div>
      </div>

      {/* settings link */}
      <button
        onClick={() => navigate("/settings")}
        className="absolute top-4 left-6 text-gray-500 hover:text-white text-sm"
      >
        ⚙ Settings
      </button>

      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">ERP Exercise</h1>
        <p className="text-gray-400 text-sm max-w-xs">Exposure and Response Prevention practice tool</p>
      </div>

      {!showStart ? (
        <div className="flex flex-col items-center gap-4 w-full max-w-xs">
          {!canStart && (
            <p className="text-amber-400 text-sm text-center">
              Add at least one trigger word in Settings before starting.
            </p>
          )}
          <button
            onClick={() => canStart && setShowStart(true)}
            disabled={!canStart}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl text-lg transition"
          >
            Start Exercise
          </button>
          <button
            onClick={() => navigate("/history")}
            className="text-gray-500 hover:text-gray-300 text-sm"
          >
            View history
          </button>
        </div>
      ) : (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 w-full max-w-xs space-y-5">
          <h2 className="text-lg font-semibold text-center">Set up your session</h2>

          {/* duration */}
          <div>
            <label className="text-sm text-gray-400 block mb-2">Duration</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMinutes((m) => Math.max(1, m - 1))}
                className="w-9 h-9 rounded-full bg-[#252525] hover:bg-[#333] text-white font-bold text-lg flex items-center justify-center"
              >
                −
              </button>
              <span className="text-2xl font-bold w-16 text-center">{minutes} min</span>
              <button
                onClick={() => setMinutes((m) => Math.min(60, m + 1))}
                className="w-9 h-9 rounded-full bg-[#252525] hover:bg-[#333] text-white font-bold text-lg flex items-center justify-center"
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
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition border ${mode === "standard" ? "bg-purple-600 border-purple-500 text-white" : "bg-[#252525] border-[#333] text-gray-400 hover:border-gray-500"}`}
              >
                Standard
              </button>
              <button
                onClick={() => canHybrid && setMode("hybrid")}
                disabled={!canHybrid}
                title={!canHybrid ? "Add hobby search terms in Settings to enable hybrid mode" : ""}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition border ${mode === "hybrid" ? "bg-teal-600 border-teal-500 text-white" : "bg-[#252525] border-[#333] text-gray-400 hover:border-gray-500"} disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                Hybrid
              </button>
            </div>
            {mode === "hybrid" && (
              <p className="text-xs text-gray-500 mt-1.5">First half: trigger exposure · Second half: hobby search</p>
            )}
          </div>

          {/* start */}
          <button
            onClick={startExercise}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition"
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
