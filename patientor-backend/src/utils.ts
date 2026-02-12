import {
  NewPatient,
  Gender,
  EntryWithoutId,
  HealthCheckRating,
  Diagnosis,
} from "./types";

/* --- VALIDATORES GENÉRICOS --- */

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const isDate = (date: string): boolean => {
  return !isNaN(Date.parse(date));
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender)
    .map((v) => v.toString())
    .includes(param);
};

const isHealthCheckRating = (param: number): param is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(param);
};

/* --- PARSERS DE CAMPOS --- */

const parseString = (label: string, data: unknown): string => {
  if (!isString(data)) {
    throw new Error(`Incorrect or missing ${label}`);
  }
  return data;
};

const parseDate = (date: unknown): string => {
  if (!isString(date) || !isDate(date)) {
    throw new Error("Incorrect or missing date: " + date);
  }
  return date;
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender)) {
    throw new Error("Incorrect or missing gender: " + gender);
  }
  return gender;
};

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis["code"]> => {
  if (!object || typeof object !== "object" || !("diagnosisCodes" in object)) {
    return [] as Array<Diagnosis["code"]>;
  }
  return object.diagnosisCodes as Array<Diagnosis["code"]>;
};

/* --- VALIDADOR DE PACIENTES (toNewPatient) --- */

export const toNewPatient = (object: unknown): NewPatient => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  if (
    "name" in object &&
    "dateOfBirth" in object &&
    "ssn" in object &&
    "gender" in object &&
    "occupation" in object
  ) {
    return {
      name: parseString("name", object.name),
      dateOfBirth: parseDate(object.dateOfBirth),
      ssn: parseString("ssn", object.ssn),
      gender: parseGender(object.gender),
      occupation: parseString("occupation", object.occupation),
      entries: [],
    };
  }

  throw new Error("Incorrect data: some fields are missing");
};

/* --- VALIDADOR DE ENTRADAS MÉDICAS (toNewEntry) --- */

export const toNewEntry = (object: unknown): EntryWithoutId => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  // Comprobamos los campos obligatorios comunes a todas las entradas
  if (
    "description" in object &&
    "date" in object &&
    "specialist" in object &&
    "type" in object
  ) {
    const baseEntry = {
      description: parseString("description", object.description),
      date: parseDate(object.date),
      specialist: parseString("specialist", object.specialist),
      diagnosisCodes: parseDiagnosisCodes(object),
    };

    // Discriminación por tipo de entrada
    switch (object.type) {
      case "HealthCheck":
        if ("healthCheckRating" in object) {
          const rating = Number(object.healthCheckRating);
          if (!isHealthCheckRating(rating)) {
            throw new Error(
              "Incorrect health check rating: " + object.healthCheckRating,
            );
          }
          return {
            ...baseEntry,
            type: "HealthCheck",
            healthCheckRating: rating,
          };
        }
        throw new Error("Missing health check rating");

      case "Hospital":
        if (
          "discharge" in object &&
          typeof object.discharge === "object" &&
          object.discharge !== null
        ) {
          const discharge = object.discharge as {
            date: unknown;
            criteria: unknown;
          };
          return {
            ...baseEntry,
            type: "Hospital",
            discharge: {
              date: parseDate(discharge.date),
              criteria: parseString("discharge criteria", discharge.criteria),
            },
          };
        }
        throw new Error("Missing hospital discharge info");

      case "OccupationalHealthcare":
        if ("employerName" in object) {
          const newEntry: EntryWithoutId = {
            ...baseEntry,
            type: "OccupationalHealthcare",
            employerName: parseString("employer name", object.employerName),
          };

          if (
            "sickLeave" in object &&
            typeof object.sickLeave === "object" &&
            object.sickLeave !== null
          ) {
            const sickLeave = object.sickLeave as {
              startDate: unknown;
              endDate: unknown;
            };
            (newEntry as any).sickLeave = {
              startDate: parseDate(sickLeave.startDate),
              endDate: parseDate(sickLeave.endDate),
            };
          }
          return newEntry;
        }
        throw new Error("Missing employer name");

      default:
        throw new Error("Incorrect entry type: " + object.type);
    }
  }

  throw new Error("Incorrect data: some common fields are missing");
};

export default toNewPatient;
