import { v1 as uuid } from "uuid";
import patients from "../../data/patients";
import { Patient, NonSensitivePatient, NewPatient } from "../types";

const getNonSensitiveEntries = (): NonSensitivePatient[] => {
  // Eliminamos físicamente el campo ssn de cada objeto
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addPatient = (entry: NewPatient): Patient => {
  const id = uuid();
  const newPatient = {
    id,
    ...entry,
  };

  patients.push(newPatient);
  return newPatient;
};

export default {
  getNonSensitiveEntries,
  addPatient,
};
