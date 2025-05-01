import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Link,
  Paper,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Upload as UploadIcon, Download as DownloadIcon } from "@mui/icons-material";
import { queryClient } from "../lib/queryClient";

interface ImportCSVModalProps {
  open: boolean;
  onClose: () => void;
}

function ImportCSVModal({ open, onClose }: ImportCSVModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [importResults, setImportResults] = useState<{success: boolean, data: {success: number; failed: number }} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const importMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:5000/api/students/import-csv", {
        method: "POST",
        body: formData,
        credentials: "include",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || response.statusText);
      }
      
      return response.json();
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      setImportResults(result);
    },
    onError: (error: any) => {
      setError(error.message || "Failed to import students");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError("");
      setImportResults(null);
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError("Please select a CSV file");
      return;
    }
    try {
      await importMutation.mutateAsync(file);
    } catch (err) {
    }
  };

  const downloadTemplate = () => {
    const headers = "studentId,name,class,gender,dateOfBirth,parentName,parentContact,address";
    const sampleData = "S10001,John Doe,Grade 5,Male,2015-05-10,Jane Doe,9876543210,123 Main St";
    const csvContent = `${headers}\n${sampleData}`;
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "student_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
        py: 2
      }}>
        Import Students from CSV
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
              color: 'info.dark',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1.5
            }}
          >
            <Box component="span" sx={{ pt: 0.5 }}>ℹ️</Box>
            <Box>
              <Typography variant="subtitle2" fontWeight="medium" sx={{ mb: 0.5 }}>
                CSV Format Guidelines
              </Typography>
              <Typography variant="body2">
                Your CSV file should contain these columns: <b>studentId</b>, <b>name</b>, <b>class</b>, <b>gender</b>, <b>dateOfBirth</b>, <b>parentName</b>, <b>parentContact</b>, <b>address</b>
              </Typography>
            </Box>
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
          
          {importResults?.data && (
            <Alert 
              severity="success" 
              variant="filled" 
              sx={{ borderRadius: 2 }}
            >
              <Typography variant="subtitle2" fontWeight="bold">
                Import completed successfully!
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2">• {importResults?.data?.success} students imported successfully</Typography>
                {importResults?.data?.failed > 0 && (
                  <Typography variant="body2">• {importResults?.data?.failed} records failed to import</Typography>
                )}
              </Box>
            </Alert>
          )}
          
          <Paper 
            elevation={1} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              border: '2px dashed',
              borderColor: 'divider',
              backgroundColor: 'background.paper',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            
            <Box sx={{ 
              width: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: 2 
            }}>
              <UploadIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.7 }} />
              
              {file ? (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  textAlign: 'center' 
                }}>
                  <Typography variant="subtitle1" fontWeight="medium" color="primary">
                    {file.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {(file.size / 1024).toFixed(2)} KB • CSV
                  </Typography>
                  <Button
                    color="error"
                    variant="text"
                    size="small"
                    onClick={() => setFile(null)}
                    sx={{ mt: 1 }}
                  >
                    Remove file
                  </Button>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    Drag and drop your CSV file here
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    or click the button below to browse files
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<UploadIcon />}
                    onClick={() => fileInputRef.current?.click()}
                    sx={{ borderRadius: 2 }}
                  >
                    Select CSV File
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link 
              component="button" 
              onClick={downloadTemplate}
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 1,
                color: 'primary.main',
                fontWeight: 'medium',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              <DownloadIcon fontSize="small" />
              Download Sample CSV Template
            </Link>
            
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={onClose}
                sx={{ borderRadius: 2 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleImport}
                disabled={!file || importMutation?.data?.isPending}
                sx={{ 
                  borderRadius: 2,
                  px: 3 
                }}
              >
                {importMutation?.data?.isPending ? (
                  <CircularProgress size={24} />
                ) : (
                  "Import Students"
                )}
              </Button>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default ImportCSVModal;
