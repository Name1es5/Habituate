import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSettings, saveSettings } from "../store";

export default function Settings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(getSettings);
  const [wordInput, setWordInput] = useState("");
  const [termInput, setTermInput] = useState("");

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

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-6 max-w-lg mx-auto">
      <button onClick={() => navigate("/")} className="text-gray-400 hover:text-white text-sm mb-6 flex items-center gap-1">
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-8">Settings</h1>

      {/* Trigger words */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-1">Trigger Words</h2>
        <p className="text-gray-400 text-sm mb-3">Words that will be embedded in the mock social posts during exercises.</p>

        <div className="flex gap-2 mb-3">
          <input
            className="flex-1 bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-500"
            placeholder="Add a trigger word..."
            value={wordInput}
            onChange={(e) => setWordInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addWord()}
          />
          <button
            onClick={addWord}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
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

      {/* Hobby search terms */}
      <section>
        <h2 className="text-lg font-semibold mb-1">Hobby Search Terms</h2>
        <p className="text-gray-400 text-sm mb-3">Used in hybrid mode — the second half shows a Google search for one of these terms.</p>

        <div className="flex gap-2 mb-3">
          <input
            className="flex-1 bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500"
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
            <p className="text-gray-500 text-sm">No search terms added yet.</p>
          )}
          {settings.hobbySearchTerms.map((t) => (
            <span key={t} className="flex items-center gap-1.5 bg-[#0d2320] border border-teal-800 text-teal-300 px-3 py-1 rounded-full text-sm">
              {t}
              <button onClick={() => removeTerm(t)} className="text-teal-500 hover:text-white leading-none">×</button>
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
