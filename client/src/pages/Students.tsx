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
import { Add, Upload, Delete, Warning } from "@mui/icons-material";
import { queryClient, apiRequest } from "../lib/queryClient";
import StudentTable from "../components/StudentTable";
import StudentForm from "../components/StudentForm";
import ImportCSVModal from "../components/ImportCSVModal";
import UpdateVaccinationModal from "../components/UpdateVaccinationModal";

function Students() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [openStudentForm, setOpenStudentForm] = useState(false);
  const [openImportCSV, setOpenImportCSV] = useState(false);
  const [openVaccinationModal, setOpenVaccinationModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [editStudent, setEditStudent] = useState<any | null>(null);
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null);

  interface StudentResponse {
    success: boolean;
    data: {
      students: any[];
      total: number;
    }
  }

  // Fetch students with pagination and search
  const { data, isLoading, error, refetch } = useQuery<StudentResponse>({
    queryKey: ["/api/students", page, rowsPerPage, search],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/students?page=${page}&limit=${rowsPerPage}&search=${search}`);
      return response.json();
    },
  });

  // Mutation for deleting a student
  const deleteStudentMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/students/${id}`);
    },
    onSuccess: () => {
      refetch();
    
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      
      setAlertType("success");
      setAlertMessage("Student deleted successfully");
      
      setTimeout(() => {
        setAlertType(null);
        setAlertMessage("");
      }, 3000);
    },
    onError: (error: any) => {
      setAlertType("error");
      setAlertMessage(error.message || "Failed to delete student");
      
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

  const handleAddStudent = () => {
    setEditStudent(null);
    setOpenStudentForm(true);
  };

  const handleEditStudent = (student: any) => {
    setEditStudent(student);
    setOpenStudentForm(true);
  };

  const handleCloseStudentForm = () => {
    setOpenStudentForm(false);
    setEditStudent(null);
    refetch();
  };

  const handleOpenImportCSV = () => {
    setOpenImportCSV(true);
  };

  const handleCloseImportCSV = () => {
    setOpenImportCSV(false);
    refetch();
  };

  const handleUpdateVaccination = (student: any) => {
    setSelectedStudent(student);
    setOpenVaccinationModal(true);
  };

  const handleCloseVaccinationModal = () => {
    setOpenVaccinationModal(false);
    setSelectedStudent(null);
    refetch();
  };

  const handleDeleteStudent = (id: number) => {
    setSelectedStudentId(id);
    setDeleteConfirmOpen(true);
  };
  
  const confirmDeleteStudent = async () => {
    if (selectedStudentId !== null) {
      try {
        await deleteStudentMutation.mutateAsync(selectedStudentId);
        setDeleteConfirmOpen(false);
      } catch (error) {
        console.error("Error deleting student:", error);
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
        Student Management
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
          <Typography variant="h6">Students</Typography>
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              startIcon={<Upload />}
              onClick={handleOpenImportCSV}
            >
              Import CSV
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddStudent}
            >
              Add Student
            </Button>
          </Box>
        </Box>

        <Box sx={{ maxWidth: '600px', mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search by name, class, ID, or vaccination status..."
            variant="outlined"
            value={search}
            onChange={handleSearch}
          />
        </Box>

        {isLoading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">Error loading students</Alert>
        ) : (
          <StudentTable 
            students={data?.data?.students || []}
            totalItems={data?.data?.total || 0}
            page={page}
            rowsPerPage={rowsPerPage}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            onEdit={handleEditStudent}
            onDelete={handleDeleteStudent}
            onUpdateVaccination={handleUpdateVaccination}
          />
        )}
      </Paper>

      <Dialog 
        open={openStudentForm} 
        onClose={handleCloseStudentForm}
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
          py: 2
        }}>
          {editStudent ? "Edit Student" : "Add New Student"}
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 3 }}>
          <StudentForm 
            student={editStudent} 
            onClose={handleCloseStudentForm} 
          />
        </DialogContent>
      </Dialog>

      <ImportCSVModal
        open={openImportCSV}
        onClose={handleCloseImportCSV}
      />

      {/* Update Vaccination Modal */}
      {selectedStudent && (
        <UpdateVaccinationModal
          open={openVaccinationModal}
          onClose={handleCloseVaccinationModal}
          student={selectedStudent}
        />
      )}

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
          <Warning color="error" />
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this student? This will also remove all associated vaccination records and cannot be undone.
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
            onClick={confirmDeleteStudent} 
            color="error" 
            variant="contained"
            size="small"
            startIcon={<Delete />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Students;
