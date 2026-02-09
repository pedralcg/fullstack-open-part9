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
  gender: string;
  occupation: string;
}

// Aquí usamos el Utility Type Omit para excluir el SSN
export type NonSensitivePatient = Omit<Patient, "ssn">;
