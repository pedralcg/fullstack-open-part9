// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Entry {}

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string; // Propiedad opcional
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
  entries: Entry[];
}

// Aquí usamos el Utility Type Omit para excluir el SSN
export type NonSensitivePatient = Omit<Patient, "ssn" | "entries">;

// Tipo para los datos que recibimos antes de asignarles un ID
export type NewPatient = Omit<Patient, "id">;
