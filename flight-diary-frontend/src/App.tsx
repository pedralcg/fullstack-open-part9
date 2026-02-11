import { useState, useEffect } from "react";
import type { NonSensitiveDiaryEntry, Visibility, Weather } from "./types";
import { createDiary, getAllDiaries } from "./services/diaryService";

const App = () => {
  // Tipado explícito del estado inicial
  const [diaries, setDiaries] = useState<NonSensitiveDiaryEntry[]>([]);

  // Estados para el formulario
  const [date, setDate] = useState("");
  const [weather, setWeather] = useState<Weather>("sunny"); // Valor inicial tipado
  const [visibility, setVisibility] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    getAllDiaries().then((data) => {
      setDiaries(data);
    });
  }, []);

  const diaryCreation = (event: React.SyntheticEvent) => {
    event.preventDefault();

    // Creamos el objeto siguiendo el tipo NewDiaryEntry
    const diaryToAdd = {
      date,
      weather: weather,
      visibility: visibility as Visibility,
      comment,
    };

    createDiary(diaryToAdd).then((data) => {
      setDiaries(diaries.concat(data));
      // Limpiar formulario
      setDate("");
      // setWeather("");
      setVisibility("");
      setComment("");
    });
  };

  return (
    <div>
      <h2>Add new entry</h2>
      <form onSubmit={diaryCreation}>
        <div>
          date{" "}
          <input
            type="date"
            value={date}
            onChange={({ target }) => setDate(target.value)}
          />
        </div>
        <div>
          <strong>weather: </strong>
          {(["sunny", "rainy", "cloudy", "stormy", "windy"] as Weather[]).map(
            (option) => (
              <label key={option}>
                <input
                  type="radio"
                  name="weather"
                  value={option}
                  checked={weather === option}
                  onChange={() => setWeather(option)}
                />
                {option}
              </label>
            ),
          )}
        </div>
        <div>
          visibility{" "}
          <input
            value={visibility}
            onChange={({ target }) => setVisibility(target.value)}
          />
        </div>
        <div>
          comment{" "}
          <input
            value={comment}
            onChange={({ target }) => setComment(target.value)}
          />
        </div>
        <button type="submit">add</button>
      </form>

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
