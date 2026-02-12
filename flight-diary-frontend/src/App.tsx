import { useState, useEffect } from "react";
import type { NonSensitiveDiaryEntry, Visibility, Weather } from "./types";
import { createDiary, getAllDiaries } from "./services/diaryService";
import axios from "axios";

const weatherOptions: Weather[] = [
  "sunny",
  "rainy",
  "cloudy",
  "stormy",
  "windy",
];
const visibilityOptions: Visibility[] = ["great", "good", "ok", "poor"];

const App = () => {
  // Tipado explícito del estado inicial
  const [diaries, setDiaries] = useState<NonSensitiveDiaryEntry[]>([]);

  // Estados para el formulario
  const [date, setDate] = useState("");
  const [weather, setWeather] = useState<Weather>("sunny"); // Valor inicial tipado
  const [visibility, setVisibility] = useState<Visibility>("great"); // Valor inicial tipado
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    getAllDiaries().then((data) => {
      setDiaries(data);
    });
  }, []);

  const diaryCreation = (event: React.SyntheticEvent) => {
    event.preventDefault();
    setError(""); // Limpiar errores previos

    // Creamos el objeto siguiendo el tipo NewDiaryEntry
    const diaryToAdd = {
      date,
      weather: weather,
      visibility: visibility,
      comment,
    };

    createDiary(diaryToAdd)
      .then((data) => {
        setDiaries(diaries.concat(data));
        // Limpiar formulario
        setDate("");
        // setWeather("");
        // setVisibility("");
        setComment("");
      })
      .catch((e: unknown) => {
        // Estrechamiento de tipo para Axios
        if (axios.isAxiosError(e)) {
          if (e.response && typeof e.response.data === "string") {
            // Captura el mensaje específico del backend ("Incorrect visibility...")
            setError(e.response.data);
          } else {
            setError("Unrecognized axios error");
          }
        } else {
          setError("Unknown error occurred");
        }

        // Opcional: El error desaparece tras 5 segundos
        setTimeout(() => setError(""), 5000);
      });
  };

  return (
    <div>
      <h2>Add new entry</h2>

      {/* Renderizado condicional del error */}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <form onSubmit={diaryCreation}>
        <div>
          date{" "}
          <input
            type="date"
            value={date}
            onChange={({ target }) => setDate(target.value)}
          />
        </div>
        <div style={{ margin: "10px 0" }}>
          <strong>visibility: </strong>
          {visibilityOptions.map((option) => (
            <label key={option} style={{ marginRight: "10px" }}>
              <input
                type="radio"
                name="visibility"
                onChange={() => setVisibility(option)}
                checked={visibility === option}
              />
              {option}
            </label>
          ))}
        </div>

        <div style={{ margin: "10px 0" }}>
          <strong>weather: </strong>
          {weatherOptions.map((option) => (
            <label key={option} style={{ marginRight: "10px" }}>
              <input
                type="radio"
                name="weather"
                onChange={() => setWeather(option)}
                checked={weather === option}
              />
              {option}
            </label>
          ))}
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
