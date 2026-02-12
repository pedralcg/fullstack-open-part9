import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box, Button } from "@mui/material";
import { Male, Female, Transgender } from "@mui/icons-material"; // Iconos de género
import WorkIcon from "@mui/icons-material/Work";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

import {
  Patient,
  Gender,
  Diagnosis,
  Entry,
  HospitalEntry,
  OccupationalHealthcareEntry,
  EntryWithoutId,
} from "../../types";
import patientService from "../../services/patients";
import diagnosisService from "../../services/diagnoses";
import HealthCheckDetails from "../HealthCheckDetails";
import axios from "axios";
import AddEntryForm from "./AddEntryForm";

//! --- COMPONENTES DE APOYO ---

const assertNever = (value: never): never => {
  throw new Error(`Unhandled case: ${JSON.stringify(value)}`);
};

const DiagnosisList = ({
  codes,
  diagnoses,
}: {
  codes?: string[];
  diagnoses: Diagnosis[];
}) => {
  if (!codes) return null;
  return (
    <ul>
      {codes.map((code) => {
        const diagnosis = diagnoses.find((d) => d.code === code);
        return (
          <li key={code}>
            <Typography variant="body2">
              {code} {diagnosis ? diagnosis.name : null}
            </Typography>
          </li>
        );
      })}
    </ul>
  );
};

const HospitalDetails = ({
  entry,
  diagnoses,
}: {
  entry: HospitalEntry;
  diagnoses: Diagnosis[];
}) => (
  <Box sx={{ border: "1px solid black", borderRadius: "5px", p: 1, mb: 1 }}>
    <Typography>
      {entry.date} <LocalHospitalIcon />
    </Typography>
    <Typography sx={{ fontStyle: "italic" }}>{entry.description}</Typography>
    <DiagnosisList codes={entry.diagnosisCodes} diagnoses={diagnoses} />
    <Typography>
      Discharge: {entry.discharge.date} - {entry.discharge.criteria}
    </Typography>
    <Typography>diagnose by {entry.specialist}</Typography>
  </Box>
);

const OccupationalHealthcareDetails = ({
  entry,
  diagnoses,
}: {
  entry: OccupationalHealthcareEntry;
  diagnoses: Diagnosis[];
}) => (
  <Box sx={{ border: "1px solid black", borderRadius: "5px", p: 1, mb: 1 }}>
    <Typography>
      {entry.date} <WorkIcon /> <b>{entry.employerName}</b>
    </Typography>
    <Typography sx={{ fontStyle: "italic" }}>{entry.description}</Typography>
    <DiagnosisList codes={entry.diagnosisCodes} diagnoses={diagnoses} />
    <Typography>diagnose by {entry.specialist}</Typography>
  </Box>
);

const EntryDetails: React.FC<{ entry: Entry; diagnoses: Diagnosis[] }> = ({
  entry,
  diagnoses,
}) => {
  switch (entry.type) {
    case "Hospital":
      return <HospitalDetails entry={entry} diagnoses={diagnoses} />;
    case "OccupationalHealthcare":
      return (
        <OccupationalHealthcareDetails entry={entry} diagnoses={diagnoses} />
      );
    case "HealthCheck":
      return <HealthCheckDetails entry={entry} diagnoses={diagnoses} />;
    default:
      return assertNever(entry);
  }
};

//! --- COMPONENTE PRINCIPAL ---

const PatientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient>();
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string>();

  const submitNewEntry = async (values: EntryWithoutId) => {
    try {
      if (patient && id) {
        const entry = await patientService.createEntry(id, values);
        setPatient({
          ...patient,
          entries: patient.entries.concat(entry),
        });
        setShowForm(false);
        setError(undefined);
      }
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        setError(e.response?.data || "Unrecognized axios error");
      } else {
        setError("Unknown error");
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const [p, d] = await Promise.all([
          patientService.getOne(id),
          diagnosisService.getAll(),
        ]);
        setPatient(p);
        setDiagnoses(d);
      }
    };
    void fetchData();
  }, [id]);

  if (!patient) return null;

  const genderIcon = () => {
    switch (patient.gender) {
      case Gender.Male:
        return <Male />;
      case Gender.Female:
        return <Female />;
      default:
        return <Transgender />;
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h4" fontWeight="bold">
        {patient.name} {genderIcon()}
      </Typography>

      <Typography>ssn: {patient.ssn}</Typography>
      <Typography sx={{ mb: 2 }}>occupation: {patient.occupation}</Typography>

      {/* SECCIÓN DEL FORMULARIO DINÁMICO */}
      {showForm ? (
        <AddEntryForm
          onSubmit={submitNewEntry}
          onCancel={() => setShowForm(false)}
          error={error}
          diagnoses={diagnoses}
        />
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowForm(true)}
        >
          ADD NEW ENTRY
        </Button>
      )}

      <Typography variant="h5" sx={{ mt: 3, mb: 1 }} fontWeight="bold">
        entries
      </Typography>

      {patient.entries.map((entry) => (
        <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
      ))}
    </Box>
  );
};

export default PatientDetailPage;
