import patients from "../../data/patients";
import { NonSensitivePatient } from "../types";

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

export default {
  getNonSensitiveEntries,
};
