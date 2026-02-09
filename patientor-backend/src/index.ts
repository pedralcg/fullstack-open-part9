import express from "express";
import cors from "cors";
import diagnosisRouter from "./routes/diagnoses";
import patientRouter from "./routes/patients";

const app = express();
app.use(express.json());
app.use(cors()); // Permite peticiones desde el frontend

const PORT = 3001; // Usaremos el 3001 para no chocar con el 3000 habitual del frontend

app.use("/api/diagnoses", diagnosisRouter);
app.use("/api/patients", patientRouter);

app.get("/api/ping", (_req, res) => {
  // console.log("someone pinged here");
  res.send("pong");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
