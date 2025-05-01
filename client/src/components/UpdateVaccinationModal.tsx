import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { MedicalServices } from "@mui/icons-material";
import { queryClient, apiRequest } from "../lib/queryClient";

interface UpdateVaccinationModalProps {
  open: boolean;
  onClose: () => void;
  student: any;
}

function UpdateVaccinationModal({ open, onClose, student }: UpdateVaccinationModalProps) {
  const [selectedDriveId, setSelectedDriveId] = useState("");
  const [notes, setNotes] = useState("");
  const [warningMessage, setWarningMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch available vaccination drives
  const { data: drivesResponse, isLoading: drivesLoading } = useQuery<any>({
    queryKey: ["/api/vaccination-drives/upcoming"],
  });

  const drivesData = drivesResponse?.data || [];

  // Fetch student's vaccination history
  const { data: vaccinationsResponse, isLoading: vaccinationsLoading } = useQuery<any>({
    queryKey: [`/api/vaccinations/student/${student?.id}`],
  });

  const vaccinationsData = vaccinationsResponse?.data || [];

  // Mutation for creating a vaccination record
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/vaccinations", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vaccinations"] });
      queryClient.invalidateQueries({ queryKey: [`/api/students/${student?.id}/vaccinations`] });
      onClose();
    },
    onError: (error: any) => {
      setError(error.message || "Failed to update vaccination status");
    },
  });

  // Check for potential duplicate vaccination when drive selected
  useEffect(() => {
    if (!selectedDriveId || !drivesData.length || !vaccinationsData.length) {
      setWarningMessage("");
      return;
    }

    const selectedDrive = drivesData.find((drive: any) => drive.id === Number(selectedDriveId));
    if (!selectedDrive) return;

    // Check if student already has this vaccine
    const hasVaccine = vaccinationsData.some(
      (v: any) => v.drive?.vaccineName === selectedDrive.vaccineName
    );

    if (hasVaccine) {
      setWarningMessage(
        `Warning: This student has already received the ${selectedDrive.vaccineName} vaccine. Adding another dose may not be recommended.`
      );
    } else {
      setWarningMessage("");
    }
  }, [selectedDriveId, drivesData, vaccinationsData]);

  const handleDriveChange = (event: any) => {
    setSelectedDriveId(event.target.value);
  };

  const handleNotesChange = (event: any) => {
    setNotes(event.target.value);
  };

  const handleSubmit = async () => {
    if (!selectedDriveId) {
      setError("Please select a vaccination drive");
      return;
    }

    const data = {
      studentId: student.id,
      driveId: Number(selectedDriveId),
      vaccinationDate: new Date().toISOString(),
      notes,
    };

    try {
      await mutation.mutateAsync(data);
    } catch (err) {
    }
  };

  const isLoading = drivesLoading || vaccinationsLoading;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'hidden',
        }
      }}
      fullWidth
    >
      <DialogTitle sx={{ 
        bgcolor: 'primary.main', 
        color: 'white',
        fontWeight: 'bold',
        py: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}>
        <MedicalServices />
        Update Vaccination Status
      </DialogTitle>
      
      <DialogContent sx={{ p: 3, pt: 3 }}>
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: 3 
        }}>
          <Paper 
            elevation={1} 
            sx={{ 
              p: 2.5, 
              borderRadius: 2,
              backgroundColor: (theme) => theme.palette.background.default,
              color: 'primary.dark'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle1" fontWeight="medium">
                {student?.name}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                ({student?.studentId})
              </Typography>
            </Box>
            <Typography variant="body2">
              Class: {student?.class}
            </Typography>
          </Paper>
          
          {error && (
            <Alert 
              severity="error" 
              variant="filled" 
              sx={{ borderRadius: 2 }}
            >
              {error}
            </Alert>
          )}
          
          {isLoading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Vaccination Drive</InputLabel>
                <Select
                  value={selectedDriveId}
                  onChange={handleDriveChange}
                  label="Vaccination Drive"
                >
                  <MenuItem value="" disabled>
                    Select Vaccination Drive
                  </MenuItem>
                  {drivesData && drivesData.map((drive: any) => (
                    <MenuItem key={drive.id} value={drive.id.toString()}>
                      {drive.vaccineName} - {new Date(drive.driveDate).toLocaleDateString()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {warningMessage && (
                <Alert 
                  severity="warning" 
                  variant="outlined"
                  sx={{ borderRadius: 2 }}
                >
                  {warningMessage}
                </Alert>
              )}
              
              <TextField
                fullWidth
                label="Medical Notes (Optional)"
                placeholder="Enter any relevant medical information or observations"
                multiline
                rows={3}
                value={notes}
                onChange={handleNotesChange}
                variant="outlined"
              />
              
              <Box sx={{ 
                display: "flex", 
                justifyContent: "flex-end", 
                gap: 2,
                mt: 2 
              }}>
                <Button 
                  variant="outlined" 
                  onClick={onClose}
                  sx={{ borderRadius: 2 }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={mutation.isPending || !selectedDriveId}
                  sx={{ 
                    borderRadius: 2,
                    px: 3
                  }}
                >
                  {mutation.isPending ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Mark as Vaccinated"
                  )}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateVaccinationModal;
