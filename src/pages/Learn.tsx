import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Section = "erp" | "progress" | "avoidance";

const sections: { id: Section; label: string }[] = [
  { id: "erp", label: "What is ERP" },
  { id: "progress", label: "Progress & Relapse" },
  { id: "avoidance", label: "Avoidance" },
];

interface Article {
  heading: string;
  body: string;
}

const ERP_ARTICLES: Article[] = [
  {
    heading: "What is ERP?",
    body: "Exposure and Response Prevention (ERP) is the gold-standard treatment for OCD and related anxiety disorders. The core idea is simple: you deliberately expose yourself to thoughts, images, or situations that trigger anxiety — and then resist the urge to do a compulsion in response. Over time, your brain learns that the trigger is not actually dangerous, and the anxiety fades on its own.",
  },
  {
    heading: "Why compulsions make things worse",
    body: "Compulsions feel like relief, but they're a trap. Every time you perform a compulsion — checking, reassurance-seeking, mental reviewing, or avoiding — you teach your brain that the trigger was a real threat and that the only way to feel safe was to neutralize it. This reinforces the cycle and makes the next trigger hit harder. ERP breaks that loop by proving to your nervous system that you can survive the discomfort without doing anything about it.",
  },
  {
    heading: "How ERP works neurologically",
    body: "The mechanism behind ERP is called inhibitory learning. You're not erasing the anxious association — you're building a new, stronger one on top of it. Every time you face a trigger without responding, you create a new memory: 'I encountered this and nothing bad happened.' The brain doesn't delete fear memories, but it does learn to suppress them when there's enough evidence that the fear isn't warranted.",
  },
  {
    heading: "What a session actually looks like",
    body: "In a session, you encounter your trigger — in this app, that means seeing your trigger word appear in realistic-looking social media posts. The goal is to notice the discomfort, let the urge to do a compulsion arise, and choose not to act on it. You sit with the anxiety until it naturally decreases. That decrease — called habituation — is the therapeutic payoff. You don't have to feel calm to do ERP. You just have to stay.",
  },
  {
    heading: "How long does it take to work?",
    body: "Most people notice meaningful change within 4–8 weeks of consistent practice. Early sessions can feel intense because you're confronting things you've been avoiding. That's normal and expected — it means the therapy is working. The discomfort isn't a sign that something is wrong; it's a sign that your brain is being challenged in the way it needs to be. Consistency matters far more than session length.",
  },
];

const PROGRESS_ARTICLES: Article[] = [
  {
    heading: "What progress actually looks like",
    body: "Progress in ERP isn't linear and it rarely looks like the trigger stops feeling scary. What actually changes is your relationship to the discomfort. You stop treating anxiety as an emergency. Triggers that used to derail your whole day start feeling manageable — not because they've disappeared, but because you've built confidence that you can handle them without compulsing. That shift in confidence is the real win.",
  },
  {
    heading: "How to tell it's working",
    body: "Signs that ERP is helping: the time between trigger and peak anxiety gets shorter; the peak intensity starts to come down; you find yourself choosing not to compulse even outside of formal sessions; the intrusive thought loses some of its urgency or 'stickiness.' You may still have bad days, but bad days stop feeling permanent.",
  },
  {
    heading: "Understanding relapse",
    body: "Relapse — a return of intense symptoms after a period of improvement — is common and not a sign of failure. It usually happens during periods of stress, major life change, or when you've had a long gap in practice. Your brain hasn't forgotten what you taught it; it's just temporarily defaulting to old patterns. Returning to ERP quickly is the most important thing you can do. The gains come back faster than the first time.",
  },
  {
    heading: "Why long gaps make things harder",
    body: "ERP works through repeated evidence that triggers aren't dangerous. When you stop practicing, the inhibitory learning you built doesn't vanish — but it does weaken relative to the original fear memory. The original fear is older and deeper. Regular sessions, even short ones, are far more effective than occasional intense sessions. Consistency is the single biggest predictor of lasting improvement.",
  },
  {
    heading: "Building habits that protect your progress",
    body: "The most durable protection against relapse is a maintenance habit. Even after symptoms feel manageable, brief daily or weekly exposure sessions help keep your brain calibrated. Treat it like physical therapy — you don't stop exercising just because you feel strong. Journaling after sessions, tracking your streak, and noticing small wins all help reinforce the identity shift from 'someone who avoids' to 'someone who faces things.'",
  },
  {
    heading: "When to get additional support",
    body: "This app is designed to support a self-directed ERP practice. If symptoms are significantly interfering with your daily life, if you're struggling to do ERP on your own, or if your anxiety feels unmanageable, working with a therapist trained in ERP or CBT is strongly recommended. Apps and self-help are most effective as supplements to — or maintenance after — professional treatment.",
  },
];

