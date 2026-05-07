import type { Platform, Placement, TriggerFrequency } from "./types";

const ADJECTIVES = ["Quick","Brave","Silent","Lucky","Fuzzy","Odd","Calm","Bold","Neat","Wise","Dark","Bright","Pale","Sharp","Rough"];
const NOUNS = ["Panda","Eagle","River","Cloud","Stone","Wolf","Cactus","Pixel","Nova","Fox","Cedar","Blaze","Creek","Marsh","Frost"];
const NUMBERS = ["42","99","404","777","23","1337","88","555","101","7"];

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomUsername(triggerWord?: string, inUsername?: boolean): string {
  if (inUsername && triggerWord) {
    const styles = [
      `${triggerWord}_${rand(NOUNS)}`,
      `${rand(ADJECTIVES)}_${triggerWord}`,
      `real${triggerWord}${rand(NUMBERS)}`,
      `${triggerWord}${rand(NUMBERS)}`,
      `the_${triggerWord}`,
    ];
    return rand(styles);
  }
  return `${rand(ADJECTIVES)}${rand(NOUNS)}${rand(NUMBERS)}`;
}

function injectWord(sentence: string, word: string): string {
  const words = sentence.split(" ");
  const pos = Math.floor(Math.random() * words.length);
  words.splice(pos, 0, word);
  return words.join(" ");
}

const POST_BODIES = [
  "Just had the weirdest experience at the grocery store today. Anyone else deal with this?",
  "Does anyone know a good way to fix this issue I've been having for weeks now?",
  "I finally finished that project I've been working on. Feels great to be done.",
  "Hot take: most advice online is just repackaged common sense with better marketing.",
  "The funniest thing happened on my commute this morning, I had to share.",
  "Genuinely curious what people think about this. No wrong answers.",
  "Three years ago I had nothing. Now look at where things ended up.",
  "PSA for everyone who does this regularly — please stop, it affects others.",
  "Unpopular opinion incoming but I genuinely believe this is being overlooked.",
  "Can we talk about how underrated this thing is? Nobody seems to care.",
];

const REPLY_BODIES = [
  "This happened to me last month, it's more common than people think.",
  "Totally agree, been saying this for years.",
  "Wait, really? I had no idea that was even a thing.",
  "Honestly same. It gets easier though, trust me.",
  "Nah I disagree. Here's why...",
  "That's kind of a wild take but I respect it.",
  "I looked this up and apparently it's been studied extensively.",
  "Same energy as that post from last week lol",
  "This is the most relatable thing I've read all day.",
  "Thank you for saying this. Someone had to.",
];

const SUBREDDITS = ["r/AskReddit","r/LifeProTips","r/Showerthoughts","r/TrueOffMyChest","r/CasualConversation","r/TIFU","r/unpopularopinion","r/NoStupidQuestions"];
const DISCORD_CHANNELS = ["#general","#off-topic","#random","#daily-chat","#venting","#advice","#hot-takes","#introductions"];
const DISCORD_SERVERS = ["The Hangout","Late Night Crew","Study Buddies","Daily Drivers","The Void","Cozy Corner"];

export interface FakePost {
  platform: Platform;
  username: string;
  body: string;
  timeAgo: string;
  subreddit?: string;
  upvotes?: number;
  retweets?: number;
  likes?: number;
  channel?: string;
  server?: string;
  replies: { username: string; body: string; timeAgo: string }[];
  triggerPlacement: Placement;
}

function randomTimeAgo(maxHours: number): string {
  const h = Math.floor(Math.random() * maxHours) + 1;
  return `${h}h ago`;
}

function randomDiscordTime(): string {
  const h = (Math.floor(Math.random() * 12) + 1).toString().padStart(2, "0");
  const m = Math.floor(Math.random() * 60).toString().padStart(2, "0");
  const ampm = Math.random() > 0.5 ? "AM" : "PM";
  return `Today at ${h}:${m} ${ampm}`;
}

export function generateFakePost(platform: Platform, triggerWord: string, placement: Placement, frequency: TriggerFrequency = "normal"): FakePost {
  // less:   1 injection — body only
  // normal: 2–3 injections — body + 1–2 replies
  // more:   4–5 injections — body + username + 2–3 replies

  const replyInjectCount =
    frequency === "less"   ? 0 :
    frequency === "normal" ? 1 + Math.floor(Math.random() * 2) :  // 1–2
                             2 + Math.floor(Math.random() * 2);    // 2–3

  const inUsername = frequency === "more";
  const mainUsername = randomUsername(triggerWord, inUsername);
  const body = injectWord(rand(POST_BODIES), triggerWord); // always in body

  const replyCount = Math.max(replyInjectCount + 1, 2 + Math.floor(Math.random() * 3));
  const replyTargets = new Set(
    Array.from({ length: replyInjectCount }, (_, i) => i)
  );

  const replies = Array.from({ length: replyCount }, (_, i) => {
    const isTarget = replyTargets.has(i);
    return {
      username: randomUsername(isTarget ? triggerWord : undefined, isTarget),
      body: isTarget ? injectWord(rand(REPLY_BODIES), triggerWord) : rand(REPLY_BODIES),
      timeAgo: platform === "discord" ? randomDiscordTime() : randomTimeAgo(10),
    };
  });

  return {
    platform,
    username: mainUsername,
    body,
    timeAgo: platform === "discord" ? randomDiscordTime() : randomTimeAgo(20),
    subreddit: platform === "reddit" ? rand(SUBREDDITS) : undefined,
    upvotes: platform === "reddit" ? Math.floor(Math.random() * 50000) + 100 : undefined,
    retweets: platform === "twitter" ? Math.floor(Math.random() * 5000) : undefined,
    likes: platform === "twitter" ? Math.floor(Math.random() * 20000) : undefined,
    channel: platform === "discord" ? rand(DISCORD_CHANNELS) : undefined,
    server: platform === "discord" ? rand(DISCORD_SERVERS) : undefined,
    replies,
    triggerPlacement: placement,
  };
}
