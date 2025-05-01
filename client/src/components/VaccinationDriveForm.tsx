import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
  Typography,
} from "@mui/material";
import { queryClient, apiRequest } from "../lib/queryClient";
import { format, addDays } from "date-fns";

interface VaccinationDriveFormProps {
  drive?: any;
  onClose: () => void;
}

function VaccinationDriveForm({ drive, onClose }: VaccinationDriveFormProps) {
  const isEditMode = !!drive;
  const minDate = format(addDays(new Date(), 15), "yyyy-MM-dd");
  
  const initialClasses = drive?.applicableClasses 
    ? drive.applicableClasses.split(",").map((c: string) => c.trim())
    : [];
  
  const [formData, setFormData] = useState({
    vaccineName: drive?.vaccineName || "",
    driveDate: drive?.driveDate 
      ? format(new Date(drive.driveDate), "yyyy-MM-dd") 
      : "",
    availableDoses: drive?.availableDoses || "",
    notes: drive?.notes || "",
  });
  
  const [selectedClasses, setSelectedClasses] = useState<string[]>(initialClasses);
  const [error, setError] = useState("");

  // Mutation for creating/updating a vaccination drive
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (isEditMode) {
        return apiRequest("PUT", `/api/vaccination-drives/${drive.id}`, data);
      } else {
        return apiRequest("POST", "/api/vaccination-drives", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vaccination-drives"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/upcoming-drives"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      onClose();
    },
    onError: (error: any) => {
      setError(error.message || "An error occurred");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target as { name: string; value: unknown };
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClassChange = (grade: string) => {
    setSelectedClasses((prev) =>
      prev.includes(grade)
        ? prev.filter((c) => c !== grade)
        : [...prev, grade]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (selectedClasses.length === 0) {
      setError("Please select at least one class/grade");
      return;
    }
    
    try {
      const submitData = {
        ...formData,
        driveDate: new Date(formData.driveDate).toISOString(),
        availableDoses: Number(formData.availableDoses),
        applicableClasses: selectedClasses.join(", "),
      };
      
      await mutation.mutateAsync(submitData);
    } catch (err) {
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ 
        maxWidth: '500px', 
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5
      }}>
        <FormControl 
          required
          size="small"
          sx={{ width: '100%' }}
        >
          <InputLabel>Vaccine Name</InputLabel>
          <Select
            name="vaccineName"
            value={formData.vaccineName}
            onChange={handleChange as any}
            label="Vaccine Name"
          >
            <MenuItem value="MMR">MMR (Measles, Mumps, Rubella)</MenuItem>
            <MenuItem value="Polio">Polio</MenuItem>
            <MenuItem value="Hepatitis B">Hepatitis B</MenuItem>
            <MenuItem value="Influenza">Influenza</MenuItem>
            <MenuItem value="Tetanus">Tetanus</MenuItem>
            <MenuItem value="DTP">DTP (Diphtheria, Tetanus, Pertussis)</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Date of Drive"
          name="driveDate"
          type="date"
          value={formData.driveDate}
          onChange={handleChange}
          required
          size="small"
          inputProps={{ min: minDate }}
          InputLabelProps={{ 
            shrink: true,
            sx: { background: 'white', px: 1 }
          }}
          helperText={`Drive must be scheduled at least 15 days in advance (${minDate} or later)`}
          sx={{ width: '100%' }}
        />

        <TextField
          label="Number of Available Doses"
          name="availableDoses"
          type="number"
          value={formData.availableDoses}
          onChange={handleChange}
          required
          size="small"
          inputProps={{ min: 1 }}
          InputLabelProps={{ 
            shrink: true,
            sx: { background: 'white', px: 1 }
          }}
          sx={{ width: '100%' }}
        />

        <Box sx={{ width: '100%' }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Applicable Classes
          </Typography>
          <FormGroup row sx={{ flexWrap: 'wrap' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((grade) => (
              <FormControlLabel
                key={grade}
                control={
                  <Checkbox
                    checked={selectedClasses.includes(`Grade ${grade}`)}
                    onChange={() => handleClassChange(`Grade ${grade}`)}
                    size="small"
                  />
                }
                label={`Grade ${grade}`}
                sx={{ width: { xs: "50%", sm: "25%" } }}
              />
            ))}
          </FormGroup>
        </Box>

        <TextField
          label="Additional Notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          multiline
          rows={3}
          size="small"
          InputLabelProps={{ 
            shrink: true,
            sx: { background: 'white', px: 1 }
          }}
          sx={{ width: '100%' }}
        />

        <Box sx={{ 
          mt: 2, 
          display: "flex", 
          justifyContent: "flex-end", 
          gap: 2 
        }}>
          <Button 
            variant="outlined" 
            onClick={onClose}
            size="small"
            sx={{ borderRadius: 1 }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={mutation.isPending}
            size="small"
            sx={{ borderRadius: 1 }}
          >
            {mutation.isPending ? (
              <CircularProgress size={20} />
            ) : isEditMode ? (
              "Update Drive"
            ) : (
              "Schedule Drive"
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default VaccinationDriveForm;
