import express from "express";
import diaryRouter from "./routes/diaries";
import cors from "cors";

const app = express();
app.use(cors()); // Esto permite peticiones desde cualquier origen
app.use(express.json());

app.use("/api/diaries", diaryRouter); // Enlazamos el router

const PORT = 3000;

app.get("/ping", (_req, res) => {
  res.send("pong");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
