import { useNavigate } from "react-router-dom";
import { getSessions, getStreak } from "../store";

const ANXIETY_LABELS: Record<number, string> = {
  1: "Very mild",
  2: "Mild",
  3: "Moderate",
  4: "Noticeable",
  5: "High",
  6: "Very high",
  7: "Extreme",
};

function AnxietyBar({ value }: { value: number }) {
  const pct = (value / 7) * 100;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-[#1e2238] rounded-full h-2">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-green-500 to-red-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-gray-400 w-16">{value}/7 — {ANXIETY_LABELS[value]}</span>
    </div>
  );
}

export default function History() {
  const navigate = useNavigate();
  const sessions = getSessions();
  const streak = getStreak();

  return (
    <div className="min-h-screen bg-[#0d0f1a] text-white p-6 max-w-lg mx-auto">
      <button onClick={() => navigate("/")} className="text-gray-400 hover:text-white text-sm mb-6 flex items-center gap-1">
        ← Back
      </button>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Session History</h1>
        <div className="text-right">
          <div className="text-3xl font-bold text-orange-400">{streak}</div>
          <div className="text-xs text-gray-400">day streak</div>
        </div>
      </div>

      {sessions.length === 0 ? (
        <p className="text-gray-500 text-center mt-16">No sessions yet. Complete your first exercise to see it here.</p>
      ) : (
        <div className="space-y-4">
          {sessions.map((s) => (
            <div key={s.id} className="bg-[#171a2d] border border-[#252a40] rounded-xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-sm font-medium capitalize">{s.mode} · {s.platform}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{new Date(s.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
                </div>
                <span className="text-xs bg-[#1e2238] text-gray-400 px-2 py-1 rounded-full">{s.durationMinutes} min</span>
              </div>

              <div className="space-y-2">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Peak anxiety</div>
                  <AnxietyBar value={s.peakAnxiety} />
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Current anxiety after</div>
                  <AnxietyBar value={s.currentAnxiety} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
