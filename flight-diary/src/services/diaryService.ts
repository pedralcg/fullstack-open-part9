import diaries from "../../src/data/entries"; // Asegúrate de tener el archivo de datos
import { DiaryEntry, NonSensitiveDiaryEntry } from "../types";

const getEntries = (): DiaryEntry[] => {
  return diaries;
};

const getNonSensitiveEntries = (): NonSensitiveDiaryEntry[] => {
  return diaries.map(({ id, date, weather, visibility }) => ({
    id,
    date,
    weather,
    visibility,
  })); // Excluimos el comentario manualmente
};

export default {
  getEntries,
  getNonSensitiveEntries,
};
