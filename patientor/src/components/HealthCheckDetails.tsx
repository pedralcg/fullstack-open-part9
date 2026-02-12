import { Box, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import { HealthCheckEntry, Diagnosis } from "../types";

// Definimos una interfaz para el mapeo de colores para evitar el error ts(7053)
const ratingColors: { [key: number]: string } = {
  0: "green",
  1: "gold",
  2: "orange",
  3: "red",
};

const HealthCheckDetails = ({
  entry,
  diagnoses,
}: {
  entry: HealthCheckEntry;
  diagnoses: Diagnosis[];
}) => {
  const ratingColor = ratingColors[entry.healthCheckRating] || "gray";

  return (
    <Box sx={{ border: "1px solid black", borderRadius: "5px", p: 2, mb: 2 }}>
      <Typography variant="body1">
        {entry.date} <MedicalServicesIcon />
      </Typography>
      <Typography sx={{ fontStyle: "italic" }}>{entry.description}</Typography>
      <FavoriteIcon sx={{ color: ratingColor }} />

      {/* ERROR CORREGIDO: Aquí listamos los diagnósticos manualmente o con un componente que EXISTA */}
      <ul>
        {entry.diagnosisCodes?.map((code) => (
          <li key={code}>
            {code} {diagnoses.find((d) => d.code === code)?.name}
          </li>
        ))}
      </ul>
      <Typography variant="body2" sx={{ mt: 1 }}>
        diagnose by {entry.specialist}
      </Typography>
    </Box>
  );
};

export default HealthCheckDetails;
