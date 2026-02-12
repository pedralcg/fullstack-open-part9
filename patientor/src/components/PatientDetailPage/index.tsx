import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box } from "@mui/material";
import { Male, Female, Transgender } from "@mui/icons-material"; // Iconos de género

import { Patient, Gender, Diagnosis } from "../../types";
import patientService from "../../services/patients";
import diagnosisService from "../../services/diagnoses";

const PatientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient>();
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        const p = await patientService.getOne(id);
        setPatient(p);
      }
    };

    const fetchDiagnoses = async () => {
      const d = await diagnosisService.getAll();
      setDiagnoses(d);
    };

    void fetchPatient();
    void fetchDiagnoses();
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

      <Typography sx={{ mt: 2 }}>ssn: {patient.ssn}</Typography>
      <Typography>occupation: {patient.occupation}</Typography>

      <Typography variant="h5" sx={{ mt: 3, mb: 1 }} fontWeight="bold">
        entries
      </Typography>
      {patient.entries.map((entry) => (
        <Box key={entry.id} sx={{ mb: 2 }}>
          <Typography>
            {entry.date} <i>{entry.description}</i>
          </Typography>

          {/* Renderizado de códigos de diagnóstico si existen */}
          {entry.diagnosisCodes && (
            <ul>
              {entry.diagnosisCodes.map((code) => {
                // 1. Buscamos el objeto diagnóstico correspondiente a este código
                const diagnosis = diagnoses.find((d) => d.code === code);

                return (
                  <li key={code}>
                    <Typography variant="body2">
                      {code} - {diagnosis ? diagnosis.name : null}
                    </Typography>
                  </li>
                );
              })}
            </ul>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default PatientDetailPage;
