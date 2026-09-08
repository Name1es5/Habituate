import { getSessions } from "../store";

const DAYS = 70; // 10 weeks

// Maps consecutive streak days to an approximate anxiety reduction percentage,
// based on published ERP outcome research (60–80% improvement over 12–16 weeks
// of consistent practice).
function streakToReduction(days: number): number {
  if (days <= 0) return 0;
  if (days <= 3)  return Math.round(4 + days * 2);
  if (days <= 7)  return Math.round(10 + (days - 3) * 2.5);
  if (days <= 14) return Math.round(20 + (days - 7) * 2.5);
  if (days <= 30) return Math.round(37 + (days - 14) * 1.3);
  if (days <= 60) return Math.round(58 + (days - 30) * 0.4);
  if (days <= 90) return Math.round(70 + (days - 60) * 0.17);
  return 75;
}

export default function StreakGrid({ streak }: { streak: number }) {
  const sessions = getSessions();
  const sessionDays = new Set(sessions.map((s) => s.date.slice(0, 10)));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Build array of the last DAYS days, oldest first
  const days = Array.from({ length: DAYS }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (DAYS - 1 - i));
    const iso = d.toISOString().slice(0, 10);
    return { iso, isToday: i === DAYS - 1, hasSession: sessionDays.has(iso) };
  });

  // Split into weeks (columns of 7)
  const weeks: typeof days[] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const reduction = streakToReduction(streak);

  return (
    <div className="w-full max-w-xs">
      {/* grid */}
      <div className="flex gap-1 mb-3">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1 flex-1">
            {week.map((day) => (
              <div
                key={day.iso}
                title={day.iso}
                className={`aspect-square rounded-sm transition-colors ${
                  day.hasSession
                    ? "bg-violet-500"
                    : day.isToday
                    ? "bg-violet-200 ring-1 ring-violet-400"
                    : "bg-violet-100"
                }`}
              />
            ))}
          </div>
        ))}
      </div>

      {/* stat */}
      {streak > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          <p className="text-green-700 text-xs leading-relaxed">
            People who practice ERP consistently for{" "}
            <span className="font-semibold">{streak} day{streak !== 1 ? "s" : ""}</span> report
            roughly a{" "}
            <span className="font-bold text-green-800 text-sm">{reduction}%</span>{" "}
            decrease in anxiety symptoms.
            <span className="text-green-500"> Keep going.</span>
          </p>
        </div>
      )}
      {streak === 0 && (
        <div className="bg-white border border-violet-200 rounded-xl px-4 py-3">
          <p className="text-[#8b80a5] text-xs leading-relaxed">
            Start a session today to begin your streak. Consistent daily practice
            is what drives recovery.
          </p>
        </div>
      )}
    </div>
  );
}
