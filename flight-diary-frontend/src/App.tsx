import { useState, useEffect } from "react";
import type { NonSensitiveDiaryEntry } from "./types";
import { getAllDiaries } from "./services/diaryService";

const App = () => {
  // Tipado explícito del estado inicial
  const [diaries, setDiaries] = useState<NonSensitiveDiaryEntry[]>([]);

  useEffect(() => {
    getAllDiaries().then((data) => {
      setDiaries(data);
    });
  }, []);

  return (
    <div>
      <h2>Diary entries</h2>
      {diaries.map((diary) => (
        <div key={diary.id} style={{ marginBottom: "1em" }}>
          <h3>{diary.date}</h3>
          <p>
            visibility: {diary.visibility} <br />
            weather: {diary.weather}
          </p>
        </div>
      ))}
    </div>
  );
};

export default App;
