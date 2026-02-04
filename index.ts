import express from "express";
import { calculateBmi } from "./bmiCalculator"; // Importación del módulo

const app = express();

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

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
