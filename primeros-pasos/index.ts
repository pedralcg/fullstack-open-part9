import express from "express";
import { calculateBmi } from "./bmiCalculator";
import { calculateExercises } from "./exerciseCalculator";

const app = express();
app.use(express.json()); // Para que req.body funcione

app.get("/bmi", (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  // Validación requerida por el ejercicio 9.5
  if (!height || !weight || isNaN(height) || isNaN(weight)) {
    return res.status(400).json({
      error: "malformatted parameters",
    });
  }

  const bmiCategory = calculateBmi(height, weight);

  return res.json({
    weight,
    height,
    bmi: bmiCategory,
  });
});

app.post("/exercises", (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  // Validar parámetros faltantes
  if (!daily_exercises || target === undefined) {
    return res.status(400).json({ error: "parameters missing" });
  }

  // Validar tipos de datos (malformatted parameters)
  // Comprobamos que target sea un número y que daily_exercises sea un array de números
  if (
    isNaN(Number(target)) ||
    !Array.isArray(daily_exercises) ||
    daily_exercises.some((d: any) => isNaN(Number(d)))
  ) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  // Si pasamos las validaciones, ejecutamos la calculadora
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const result = calculateExercises(
    daily_exercises.map(Number),
    Number(target),
  );

  return res.json(result);
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
