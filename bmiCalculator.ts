// bmiCalculator.ts

export const calculateBmi = (heightCm: number, weightKg: number): string => {
  const heightInMeters = heightCm / 100;
  const bmi = weightKg / (heightInMeters * heightInMeters);

  if (bmi < 16.0) return "Underweight (Severe thinness)";
  if (bmi < 17.0) return "Underweight (Moderate thinness)";
  if (bmi < 18.5) return "Underweight (Mild thinness)";
  if (bmi < 25.0) return "Normal (healthy weight)";
  if (bmi < 30.0) return "Overweight (Pre-obese)";
  if (bmi < 35.0) return "Obese (Class I)";
  if (bmi < 40.0) return "Obese (Class II)";
  return "Obese (Class III)";
};

// Esta parte SOLO se ejecuta si corres el archivo con npm run calculateBmi
// No se ejecutará cuando lo importes desde index.ts
if (require.main === module) {
  const height = Number(process.argv[2]);
  const weight = Number(process.argv[3]);

  if (!isNaN(height) && !isNaN(weight)) {
    console.log(calculateBmi(height, weight));
  } else {
    console.log("Please provide height and weight as numbers");
  }
}
