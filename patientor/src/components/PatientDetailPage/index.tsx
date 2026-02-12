import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box } from "@mui/material";
import { Male, Female, Transgender } from "@mui/icons-material"; // Iconos de género

import { Patient, Gender } from "../../types";
import patientService from "../../services/patients";

const PatientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient>();

  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        const p = await patientService.getOne(id);
        setPatient(p);
      }
    };
    void fetchPatient();
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
              {entry.diagnosisCodes.map((code) => (
                <li key={code}>
                  <Typography variant="body2">{code}</Typography>
                </li>
              ))}
            </ul>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default PatientDetailPage;
