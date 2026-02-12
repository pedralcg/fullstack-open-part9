import { v1 as uuid } from "uuid";
import patients from "../../data/patients";
import { Patient, NonSensitivePatient, NewPatient, Gender } from "../types";

const getNonSensitiveEntries = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    // Usamos 'as Gender' para convertir el string del archivo de datos al Enum
    gender: gender as Gender,
    occupation,
  }));
};

const getById = (id: string): Patient | undefined => {
  const patient = patients.find((p) => p.id === id);

  if (!patient) return undefined;

  return {
    ...patient,
    gender: patient.gender as Gender, // Esto fuerza a TS a reconocer el string como Gender
  };
};

const addPatient = (entry: NewPatient): Patient => {
  const id = uuid();
  const newPatient = {
    id,
    ...entry,
    entries: [],
  };

  patients.push(newPatient);
  return newPatient;
};

export default {
  getNonSensitiveEntries,
  addPatient,
  getById,
};
