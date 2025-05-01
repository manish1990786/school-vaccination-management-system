import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  CircularProgress,
} from "@mui/material";
import { queryClient, apiRequest } from "../lib/queryClient";
import { format } from "date-fns";

interface StudentFormProps {
  student?: any;
  onClose: () => void;
}

function StudentForm({ student, onClose }: StudentFormProps) {
  const isEditMode = !!student;
  
  const [formData, setFormData] = useState({
    studentId: student?.studentId || "",
    name: student?.name || "",
    class: student?.class || "",
    gender: student?.gender || "",
    dateOfBirth: student?.dateOfBirth 
      ? format(new Date(student.dateOfBirth), "yyyy-MM-dd") 
      : "",
    parentName: student?.parentName || "",
    parentContact: student?.parentContact || "",
    address: student?.address || "",
  });
  
  const [error, setError] = useState("");

  // Mutation for creating/updating a student
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (isEditMode) {
        return apiRequest("PUT", `/api/students/${student.id}`, data);
      } else {
        return apiRequest("POST", "/api/students", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      const submitData = {
        ...formData,
        dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
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

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr', md: '1fr 1fr' }, gap: 2 }}>
        <Box>
          <TextField
            fullWidth
            label="Student ID"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            required
            disabled={isEditMode}
          />
        </Box>
        <Box>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Box>
        <Box>
          <FormControl fullWidth required>
            <InputLabel>Class/Grade</InputLabel>
            <Select
              name="class"
              value={formData.class}
              onChange={handleChange as any}
              label="Class/Grade"
            >
              <MenuItem value="Grade 1">Grade 1</MenuItem>
              <MenuItem value="Grade 2">Grade 2</MenuItem>
              <MenuItem value="Grade 3">Grade 3</MenuItem>
              <MenuItem value="Grade 4">Grade 4</MenuItem>
              <MenuItem value="Grade 5">Grade 5</MenuItem>
              <MenuItem value="Grade 6">Grade 6</MenuItem>
              <MenuItem value="Grade 7">Grade 7</MenuItem>
              <MenuItem value="Grade 8">Grade 8</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box>
          <FormControl fullWidth required>
            <InputLabel>Gender</InputLabel>
            <Select
              name="gender"
              value={formData.gender}
              onChange={handleChange as any}
              label="Gender"
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box>
          <TextField
            fullWidth
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
          />
        </Box>
        <Box>
          <TextField
            fullWidth
            label="Parent/Guardian Name"
            name="parentName"
            value={formData.parentName}
            onChange={handleChange}
            required
          />
        </Box>
        <Box>
          <TextField
            fullWidth
            label="Parent Contact"
            name="parentContact"
            value={formData.parentContact}
            onChange={handleChange}
            required
          />
        </Box>
        <Box>
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            multiline
            rows={3}
          />
        </Box>
      </Box>

      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="contained"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <CircularProgress size={24} />
          ) : isEditMode ? (
            "Update Student"
          ) : (
            "Save Student"
          )}
        </Button>
      </Box>
    </Box>
  );
}

export default StudentForm;
