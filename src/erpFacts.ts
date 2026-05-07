export interface ErpFact {
  stat: string;
  detail: string;
}

export const ERP_FACTS: ErpFact[] = [
  {
    stat: "Avoidance makes OCD worse — every time.",
    detail: "Each avoided exposure reinforces the fear pathway. The brain learns: \"that threat was real enough to escape.\" The next exposure gets harder.",
  },
  {
    stat: "60–80% of people who complete ERP see significant improvement.",
    detail: "The catch: \"complete.\" Partial engagement — skipping sessions, stopping early — produces far weaker results.",
  },
  {
    stat: "OCD expands to fill the space avoidance creates.",
    detail: "Untreated OCD rarely stays contained. New triggers emerge, restrictions grow. The comfort zone shrinks while the feared zone grows.",
  },
  {
    stat: "Compulsions work — for about 60 seconds.",
    detail: "Then anxiety returns, often higher than before. Each compulsion teaches the brain the threat was real and the ritual was necessary.",
  },
  {
    stat: "Anxiety during exposure peaks, then drops on its own.",
    detail: "You don't have to do anything to make it go away. You just have to outlast it. Most people find it fades within 20–45 minutes.",
  },
  {
    stat: "The average person with OCD waits 14–17 years to get effective treatment.",
    detail: "Avoidance is a large part of why. It masquerades as coping while the disorder quietly deepens.",
  },
  {
    stat: "Frequent, consistent exposures produce faster results.",
    detail: "Spacing sessions days apart slows habituation. Daily practice — even short sessions — builds momentum the brain can't ignore.",
  },
  {
    stat: "Reassurance-seeking is a compulsion too.",
    detail: "Googling symptoms, asking others if you're okay, re-reading messages — all compulsions. All fuel the cycle. ERP breaks it.",
  },
];

export function getDailyFact(): ErpFact {
  const dayIndex = Math.floor(Date.now() / 86400000);
  return ERP_FACTS[dayIndex % ERP_FACTS.length];
}
