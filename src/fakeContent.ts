import type { Platform, Placement } from "./types";

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
  subreddit?: string;
  upvotes?: number;
  retweets?: number;
  likes?: number;
  channel?: string;
  server?: string;
  replies: { username: string; body: string }[];
  triggerPlacement: Placement;
}

export function generateFakePost(platform: Platform, triggerWord: string, placement: Placement): FakePost {
  const inUsername = placement === "username";
  const inBody = placement === "body";
  const inReply = placement === "reply";

  const mainUsername = randomUsername(triggerWord, inUsername);
  const rawBody = rand(POST_BODIES);
  const body = inBody ? injectWord(rawBody, triggerWord) : rawBody;

  const replyCount = 2 + Math.floor(Math.random() * 3);
  const replies = Array.from({ length: replyCount }, (_, i) => {
    const isTarget = inReply && i === Math.floor(Math.random() * replyCount);
    return {
      username: randomUsername(isTarget ? triggerWord : undefined, isTarget),
      body: isTarget ? injectWord(rand(REPLY_BODIES), triggerWord) : rand(REPLY_BODIES),
    };
  });

  return {
    platform,
    username: mainUsername,
    body,
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
