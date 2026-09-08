import { useEffect, useState } from "react";
import pugGif from "../assets/pug_run.gif";

const MESSAGES = [
  "You've got this!",
  "Stay with it.",
  "Anxiety peaks, then fades.",
  "Every second is progress.",
  "You're braver than you feel.",
  "The discomfort won't last.",
  "Keep going!",
  "You're doing great.",
  "Sit with it. You're safe.",
  "Almost there!",
  "This is how recovery happens.",
  "One breath at a time.",
  "Woof! You're doing it!",
  "OCD doesn't get to win today.",
  "You showed up. That's huge.",
  "Running alongside you 🐾",
  "Shake it off!",
  "You're a good human.",
  "Tail wags for you!",
  "The pug believes in you.",
  "Stronger than the thought.",
  "This too shall pass. Probably quickly.",
];

export default function PugBuddy() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * MESSAGES.length));
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % MESSAGES.length);
        setVisible(true);
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end gap-1 z-40 select-none">
      {/* speech bubble */}
      <div
        className={`bg-white border border-violet-200 text-[#1e1230] text-xs px-3 py-2 rounded-2xl rounded-br-sm max-w-[160px] text-center shadow-md transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        {MESSAGES[index]}
      </div>

      {/* pug */}
      <img
        src={pugGif}
        alt="running pug"
        className="w-24 h-24 object-contain"
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
}
