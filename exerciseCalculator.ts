interface ExerciseValues {
  target: number;
  hours: number[];
}

const parseExerciseArguments = (args: string[]): ExerciseValues => {
  if (args.length < 4) throw new Error("Not enough arguments");

  // El primer argumento (args[2]) es el objetivo
  const target = Number(args[2]);
  // El resto (de args[3] en adelante) son las horas
  const hours = args.slice(3).map((h) => Number(h));

  if (isNaN(target) || hours.some((h) => isNaN(h))) {
    throw new Error("Provided values were not numbers!");
  }

  return { target, hours };
};

interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const calculateExercises = (
  exerciseHours: number[],
  target: number,
): Result => {
  const periodLength = exerciseHours.length;
  const trainingDays = exerciseHours.filter((h) => h > 0).length;
  const totalHours = exerciseHours.reduce((sum, h) => sum + h, 0);
  const average = totalHours / periodLength;
  const success = average >= target;

  // Lógica de calificación (métrica propia)
  let rating: number;
  let ratingDescription: string;

  if (average >= target) {
    rating = 3;
    ratingDescription = "amazing job, goal reached!";
  } else if (average >= target * 0.8) {
    rating = 2;
    ratingDescription = "not too bad but could be better";
  } else {
    rating = 1;
    ratingDescription = "you need to work harder to reach the target";
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

try {
  const { target, hours } = parseExerciseArguments(process.argv);
  console.log(calculateExercises(hours, target));
} catch (error: unknown) {
  let errorMessage = "Something bad happened.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
  console.log(errorMessage);
}
