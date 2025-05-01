import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Alert
} from "@mui/material";
import { Add, Delete, CheckCircle } from "@mui/icons-material";
import { queryClient, apiRequest } from "../lib/queryClient";
import DriveTable from "../components/DriveTable";
import VaccinationDriveForm from "../components/VaccinationDriveForm";

function VaccinationDrives() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [openDriveForm, setOpenDriveForm] = useState(false);
  const [editDrive, setEditDrive] = useState<any | null>(null);
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [completeConfirmOpen, setCompleteConfirmOpen] = useState(false);
  const [selectedDriveId, setSelectedDriveId] = useState<number | null>(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null);

  interface VaccinationDriveResponse {
    success: boolean;
    data: {
      drives: any[];
      total: number;
    }
  }

  // Fetch vaccination drives with pagination and search
  const { data, isLoading, error, refetch } = useQuery<VaccinationDriveResponse>({
    queryKey: ["/api/vaccination-drives", page, rowsPerPage, search],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/vaccination-drives?page=${page}&limit=${rowsPerPage}&search=${search}`);
      return response.json();
    },
  });

  // Mutation for deleting a vaccination drive
  const deleteDriveMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/vaccination-drives/${id}`);
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/upcoming-drives"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      
      setAlertType("success");
      setAlertMessage("Vaccination drive deleted successfully");
      
      setTimeout(() => {
        setAlertType(null);
        setAlertMessage("");
      }, 3000);
    },
    onError: (error: any) => {
      setAlertType("error");
      setAlertMessage(error.message || "Failed to delete vaccination drive");
      
      setTimeout(() => {
        setAlertType(null);
        setAlertMessage("");
      }, 5000);
    }
  });

  // Mutation for marking a drive as completed
  const completeDriveMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("POST", `/api/vaccination-drives/${id}/complete`);
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/upcoming-drives"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      
      setAlertType("success");
      setAlertMessage("Vaccination drive marked as completed");
      
      setTimeout(() => {
        setAlertType(null);
        setAlertMessage("");
      }, 3000);
    },
    onError: (error: any) => {
      setAlertType("error");
      setAlertMessage(error.message || "Failed to mark drive as completed");
      
      setTimeout(() => {
        setAlertType(null);
        setAlertMessage("");
      }, 5000);
    }
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleAddDrive = () => {
    setEditDrive(null);
    setOpenDriveForm(true);
  };

  const handleEditDrive = (drive: any) => {
    setEditDrive(drive);
    setOpenDriveForm(true);
  };

  const handleCloseDriveForm = () => {
    setOpenDriveForm(false);
    setEditDrive(null);
    refetch();
  };

  const handleDeleteDrive = (id: number) => {
    setSelectedDriveId(id);
    setDeleteConfirmOpen(true);
  };
  
  const confirmDeleteDrive = async () => {
    if (selectedDriveId !== null) {
      try {
        await deleteDriveMutation.mutateAsync(selectedDriveId);
        setDeleteConfirmOpen(false);
      } catch (error) {
        console.error("Error deleting drive:", error);
      }
    }
  };
  
  const handleCompleteDrive = (id: number) => {
    setSelectedDriveId(id);
    setCompleteConfirmOpen(true);
  };
  
  const confirmCompleteDrive = async () => {
    if (selectedDriveId !== null) {
      try {
        await completeDriveMutation.mutateAsync(selectedDriveId);
        setCompleteConfirmOpen(false);
      } catch (error) {
        console.error("Error completing drive:", error);
      }
    }
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (value: number) => {
    setRowsPerPage(value);
    setPage(1);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Vaccination Drive Management
      </Typography>

      {alertType && (
        <Alert 
          severity={alertType} 
          sx={{ 
            mb: 2, 
            borderRadius: 1,
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
          }}
          variant="filled"
        >
          {alertMessage}
        </Alert>
      )}

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Vaccination Drives</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddDrive}
          >
            Schedule Drive
          </Button>
        </Box>

        <Box sx={{ maxWidth: '600px', mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search by vaccine name, date, or class..."
            variant="outlined"
            value={search}
            onChange={handleSearch}
            size="medium"
          />
        </Box>

        {isLoading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">Error loading vaccination drives</Alert>
        ) : (
          <DriveTable 
            drives={data?.data?.drives || []}
            totalItems={data?.data?.total || 0}
            page={page}
            rowsPerPage={rowsPerPage}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            onEdit={handleEditDrive}
            onDelete={handleDeleteDrive}
            onComplete={handleCompleteDrive}
            showPagination
            allowActions
          />
        )}
      </Paper>

      {/* Vaccination Drive Form Dialog */}
      <Dialog 
        open={openDriveForm} 
        onClose={handleCloseDriveForm}
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: 'hidden',
            width: '100%',
            maxWidth: '550px'
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          fontWeight: 'bold',
          py: 2,
          fontSize: '1.1rem',
          textAlign: 'center'
        }}>
          {editDrive ? "Edit Vaccination Drive" : "Schedule Vaccination Drive"}
        </DialogTitle>
        <DialogContent sx={{ p: 3, pb: 4 }}>
          <VaccinationDriveForm 
            drive={editDrive} 
            onClose={handleCloseDriveForm} 
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 2,
            padding: 1
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1, 
          pt: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: 'error.main'
        }}>
          <Delete color="error" />
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this vaccination drive? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setDeleteConfirmOpen(false)} 
            variant="outlined"
            size="small"
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDeleteDrive} 
            color="error" 
            variant="contained"
            size="small"
            startIcon={<Delete />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Complete Drive Confirmation Dialog */}
      <Dialog
        open={completeConfirmOpen}
        onClose={() => setCompleteConfirmOpen(false)}
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 2,
            padding: 1
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1, 
          pt: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: 'primary.main'
        }}>
          <CheckCircle color="primary" />
          Confirm Action
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to mark this vaccination drive as completed? This will finalize the vaccination records.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setCompleteConfirmOpen(false)} 
            variant="outlined"
            size="small"
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmCompleteDrive} 
            color="primary" 
            variant="contained"
            size="small"
            startIcon={<CheckCircle />}
          >
            Complete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default VaccinationDrives;
