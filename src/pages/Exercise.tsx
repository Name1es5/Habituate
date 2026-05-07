import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getSettings } from "../store";
import type { ExerciseMode, Platform, Placement } from "../types";
import type { FakePost } from "../fakeContent";
import { generateFakePost } from "../fakeContent";
import MockReddit from "../components/MockReddit";
import MockTwitter from "../components/MockTwitter";
import MockDiscord from "../components/MockDiscord";
import PugBuddy from "../components/PugBuddy";

const PLATFORMS: Platform[] = ["reddit", "twitter", "discord"];
const PLACEMENTS: Placement[] = ["username", "body", "reply"];

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

interface LocationState {
  minutes: number;
  mode: ExerciseMode;
}

export default function Exercise() {
  const navigate = useNavigate();
  const location = useLocation();
  const { minutes, mode } = (location.state as LocationState) ?? { minutes: 5, mode: "standard" };

  const settings = getSettings();
  const totalSeconds = minutes * 60;
  const halfSeconds = Math.floor(totalSeconds / 2);

  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [showTrigger, setShowTrigger] = useState(false);
  const [inHobbyHalf, setInHobbyHalf] = useState(false);
  const [post, setPost] = useState<FakePost | null>(null);
  const [platform] = useState<Platform>(() => rand(PLATFORMS));
  const [searchTerm] = useState<string>(() =>
    settings.hobbySearchTerms.length > 0 ? rand(settings.hobbySearchTerms) : ""
  );

  const triggerWord = settings.triggerWords.length > 0 ? rand(settings.triggerWords) : "";
  const placement = rand(PLACEMENTS);
  const triggerWordRef = useRef(triggerWord);
  const placementRef = useRef(placement);

  // Generate initial post
  useEffect(() => {
    if (triggerWordRef.current) {
      setPost(generateFakePost(platform, triggerWordRef.current, placementRef.current));
    }
  }, [platform]);

  // Delay before trigger word appears (3-10 seconds)
  useEffect(() => {
    const delay = 3000 + Math.random() * 7000;
    const t = setTimeout(() => setShowTrigger(true), delay);
    return () => clearTimeout(t);
  }, []);

  // Main countdown — only starts once the trigger post is revealed
  useEffect(() => {
    if (!showTrigger) return;
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(interval);
          navigate("/post-exercise", {
            state: { minutes, mode, platform, sessionDate: new Date().toISOString() },
          });
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showTrigger, navigate, minutes, mode, platform]);

  // Switch to hobby half (hybrid mode)
  useEffect(() => {
    if (mode !== "hybrid") return;
    const elapsed = totalSeconds - secondsLeft;
    if (elapsed >= halfSeconds && !inHobbyHalf) {
      setInHobbyHalf(true);
    }
  }, [secondsLeft, mode, halfSeconds, totalSeconds, inHobbyHalf]);

  const progressPct = ((totalSeconds - secondsLeft) / totalSeconds) * 100;
  const elapsedSeconds = totalSeconds - secondsLeft;
  const MIN_SECONDS = 120;
  const [showExitNudge, setShowExitNudge] = useState(false);

  function handleExit() {
    if (elapsedSeconds < MIN_SECONDS) {
      setShowExitNudge(true);
      return;
    }
    navigate("/post-exercise", {
      state: { minutes, mode, platform, sessionDate: new Date().toISOString() },
    });
  }

  function confirmExit() {
    navigate("/post-exercise", {
      state: { minutes, mode, platform, sessionDate: new Date().toISOString() },
    });
  }

  return (
    <div className="min-h-screen bg-[#0d0f1a] text-white flex flex-col">
      {/* exit nudge overlay */}
      {showExitNudge && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
          <div className="bg-[#171a2d] border border-[#252a40] rounded-2xl p-6 max-w-xs w-full text-center space-y-4">
            <div className="text-3xl">🌿</div>
            <h2 className="text-lg font-semibold">Stay a little longer?</h2>
            <p className="text-gray-400 text-sm">
              You've gone {Math.floor(elapsedSeconds / 60)}:{(elapsedSeconds % 60).toString().padStart(2, "0")} so far. The discomfort usually peaks and fades — you're closer than it feels.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowExitNudge(false)}
                className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2.5 rounded-xl transition text-sm"
              >
                Keep going
              </button>
              <button
                onClick={confirmExit}
                className="flex-1 bg-[#1e2238] hover:bg-[#252a40] text-gray-400 hover:text-white font-medium py-2.5 rounded-xl transition text-sm"
              >
                Exit anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e2238]">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-mono font-bold text-violet-400">{formatTime(secondsLeft)}</span>
          {mode === "hybrid" && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${inHobbyHalf ? "bg-teal-900 text-teal-300" : "bg-violet-900 text-violet-300"}`}>
              {inHobbyHalf ? "hobby half" : "exposure half"}
            </span>
          )}
        </div>
        <button
          onClick={handleExit}
          className="text-gray-500 hover:text-white text-sm border border-[#252a40] hover:border-gray-500 px-3 py-1.5 rounded-lg transition"
        >
          Exit
        </button>
      </div>

      {/* progress bar */}
      <div className="h-1.5 bg-[#1e2238]">
        <div
          className={`h-1.5 transition-all duration-1000 ${inHobbyHalf ? "bg-teal-500" : "bg-violet-500"}`}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* content */}
      <div className="flex-1 p-4 overflow-auto">
        {inHobbyHalf && mode === "hybrid" ? (
          <div className="w-full h-full flex flex-col gap-2">
            <p className="text-xs text-gray-500 text-center">Searching: <span className="text-teal-400">{searchTerm}</span></p>
            <iframe
              key={searchTerm}
              src={`https://www.google.com/search?q=${encodeURIComponent(searchTerm)}&igu=1`}
              className="w-full flex-1 rounded-xl border border-[#252a40]"
              style={{ minHeight: "calc(100vh - 140px)" }}
              title="hobby search"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            {!showTrigger && (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
                <p className="text-gray-500 text-sm">Take a breath. Your session is loading.</p>
              </div>
            )}
            {post && showTrigger && (
              <>
                {platform === "reddit" && <MockReddit post={post} />}
                {platform === "twitter" && <MockTwitter post={post} />}
                {platform === "discord" && <MockDiscord post={post} />}
              </>
            )}
          </div>
        )}
      </div>

      <PugBuddy />
    </div>
  );
}
