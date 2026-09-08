import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSettings, saveSettings, getNotifSettings, saveNotifSettings } from "../store";
import { requestNotificationPermission, getNotificationPermission, scheduleNotification } from "../notifications";
import type { WordDifficulty } from "../types";

type Tab = "triggers" | "hobbies" | "images" | "general" | "misc";

const DIFFICULTY_CYCLE: WordDifficulty[] = ["easy", "medium", "hard"];
const DIFFICULTY_COLOR: Record<WordDifficulty, string> = {
  easy: "bg-green-400",
  medium: "bg-yellow-400",
  hard: "bg-red-400",
};

export default function Settings() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("triggers");
  const [settings, setSettings] = useState(getSettings);
  const [notif, setNotif] = useState(getNotifSettings);
  const [wordInput, setWordInput] = useState("");
  const [termInput, setTermInput] = useState("");
  const [imageInput, setImageInput] = useState("");
  const [showTriggerWords, setShowTriggerWords] = useState(false);
  const [notifPermission, setNotifPermission] = useState(getNotificationPermission);

  function addWord() {
    const w = wordInput.trim();
    if (!w || settings.triggerWords.includes(w)) return;
    const updated = { ...settings, triggerWords: [...settings.triggerWords, w] };
    setSettings(updated);
    saveSettings(updated);
    setWordInput("");
  }

  function removeWord(w: string) {
    const difficulty = { ...settings.wordDifficulty };
    delete difficulty[w];
    const updated = { ...settings, triggerWords: settings.triggerWords.filter((x) => x !== w), wordDifficulty: difficulty };
    setSettings(updated);
    saveSettings(updated);
  }

  function cycleDifficulty(w: string) {
    const current: WordDifficulty = settings.wordDifficulty[w] ?? "medium";
    const next = DIFFICULTY_CYCLE[(DIFFICULTY_CYCLE.indexOf(current) + 1) % DIFFICULTY_CYCLE.length];
    const updated = { ...settings, wordDifficulty: { ...settings.wordDifficulty, [w]: next } };
    setSettings(updated);
    saveSettings(updated);
  }

  function addTerm() {
    const t = termInput.trim();
    if (!t || settings.hobbySearchTerms.includes(t)) return;
    const updated = { ...settings, hobbySearchTerms: [...settings.hobbySearchTerms, t] };
    setSettings(updated);
    saveSettings(updated);
    setTermInput("");
  }

  function removeTerm(t: string) {
    const updated = { ...settings, hobbySearchTerms: settings.hobbySearchTerms.filter((x) => x !== t) };
    setSettings(updated);
    saveSettings(updated);
  }

  function addImageTerm() {
    const t = imageInput.trim();
    if (!t || settings.imageSearchTerms.includes(t)) return;
    const updated = { ...settings, imageSearchTerms: [...settings.imageSearchTerms, t] };
    setSettings(updated);
    saveSettings(updated);
    setImageInput("");
  }

  function removeImageTerm(t: string) {
    const updated = { ...settings, imageSearchTerms: settings.imageSearchTerms.filter((x) => x !== t) };
    setSettings(updated);
    saveSettings(updated);
  }

  async function handleEnableNotifications() {
    const perm = await requestNotificationPermission();
    setNotifPermission(perm);
    if (perm === "granted") {
      const updated = { ...notif, enabled: true };
      setNotif(updated);
      saveNotifSettings(updated);
      scheduleNotification();
    }
  }

  function handleDisableNotifications() {
    const updated = { ...notif, enabled: false };
    setNotif(updated);
    saveNotifSettings(updated);
    scheduleNotification();
  }

  function handleTimeChange(time: string) {
    const updated = { ...notif, time };
    setNotif(updated);
    saveNotifSettings(updated);
    scheduleNotification();
  }

  function formatTime12h(time24: string): string {
    const [h, m] = time24.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "triggers", label: "Trigger Words" },
    { id: "hobbies", label: "Hobbies" },
    { id: "images", label: "Images" },
    { id: "general", label: "General" },
    { id: "misc", label: "Misc" },
  ];

  return (
    <div className="min-h-screen bg-[#f0edfb] text-[#1e1230] max-w-lg mx-auto flex flex-col">
      {/* header */}
      <div className="px-6 pt-6 pb-0">
        <button onClick={() => navigate("/")} className="text-[#8b80a5] hover:text-[#6b5f85] text-sm mb-5 flex items-center gap-1 transition">
          ← Back
        </button>
        <h1 className="text-2xl font-bold mb-5 text-[#1e1230]">Settings</h1>

        {/* tabs */}
        <div className="flex border-b border-violet-200 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition -mb-px whitespace-nowrap ${
                tab === t.id
                  ? "border-violet-500 text-violet-700"
                  : "border-transparent text-[#8b80a5] hover:text-[#6b5f85]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* tab content */}
      <div className="flex-1 px-6 pt-6 pb-8">

        {/* --- Trigger Words tab --- */}
        {tab === "triggers" && (
          <section>
            <p className="text-[#6b5f85] text-sm mb-4">Words that get embedded in mock social posts during exercises.</p>

            <div className="flex gap-2 mb-4">
              <input
                className="flex-1 bg-white border border-violet-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 text-[#1e1230] placeholder-[#b0a6c8]"
                placeholder="Add a trigger word..."
                value={wordInput}
                onChange={(e) => setWordInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addWord()}
              />
              <button
                onClick={addWord}
                className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                Add
              </button>
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#8b80a5]">{settings.triggerWords.length} word{settings.triggerWords.length !== 1 ? "s" : ""}</span>
              {settings.triggerWords.length > 0 && (
                <button
                  onClick={() => setShowTriggerWords((v) => !v)}
                  className="text-xs text-[#8b80a5] hover:text-[#6b5f85] flex items-center gap-1 transition"
                >
                  {showTriggerWords ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </svg>
                      Hide
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      Show
                    </>
                  )}
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {settings.triggerWords.length === 0 && (
                <p className="text-[#8b80a5] text-sm">No trigger words added yet.</p>
              )}
              {settings.triggerWords.map((w) => {
                const diff: WordDifficulty = settings.wordDifficulty[w] ?? "medium";
                return (
                  <span key={w} className="flex items-center gap-1.5 bg-violet-100 border border-violet-300 text-violet-700 px-3 py-1 rounded-full text-sm">
                    <button
                      onClick={() => cycleDifficulty(w)}
                      title={`Difficulty: ${diff} — click to change`}
                      className={`w-2.5 h-2.5 rounded-full flex-shrink-0 hover:opacity-70 transition-opacity ${DIFFICULTY_COLOR[diff]}`}
                    />
                    {showTriggerWords ? w : `${w[0]}${"•".repeat(Math.max(1, w.length - 1))}`}
                    <button onClick={() => removeWord(w)} className="text-violet-400 hover:text-violet-700 leading-none transition">×</button>
                  </span>
                );
              })}
            </div>
            {settings.triggerWords.length > 0 && (
              <div className="flex gap-3 mb-6 -mt-4">
                {(["easy", "medium", "hard"] as const).map((d) => (
                  <span key={d} className="flex items-center gap-1 text-xs text-[#8b80a5]">
                    <span className={`w-2 h-2 rounded-full ${DIFFICULTY_COLOR[d]}`} />
                    {d}
                  </span>
                ))}
              </div>
            )}

            {/* frequency */}
            <div>
              <label className="text-sm text-[#6b5f85] block mb-1">Word appearances per post</label>
              <p className="text-xs text-[#a89cc0] mb-3">Controls how many times your trigger word shows up in each mock post.</p>
              <div className="flex gap-2">
                {(["less", "normal", "more"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      const updated = { ...settings, triggerFrequency: f };
                      setSettings(updated);
                      saveSettings(updated);
                    }}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition border capitalize ${
                      settings.triggerFrequency === f
                        ? "bg-violet-600 border-violet-500 text-white"
                        : "bg-white border-violet-200 text-violet-600 hover:border-violet-400"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-[#a89cc0] mt-1 px-1">
                <span>2–3 times</span>
                <span>4–5 times</span>
                <span>6–8 times</span>
              </div>
            </div>
          </section>
        )}

        {/* --- Hobbies tab --- */}
        {tab === "hobbies" && (
          <section>
            <p className="text-[#6b5f85] text-sm mb-4">Used in hybrid mode — the second half auto-searches one of these in Google.</p>

            <div className="flex gap-2 mb-4">
              <input
                className="flex-1 bg-white border border-teal-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500 text-[#1e1230] placeholder-[#b0a6c8]"
                placeholder="e.g. mountain biking, watercolor painting..."
                value={termInput}
                onChange={(e) => setTermInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTerm()}
              />
              <button
                onClick={addTerm}
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {settings.hobbySearchTerms.length === 0 && (
                <p className="text-[#8b80a5] text-sm">No hobby terms added yet.</p>
              )}
              {settings.hobbySearchTerms.map((t) => (
                <span key={t} className="flex items-center gap-1.5 bg-teal-50 border border-teal-300 text-teal-700 px-3 py-1 rounded-full text-sm">
                  {t}
                  <button onClick={() => removeTerm(t)} className="text-teal-400 hover:text-teal-700 leading-none transition">×</button>
                </span>
              ))}
            </div>
          </section>
        )}

        {/* --- Images tab --- */}
        {tab === "images" && (
          <section>
            <p className="text-[#6b5f85] text-sm mb-4">Words or phrases searched in Google Images during an Images mode session.</p>

            <div className="flex gap-2 mb-4">
              <input
                className="flex-1 bg-white border border-indigo-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 text-[#1e1230] placeholder-[#b0a6c8]"
                placeholder="e.g. backrooms, liminal spaces..."
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addImageTerm()}
              />
              <button
                onClick={addImageTerm}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {settings.imageSearchTerms.length === 0 && (
                <p className="text-[#8b80a5] text-sm">No image search terms added yet.</p>
              )}
              {settings.imageSearchTerms.map((t) => (
                <span key={t} className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-300 text-indigo-700 px-3 py-1 rounded-full text-sm">
                  {t}
                  <button onClick={() => removeImageTerm(t)} className="text-indigo-400 hover:text-indigo-700 leading-none transition">×</button>
                </span>
              ))}
            </div>

            <p className="text-xs text-[#a89cc0]">SafeSearch is enabled for all image sessions. Google Images opens in a new tab while the timer runs in-app.</p>
          </section>
        )}

        {/* --- Misc tab --- */}
        {tab === "misc" && (
          <section>
            <h2 className="text-base font-semibold mb-4 text-[#1e1230]">Display</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-white border border-violet-200 rounded-xl px-4 py-3 shadow-sm">
                <div>
                  <div className="text-sm font-medium text-[#1e1230]">Motivational pug</div>
                  <div className="text-xs text-[#8b80a5]">Show the running pug during exercises</div>
                </div>
                <button
                  onClick={() => {
                    const updated = { ...settings, showPugBuddy: !settings.showPugBuddy };
                    setSettings(updated);
                    saveSettings(updated);
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.showPugBuddy ? "bg-violet-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.showPugBuddy ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between bg-white border border-violet-200 rounded-xl px-4 py-3 shadow-sm">
                <div>
                  <div className="text-sm font-medium text-[#1e1230]">Calming music</div>
                  <div className="text-xs text-[#8b80a5]">Play relaxing background music during sessions</div>
                </div>
                <button
                  onClick={() => {
                    const updated = { ...settings, calmingMusic: !settings.calmingMusic };
                    setSettings(updated);
                    saveSettings(updated);
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.calmingMusic ? "bg-violet-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.calmingMusic ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* --- General tab --- */}
        {tab === "general" && (
          <section>
            <h2 className="text-base font-semibold mb-1 text-[#1e1230]">Daily Reminder</h2>
            <p className="text-[#6b5f85] text-sm mb-4">Get a notification each day if you haven't done your session yet.</p>

            {notifPermission === "unsupported" && (
              <p className="text-[#8b80a5] text-sm">Notifications are not supported in this browser.</p>
            )}

            {notifPermission === "denied" && (
              <p className="text-amber-600 text-sm">
                Notifications are blocked. Enable them in your browser/OS settings, then reload.
              </p>
            )}

            {notifPermission !== "unsupported" && notifPermission !== "denied" && (
              <div className="space-y-3">
                {!notif.enabled || notifPermission !== "granted" ? (
                  <button
                    onClick={handleEnableNotifications}
                    className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium w-full transition"
                  >
                    Enable daily reminders
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-white border border-violet-200 rounded-xl px-4 py-3 shadow-sm">
                      <div>
                        <div className="text-sm font-medium text-green-600">Reminders on</div>
                        <div className="text-xs text-[#8b80a5]">Notifies at {formatTime12h(notif.time)} if no session yet</div>
                      </div>
                      <button
                        onClick={handleDisableNotifications}
                        className="text-xs text-[#8b80a5] hover:text-[#1e1230] border border-violet-200 hover:border-violet-400 px-3 py-1.5 rounded-lg transition"
                      >
                        Turn off
                      </button>
                    </div>

                    <div>
                      <label className="text-sm text-[#6b5f85] block mb-1.5">Reminder time</label>
                      <input
                        type="time"
                        value={notif.time}
                        onChange={(e) => handleTimeChange(e.target.value)}
                        className="bg-white border border-violet-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 text-[#1e1230]"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
