export type Weather = "sunny" | "rainy" | "cloudy" | "windy" | "stormy";
export type Visibility = "great" | "good" | "ok" | "poor";

export interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment?: string; // El comentario es opcional
}

// Tipo de utilidad para la lista pública (sin comentarios)
export type NonSensitiveDiaryEntry = Omit<DiaryEntry, "comment">;
