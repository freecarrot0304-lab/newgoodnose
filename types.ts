
export type SneezingLevel = '轻微' | '能忍' | '打到头晕';
export type RunnyNoseLevel = '干爽的一天' | '半包纸巾' | '干翻了两包';
export type CongestionLevel = '几乎是正常人' | '一只可用' | '憋死我了';
export type ExerciseType = '跑步' | '游泳' | '骑车' | '力量' | '爬坡' | '健身操' | '未运动';
export type Season = '春' | '夏' | '秋' | '冬';

export interface MedicationLog {
  id: string;
  timestamp: number;
  dateString: string; // YYYY-MM-DD
  medicationTaken: boolean; // Decoupled from symptoms
  treatments: {
    antiHistamine: boolean;
    nasalSpray: boolean;
    nasalWash: boolean;
  };
  symptoms: {
    sneezing: SneezingLevel;
    runnyNose: RunnyNoseLevel;
    congestion: CongestionLevel;
  } | null; // Allow null if only medication was recorded
  exercise: ExerciseType;
  season: Season;
}

export interface Settings {
  inventoryCount: number; // Support float (0.1 step)
  totalBottles: number;
  startDate: string; // YYYY-MM-DD
}

export interface AppState {
  logs: MedicationLog[];
  settings: Settings;
}
