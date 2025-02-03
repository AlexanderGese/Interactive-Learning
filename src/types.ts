export interface GameState {
  isPlaying: boolean;
  currentScene: string;
  history: string[];
  context: string;
  style: AdventureStyle;
  medals: Medal[];
}

export interface GameResponse {
  scene: string;
  prompt?: string;
  examples?: string[];
  medal?: Medal;
}

export interface Medal {
  type: 'bronze' | 'silver' | 'gold';
  message: string;
  timestamp: number;
}

export interface Choice {
  text: string;
  isCustom: boolean;
}

export type AdventureStyle = 
  | 'fantasy'
  | 'scifi'
  | 'modern'
  | 'apocalyptic'
  | 'cyberpunk'
  | 'steampunk'
  | 'historical';