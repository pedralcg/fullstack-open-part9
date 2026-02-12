import { useState, SyntheticEvent } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  OutlinedInput,
  Chip,
  SelectChangeEvent,
} from "@mui/material";
import { EntryWithoutId, Diagnosis } from "../../types";

type EntryType = "HealthCheck" | "Hospital" | "OccupationalHealthcare";

interface Props {
  onCancel: () => void;
  onSubmit: (values: EntryWithoutId) => void;
  error?: string;
  diagnoses: Diagnosis[]; // Necesitamos la lista de diagnósticos
}

const AddEntryForm = ({ onCancel, onSubmit, error, diagnoses }: Props) => {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<
    Array<Diagnosis["code"]>
  >([]);

  const [type, setType] = useState<
    "HealthCheck" | "Hospital" | "OccupationalHealthcare"
  >("HealthCheck");

  // Campos específicos
  const [healthCheckRating, setHealthCheckRating] = useState(0);
  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");
  const [employerName, setEmployerName] = useState("");
  const [sickLeaveStart, setSickLeaveStart] = useState("");
  const [sickLeaveEnd, setSickLeaveEnd] = useState("");

  const onTypeChange = (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    const value = event.target.value;
    if (typeof value === "string") {
      // Validamos que el string sea uno de los tipos permitidos
      const entryType = value as EntryType;
      setType(entryType);
    }
  };

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();
    const baseProps = { description, date, specialist, diagnosisCodes };

    switch (type) {
      case "HealthCheck":
        onSubmit({
          ...baseProps,
          type,
          healthCheckRating: Number(healthCheckRating),
        });
        break;
      case "Hospital":
        onSubmit({
          ...baseProps,
          type,
          discharge: { date: dischargeDate, criteria: dischargeCriteria },
        });
        break;
      case "OccupationalHealthcare":
        const entry: EntryWithoutId = { ...baseProps, type, employerName };
        if (sickLeaveStart && sickLeaveEnd) {
          entry.sickLeave = {
            startDate: sickLeaveStart,
            endDate: sickLeaveEnd,
          };
        }
        onSubmit(entry);
        break;
    }
  };

  return (
    <Box sx={{ mb: 4, p: 2, border: "2px dashed #1976d2", borderRadius: 2 }}>
      <Typography variant="h6">New {type} Entry</Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={addEntry}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Entry Type</InputLabel>
          <Select value={type} label="Entry Type" onChange={onTypeChange}>
            <MenuItem value="HealthCheck">HealthCheck</MenuItem>
            <MenuItem value="Hospital">Hospital</MenuItem>
            <MenuItem value="OccupationalHealthcare">
              OccupationalHealthcare
            </MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Description"
          fullWidth
          value={description}
          onChange={({ target }) => setDescription(target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Date"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={date}
          onChange={({ target }) => setDate(target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Specialist"
          fullWidth
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
          sx={{ mb: 2 }}
        />

        {/* SELECT MÚLTIPLE DE DIAGNÓSTICOS */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Diagnosis Codes</InputLabel>
          <Select
            multiple
            value={diagnosisCodes}
            onChange={({ target }) =>
              setDiagnosisCodes(
                typeof target.value === "string"
                  ? target.value.split(",")
                  : target.value,
              )
            }
            input={<OutlinedInput label="Diagnosis Codes" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {diagnoses.map((d) => (
              <MenuItem key={d.code} value={d.code}>
                {d.code} - {d.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* CAMPOS DINÁMICOS SEGÚN EL TIPO */}
        {type === "HealthCheck" && (
          <TextField
            label="Healthcheck Rating"
            type="number"
            fullWidth
            value={healthCheckRating}
            inputProps={{ min: 0, max: 3 }}
            onChange={({ target }) =>
              setHealthCheckRating(Number(target.value))
            }
            sx={{ mb: 2 }}
          />
        )}

        {type === "Hospital" && (
          <Box sx={{ mb: 2, p: 1, bgcolor: "#f5f5f5" }}>
            <Typography variant="subtitle2">Discharge</Typography>
            <TextField
              label="Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={dischargeDate}
              onChange={({ target }) => setDischargeDate(target.value)}
              sx={{ mb: 1, mt: 1 }}
            />
            <TextField
              label="Criteria"
              fullWidth
              value={dischargeCriteria}
              onChange={({ target }) => setDischargeCriteria(target.value)}
            />
          </Box>
        )}

        {type === "OccupationalHealthcare" && (
          <Box sx={{ mb: 2, p: 1, bgcolor: "#f5f5f5" }}>
            <TextField
              label="Employer Name"
              fullWidth
              value={employerName}
              onChange={({ target }) => setEmployerName(target.value)}
              sx={{ mb: 2 }}
            />
            <Typography variant="subtitle2">Sick Leave (Optional)</Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <TextField
                  label="Start"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={sickLeaveStart}
                  onChange={({ target }) => setSickLeaveStart(target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="End"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={sickLeaveEnd}
                  onChange={({ target }) => setSickLeaveEnd(target.value)}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        <Grid container justifyContent="space-between">
          <Button color="error" variant="contained" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Add Entry
          </Button>
        </Grid>
      </form>
    </Box>
  );
};

export default AddEntryForm;
