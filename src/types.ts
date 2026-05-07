export type Platform = "reddit" | "twitter" | "discord";
export type ExerciseMode = "standard" | "hybrid";
export type Placement = "username" | "body" | "reply";
export type TriggerFrequency = "less" | "normal" | "more";

export interface Session {
  id: string;
  date: string;
  durationMinutes: number;
  mode: ExerciseMode;
  platform: Platform;
  peakAnxiety: number;
  currentAnxiety: number;
}

export interface AppSettings {
  triggerWords: string[];
  hobbySearchTerms: string[];
  triggerFrequency: TriggerFrequency;
}