const AVOIDANCE_ARTICLES: Article[] = [
  {
    heading: "What avoidance actually is",
    body: "Avoidance is anything you do to reduce contact with a trigger — and it's far more subtle than just not going somewhere. It includes mental rituals (reviewing, reassuring yourself, analyzing), behavioral rituals (checking, seeking reassurance from others), thought suppression ('don't think about it'), distraction used as escape, and even subtle shifts like tensing up, holding your breath, or rushing past something uncomfortable. All of these count.",
  },
  {
    heading: "Why avoidance feels so reasonable",
    body: "The brain is wired to avoid things it perceives as dangerous. Avoidance brings immediate relief, which makes it feel like the right call. The problem is that relief is temporary and comes at a cost — every time you avoid, you confirm the threat and shrink your world a little more. What starts as one trigger avoided can expand into dozens of things you structure your life around not encountering.",
  },
  {
    heading: "The hierarchy: facing things gradually",
    body: "ERP is most effective when done gradually, starting with triggers that provoke mild-to-moderate discomfort and working up to harder ones. This is called an exposure hierarchy. Starting at the top is overwhelming; starting at the bottom builds momentum and confidence. The difficulty ratings on your trigger words in this app are a starting point for building your own informal hierarchy.",
  },
  {
    heading: "Cognitive avoidance: the hidden compulsion",
    body: "Many people complete an exposure but secretly neutralize it mentally — immediately reassuring themselves ('that doesn't mean what I think it means'), analyzing ('why did I feel that way?'), or suppressing the thought afterward. This cognitive avoidance undoes a lot of the work. The goal during an exposure is to sit with uncertainty, not to resolve it. Discomfort is the point, not a problem to be solved.",
  },
  {
    heading: "Safety behaviors: subtle avoidance",
    body: "Safety behaviors are actions that make you feel safer during an exposure without actually eliminating the avoidance. Examples: only doing an exposure when someone else is nearby, doing it with a phone in hand 'just in case,' or mentally rehearsing what you'll do if anxiety gets too high. These reduce the therapeutic benefit because they introduce the idea that the exposure was only survivable because of the safety net. Over time, the goal is to drop safety behaviors one by one.",
  },
  {
    heading: "Catching avoidance in daily life",
    body: "The most important skill in ERP isn't what you do in formal sessions — it's noticing avoidance as it happens in everyday life and choosing differently. That might mean not closing a tab quickly, not asking a friend for reassurance, staying in a situation a few minutes longer than feels comfortable. Each of these small choices is a real exposure. The cumulative effect of resisting avoidance in daily life often matters as much as scheduled sessions.",
  },
];

const CONTENT: Record<Section, Article[]> = {
  erp: ERP_ARTICLES,
  progress: PROGRESS_ARTICLES,
  avoidance: AVOIDANCE_ARTICLES,
};

export default function Learn() {
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>("erp");

  const articles = CONTENT[section];

  return (
    <div className="min-h-screen bg-[#0d0f1a] text-white max-w-lg mx-auto flex flex-col">
      <div className="px-6 pt-6 pb-0">
        <button onClick={() => navigate("/")} className="text-gray-400 hover:text-white text-sm mb-5 flex items-center gap-1">
          ← Back
        </button>
        <h1 className="text-2xl font-bold mb-1">Learn</h1>
        <p className="text-gray-500 text-sm mb-5">How ERP works and how to make the most of it.</p>

        <div className="flex border-b border-[#2a2a2a]">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition -mb-px whitespace-nowrap ${
                section === s.id
                  ? "border-violet-500 text-white"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 px-6 pt-6 pb-10 space-y-6">
        {articles.map((article) => (
          <div key={article.heading} className="bg-[#13162a] border border-[#1e2238] rounded-xl px-5 py-4">
            <h2 className="text-base font-semibold text-white mb-2">{article.heading}</h2>
            <p className="text-gray-400 text-sm leading-relaxed">{article.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
