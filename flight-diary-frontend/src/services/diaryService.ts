import axios from "axios";
import type {
  DiaryEntry,
  NewDiaryEntry,
  NonSensitiveDiaryEntry,
} from "../types";

const baseUrl = "http://localhost:3000/api/diaries";

export const getAllDiaries = async () => {
  const response = await axios.get<NonSensitiveDiaryEntry[]>(baseUrl);
  return response.data;
};

export const createDiary = async (object: NewDiaryEntry) => {
  // Indicamos que la respuesta será de tipo DiaryEntry (con id)
  const response = await axios.post<DiaryEntry>(baseUrl, object);
  return response.data;
};
