import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Typography,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
  Alert,
  Tooltip
} from "@mui/material";
import {
  Download,
  PictureAsPdf,
  FilterAlt as FilterAltIcon
} from "@mui/icons-material";
import VaccinationReportTable from "../components/VaccinationReportTable";
import { format } from "date-fns";
import { apiRequest } from "../lib/queryClient";

function Reports() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    vaccineType: "",
    studentClass: "",
    vaccinationStatus: "",
    fromDate: "",
    toDate: ""
  });

  // Reference to the VaccinationReportTable component
  const tableRef = useRef<any>(null);

  // Fetch vaccination data with filters
  const { data, isLoading, error } = useQuery({
    queryKey: [
      '/api/vaccinations',
      page,
      rowsPerPage,
      filters.vaccineType,
      filters.studentClass,
      filters.vaccinationStatus,
      filters.fromDate,
      filters.toDate
    ],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/vaccinations?page=${page}&limit=${rowsPerPage}&vaccineType=${filters.vaccineType}&studentClass=${filters.studentClass}&vaccinationStatus=${filters.vaccinationStatus}&fromDate=${filters.fromDate}&toDate=${filters.toDate}`);
      return response.json();
    },
  });


  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(1);
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (value: number) => {
    setRowsPerPage(value);
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({
      vaccineType: "",
      studentClass: "",
      vaccinationStatus: "",
      fromDate: "",
      toDate: ""
    });
    setPage(1);
  };

  const exportToCSV = () => {
    if (!data?.data || !data?.data?.vaccinations || data?.data?.vaccinations.length === 0) return;

    const visibleData = tableRef.current?.getFilteredTableData() || data?.data?.vaccinations;

    const headers = ["Student ID", "Name", "Class", "Vaccine", "Vaccination Date", "Drive ID"];

    const csvRows = [
      headers.join(","),
      ...visibleData.map((item: any) => [
        item.student?.studentId || "",
        item.student?.name || "",
        item.student?.class || "",
        item.drive?.vaccineName || "",
        format(new Date(item.vaccinationDate), "yyyy-MM-dd"),
        `VD${item.drive?.id || ""}`
      ].join(","))
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `vaccination_report_${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = async () => {
    const baseUrl = `http://localhost:5000/api/vaccinations/export-pdf`;
    const queryParams = new URLSearchParams();
    
    if (filters.vaccineType) queryParams.append('vaccineType', filters.vaccineType);
    if (filters.studentClass) queryParams.append('studentClass', filters.studentClass);
    if (filters.fromDate) queryParams.append('fromDate', filters.fromDate);
    if (filters.toDate) queryParams.append('toDate', filters.toDate);
    
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${baseUrl}?${queryParams.toString()}`, {
        method: 'GET',
        credentials: "include",
        headers: {
          'Accept': 'application/pdf',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
     const blob = await response.blob();
     const downloadUrl = window.URL.createObjectURL(blob);
     const link = document.createElement('a');
     link.href = downloadUrl;
     link.download = `vaccination_report_${new Date().toISOString().split('T')[0]}.pdf`;
     document.body.appendChild(link);
     link.click();
     link.remove();
     
     setTimeout(() => {
       window.URL.revokeObjectURL(downloadUrl);
     }, 100);
      
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download the PDF report. Please try again.');
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Vaccination Reports
      </Typography>

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Generate Reports</Typography>
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={exportToCSV}
              disabled={!data?.data || !data?.data?.vaccinations || data?.data?.vaccinations.length === 0}
            >
              Export CSV
            </Button>
            <Button
              variant="outlined"
              startIcon={<PictureAsPdf />}
              onClick={exportToPDF}
              disabled={!data?.data || !data?.data?.vaccinations || data?.data?.vaccinations.length === 0}
            >
              Export PDF
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
          <Box>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Vaccine Type</InputLabel>
              <Select
                value={filters.vaccineType}
                onChange={(e) => handleFilterChange("vaccineType", e.target.value as string)}
                label="Vaccine Type"
              >
                <MenuItem value="">All Vaccines</MenuItem>
                <MenuItem value="MMR">MMR</MenuItem>
                <MenuItem value="Polio">Polio</MenuItem>
                <MenuItem value="Hepatitis B">Hepatitis B</MenuItem>
                <MenuItem value="Influenza">Influenza</MenuItem>
                <MenuItem value="Tetanus">Tetanus</MenuItem>
                <MenuItem value="DTP">DTP</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Class/Grade</InputLabel>
              <Select
                value={filters.studentClass}
                onChange={(e) => handleFilterChange("studentClass", e.target.value as string)}
                label="Class/Grade"
              >
                <MenuItem value="">All Classes</MenuItem>
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
            <FormControl fullWidth variant="outlined">
              <InputLabel>Vaccination Status</InputLabel>
              <Select
                value={filters.vaccinationStatus}
                onChange={(e) => handleFilterChange("vaccinationStatus", e.target.value as string)}
                label="Vaccination Status"
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="vaccinated">Vaccinated</MenuItem>
                <MenuItem value="not_vaccinated">Not Vaccinated</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="From Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={filters.fromDate}
              onChange={(e) => handleFilterChange("fromDate", e.target.value)}
              fullWidth
              size="medium"
            />
            <TextField
              label="To Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={filters.toDate}
              onChange={(e) => handleFilterChange("toDate", e.target.value)}
              fullWidth
              size="medium"
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Tooltip title="Reset all filters">
            <Button
              variant="outlined"
              startIcon={<FilterAltIcon />}
              onClick={resetFilters}
              size="small"
            >
              Reset Filters
            </Button>
          </Tooltip>
        </Box>

        {isLoading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">Error loading vaccination data</Alert>
        ) : (
          <VaccinationReportTable
            ref={tableRef}
            vaccinations={data?.data?.vaccinations || []}
            totalItems={data?.data?.total || 0}
            page={page}
            rowsPerPage={rowsPerPage}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        )}
      </Paper>
    </Box>
  );
}

export default Reports;
