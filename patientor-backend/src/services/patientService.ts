import { v1 as uuid } from "uuid";
import patientsData from "../../data/patients"; // Cambiamos el nombre para procesarlo
import {
  Patient,
  NonSensitivePatient,
  NewPatient,
  Gender,
  Entry,
  EntryWithoutId,
} from "../types";

// Forzamos a que los datos del JSON se traten como el tipo Patient[]
const patients: Patient[] = patientsData as Patient[];

const getNonSensitiveEntries = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender: gender as Gender,
    occupation,
  }));
};

const getById = (id: string): Patient | undefined => {
  const patient = patients.find((p) => p.id === id);
  if (!patient) return undefined;
  return patient;
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

const addEntry = (patientId: string, entry: EntryWithoutId): Entry => {
  const patient = patients.find((p) => p.id === patientId);

  if (!patient) {
    throw new Error("Patient not found");
  }

  const newEntry: Entry = {
    id: uuid(),
    ...entry,
  } as Entry; // Usamos 'as Entry' para asegurar la compatibilidad

  patient.entries.push(newEntry);
  return newEntry;
};

export default {
  getNonSensitiveEntries,
  addPatient,
  getById,
  addEntry,
};
