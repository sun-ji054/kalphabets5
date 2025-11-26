export interface NameTranslation {
  hangul: string;
  romanization: string;
  meaning: string;
  origin: string;
}

export interface HistoryItem extends NameTranslation {
  id: string;
  originalName: string;
  timestamp: number;
}
