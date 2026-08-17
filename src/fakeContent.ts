import type { Platform, Placement, TriggerFrequency } from "./types";

const ADJECTIVES = ["Quick","Brave","Silent","Lucky","Fuzzy","Odd","Calm","Bold","Neat","Wise","Dark","Bright","Pale","Sharp","Rough","Salty","Tired","Weird","Crispy","Hollow","Damp","Blunt","Cozy","Frantic","Gloomy","Hazy","Lazy","Meek","Nimble","Proud"];
const NOUNS = ["Panda","Eagle","River","Cloud","Stone","Wolf","Cactus","Pixel","Nova","Fox","Cedar","Blaze","Creek","Marsh","Frost","Drifter","Sparrow","Hollow","Gecko","Raven","Basalt","Ember","Fern","Cobalt","Dusk","Heron","Linden","Moth","Quartz","Sage"];
const NUMBERS = ["42","99","404","777","23","1337","88","555","101","7","316","512","800","2049","303"];

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomUsername(triggerWord?: string, inUsername?: boolean): string {
  if (inUsername && triggerWord) {
    const styles = [
      `${triggerWord}_${rand(NOUNS).toLowerCase()}`,
      `${rand(ADJECTIVES).toLowerCase()}_${triggerWord}`,
      `real${triggerWord}${rand(NUMBERS)}`,
      `${triggerWord}${rand(NUMBERS)}`,
      `the_${triggerWord}`,
      `${triggerWord}_official`,
      `just_${triggerWord}`,
      `im_${triggerWord}_irl`,
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
  // everyday slice-of-life
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
  // health / body
  "Been tracking my sleep for a month and the data is honestly kind of alarming.",
  "My doctor said something today that I keep turning over in my head.",
  "Anyone else notice how much worse everything feels when you haven't eaten properly?",
  "Started taking this seriously and my energy levels are completely different now.",
  "Why does nobody warn you how long recovery actually takes?",
  "I keep reading conflicting things and honestly I just want a straight answer.",
  "The body keeps score. Not a fun thing to discover at 2am.",
  "Asked a doctor about this and the answer was not what I expected at all.",
  // relationships / social
  "Had a conversation with a friend today that made me rethink a lot of things.",
  "Why is it so hard to ask for help even when you clearly need it?",
  "I said something I shouldn't have and I'm still thinking about it three days later.",
  "Cutting someone off is easy. Knowing when to is the hard part.",
  "We don't talk enough about how exhausting it is to always be the responsible one.",
  "Reconnected with someone from years ago. Some people just feel like home.",
  "Setting a boundary for the first time and realizing people don't love you less for it.",
  // work / productivity
  "Finished a huge deadline and now I don't know what to do with myself.",
  "Does anyone else feel like they're performing productivity more than actually doing it?",
  "I've been doing this wrong for years and I just figured it out today.",
  "My productivity system finally clicked and I'm scared I'll lose it.",
  "Turned down an opportunity that looked good on paper and I feel at peace about it.",
  "Burned out and came back. Here's what actually helped me.",
  // observation / shower thoughts
  "The way people behave in comment sections vs. real life is staggering.",
  "We underestimate how much environment shapes our mood on a daily basis.",
  "Nobody talks about the grief that comes with outgrowing a version of yourself.",
  "The quietest parts of the day are when the loudest thoughts show up.",
  "You can tell a lot about someone by what they think is worth complaining about.",
  "There's a certain kind of tired that sleep doesn't fix.",
  "Some things you can't understand until you've been through them. That's just the truth.",
  // tech / internet culture
  "Hot take: the best software is the software you forget you're using.",
  "Watched a 45-minute video essay about something I already knew and I regret nothing.",
  "The algorithm showed me something today that I'm still processing.",
  "Deleted the app for a week. Installed it again. Nothing had changed. That's the point.",
  "This thread got ratio'd and honestly the ratio was right.",
];

const REPLY_BODIES = [
  // agreement / validation
  "This happened to me last month, it's more common than people think.",
  "Totally agree, been saying this for years.",
  "Honestly same. It gets easier though, trust me.",
  "Thank you for saying this. Someone had to.",
  "This is the most relatable thing I've read all day.",
  "Yeah this hit differently than I expected.",
  "Needed to read this today of all days.",
  "You put words to something I couldn't articulate.",
  // pushback / nuance
  "Nah I disagree. Here's why...",
  "That's kind of a wild take but I respect it.",
  "I think you're missing a piece of the puzzle here.",
  "Counterpoint: it depends way more on context than this implies.",
  "This is true but only about 70% of the time in my experience.",
  "Bold claim. What's your source on this?",
  // curiosity / questions
  "Wait, really? I had no idea that was even a thing.",
  "I looked this up and apparently it's been studied extensively.",
  "Can you say more about what you mean by that?",
  "How long did this take you to figure out?",
  "What ended up working for you?",
  "Is this something that varies a lot person to person?",
  // shared experience
  "Same energy as that post from last week lol",
  "I've been through something similar and the way you described it is spot on.",
  "My therapist said almost this exact thing last session.",
  "Went through this at 24. Now I'm 31 and it genuinely gets better.",
  "I thought I was the only one. Wild.",
  // humor / lightness
  "Not me reading this at midnight like it was written for me specifically.",
  "This belongs in a museum.",
  "Sending this to my group chat without context.",
  "New fear unlocked.",
  "The comments on this are doing more damage than the post.",
  // practical
  "There's actually a decent subreddit for exactly this.",
  "The book that helped me most with this was completely unrelated to the topic.",
  "Small thing that helped me: just naming it out loud to one person.",
  "First step is stopping the thing that's making it worse. Obvious but actually hard.",
  "Journaling sounds cringe until you're six months in and reading your own patterns.",
];

const SUBREDDITS = [
  "r/AskReddit","r/LifeProTips","r/Showerthoughts","r/TrueOffMyChest","r/CasualConversation",
  "r/TIFU","r/unpopularopinion","r/NoStupidQuestions","r/offmychest","r/mentalhealth",
  "r/Anxiety","r/selfimprovement","r/DecidingToBeBetter","r/socialskills","r/productivity",
  "r/relationships","r/HealthAnxiety","r/OCD","r/getting_over_it","r/adultingr",
];
const DISCORD_CHANNELS = [
  "#general","#off-topic","#random","#daily-chat","#venting","#advice",
  "#hot-takes","#introductions","#brain-dump","#wins-and-losses","#help-needed",
  "#midnight-thoughts","#unpopular-opinions","#real-talk","#check-in",
];
const DISCORD_SERVERS = [
  "The Hangout","Late Night Crew","Study Buddies","Daily Drivers","The Void",
  "Cozy Corner","Support Squad","Big Brain Hours","Quiet Hours","Main Characters",
];

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
  // less:   2–3 injections — body + 1–2 replies
  // normal: 4–5 injections — body + username + 2–3 replies
  // more:   6–8 injections — body + username + 4–6 replies

  const replyInjectCount =
    frequency === "less"   ? 1 + Math.floor(Math.random() * 2) :   // 1–2
    frequency === "normal" ? 2 + Math.floor(Math.random() * 2) :   // 2–3
                             4 + Math.floor(Math.random() * 3);     // 4–6

  const inUsername = frequency !== "less";
  const mainUsername = randomUsername(triggerWord, inUsername);
  const body = injectWord(rand(POST_BODIES), triggerWord);

  const replyCount = Math.max(replyInjectCount + 1, 3 + Math.floor(Math.random() * 3));
  const replyTargets = new Set(
    Array.from({ length: replyInjectCount }, (_, i) => i)
  );

  const replies = Array.from({ length: replyCount }, (_, i) => {
    const isTarget = replyTargets.has(i);
    return {
      username: randomUsername(isTarget ? triggerWord : undefined, isTarget && frequency === "more"),
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
