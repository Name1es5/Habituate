import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSettings, saveSettings, getNotifSettings, saveNotifSettings } from "../store";
import { requestNotificationPermission, getNotificationPermission, scheduleNotification } from "../notifications";

type Tab = "triggers" | "hobbies" | "general";

export default function Settings() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("triggers");
  const [settings, setSettings] = useState(getSettings);
  const [notif, setNotif] = useState(getNotifSettings);
  const [wordInput, setWordInput] = useState("");
  const [termInput, setTermInput] = useState("");
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
    const updated = { ...settings, triggerWords: settings.triggerWords.filter((x) => x !== w) };
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
    { id: "general", label: "General" },
  ];

  return (
    <div className="min-h-screen bg-[#0d0f1a] text-white max-w-lg mx-auto flex flex-col">
      {/* header */}
      <div className="px-6 pt-6 pb-0">
        <button onClick={() => navigate("/")} className="text-gray-400 hover:text-white text-sm mb-5 flex items-center gap-1">
          ← Back
        </button>
        <h1 className="text-2xl font-bold mb-5">Settings</h1>

        {/* tabs */}
        <div className="flex border-b border-[#2a2a2a]">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition -mb-px ${
                tab === t.id
                  ? "border-violet-500 text-white"
                  : "border-transparent text-gray-500 hover:text-gray-300"
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
            <p className="text-gray-400 text-sm mb-4">Words that get embedded in mock social posts during exercises.</p>

            <div className="flex gap-2 mb-4">
              <input
                className="flex-1 bg-[#171a2d] border border-[#252a40] rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500"
                placeholder="Add a trigger word..."
                value={wordInput}
                onChange={(e) => setWordInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addWord()}
              />
              <button
                onClick={addWord}
                className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {settings.triggerWords.length === 0 && (
                <p className="text-gray-500 text-sm">No trigger words added yet.</p>
              )}
              {settings.triggerWords.map((w) => (
                <span key={w} className="flex items-center gap-1.5 bg-[#2a1a2e] border border-purple-800 text-purple-300 px-3 py-1 rounded-full text-sm">
                  {w}
                  <button onClick={() => removeWord(w)} className="text-purple-500 hover:text-white leading-none">×</button>
                </span>
              ))}
            </div>
          </section>
        )}

        {/* --- Hobbies tab --- */}
        {tab === "hobbies" && (
          <section>
            <p className="text-gray-400 text-sm mb-4">Used in hybrid mode — the second half auto-searches one of these in Google.</p>

            <div className="flex gap-2 mb-4">
              <input
                className="flex-1 bg-[#171a2d] border border-[#252a40] rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500"
                placeholder="e.g. mountain biking, watercolor painting..."
                value={termInput}
                onChange={(e) => setTermInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTerm()}
              />
              <button
                onClick={addTerm}
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {settings.hobbySearchTerms.length === 0 && (
                <p className="text-gray-500 text-sm">No hobby terms added yet.</p>
              )}
              {settings.hobbySearchTerms.map((t) => (
                <span key={t} className="flex items-center gap-1.5 bg-[#0d2320] border border-teal-800 text-teal-300 px-3 py-1 rounded-full text-sm">
                  {t}
                  <button onClick={() => removeTerm(t)} className="text-teal-500 hover:text-white leading-none">×</button>
                </span>
              ))}
            </div>
          </section>
        )}

        {/* --- General tab --- */}
        {tab === "general" && (
          <section>
            <h2 className="text-base font-semibold mb-1">Daily Reminder</h2>
            <p className="text-gray-400 text-sm mb-4">Get a notification each day if you haven't done your session yet.</p>

            {notifPermission === "unsupported" && (
              <p className="text-gray-500 text-sm">Notifications are not supported in this browser.</p>
            )}

            {notifPermission === "denied" && (
              <p className="text-amber-400 text-sm">
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
                    <div className="flex items-center justify-between bg-[#171a2d] border border-[#252a40] rounded-xl px-4 py-3">
                      <div>
                        <div className="text-sm font-medium text-green-400">Reminders on</div>
                        <div className="text-xs text-gray-500">Notifies at {formatTime12h(notif.time)} if no session yet</div>
                      </div>
                      <button
                        onClick={handleDisableNotifications}
                        className="text-xs text-gray-500 hover:text-white border border-[#333] hover:border-gray-500 px-3 py-1.5 rounded-lg transition"
                      >
                        Turn off
                      </button>
                    </div>

                    <div>
                      <label className="text-sm text-gray-400 block mb-1.5">Reminder time</label>
                      <input
                        type="time"
                        value={notif.time}
                        onChange={(e) => handleTimeChange(e.target.value)}
                        className="bg-[#171a2d] border border-[#252a40] rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 text-white"
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
