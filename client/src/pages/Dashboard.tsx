import { useQuery } from "@tanstack/react-query";
import { Box, Typography, Paper, Button } from "@mui/material";
import { 
  Add, 
  Event as EventIcon,
  MedicalServices as MedicalIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import StatCard from "../components/StatCard";
import DriveTable from "../components/DriveTable";
import { Alert, CircularProgress } from "@mui/material";
import { DashboardStats, VaccinationDrivesResponse } from "../shared/schema";
import { 
  BarChart, Bar, PieChart, Pie, 
  Cell, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, CartesianGrid
} from 'recharts';

interface VaccinationItem {
  id: number;
  vaccinationDate: string;
  notes?: string;
  student: {
    id: number;
    studentId: string;
    name: string;
    class: string;
    gender: string;
    dateOfBirth: string;
    parentName: string;
    parentContact: string;
    address: string;
  };
  drive: {
    id: number;
    vaccineName: string;
    driveDate: string;
    availableDoses: number;
    usedDoses: number;
    applicableClasses: string;
    notes: string;
    isCompleted: boolean;
  };
}

interface VaccinationsResponse {
  success: boolean;
  data: {
    vaccinations: VaccinationItem[];
    total: number;
  };
  total: number;
}

interface VaccineStatItem {
  vaccineName: string;
  count: number;
}

interface ClassStatItem {
  class: string;
  count: number;
}

interface VaccinationStatsResponse {
  success: boolean;
  data: {
    vaccineStats: VaccineStatItem[];
    classStats: ClassStatItem[];
  }
}

const CHART_COLORS = [
  '#3f51b5', // Primary
  '#4caf50', // Success
  '#ff9800', // Warning
  '#f44336', // Error
  '#9c27b0', // Purple
  '#00bcd4', // Cyan
  '#8bc34a', // Light Green
  '#ffc107', // Amber
  '#795548', // Brown
  '#607d8b', // Blue Grey
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Paper
        elevation={2}
        sx={{
          p: 1.5,
          backgroundColor: 'background.paper',
          boxShadow: '0px 2px 8px rgba(0,0,0,0.15)',
          borderRadius: 1
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
          {label}
        </Typography>
        {payload.map((entry: any, index: number) => (
          <Box
            key={`item-${index}`}
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              mb: 0.5,
              '&:last-child': { mb: 0 }
            }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: entry.color,
                mr: 1
              }}
            />
            <Typography variant="body2" color="text.secondary">
              {entry.name}: {entry.value}
            </Typography>
          </Box>
        ))}
      </Paper>
    );
  }
  return null;
};

function Dashboard() {
  const navigate = useNavigate();

  // Fetch dashboard stats
  const { data: statsData, isLoading: statsLoading, error: statsError } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  // Fetch upcoming vaccination drives
  const { data: drivesData, isLoading: drivesLoading, error: drivesError } = useQuery<VaccinationDrivesResponse>({
    queryKey: ["/api/vaccination-drives/upcoming"],
  });

  // Fetch recent vaccinations (last 5)
  const { data: vaccinationsData, isLoading: vaccinationsLoading, error: vaccinationsError } = useQuery<VaccinationsResponse>({
    queryKey: ["/api/vaccinations?limit=5"],
  });
  
  // Fetch vaccination statistics for charts
  const { data: vaccinationStats, isLoading: statsChartLoading, error: statsChartError } = useQuery<VaccinationStatsResponse>({
    queryKey: ["/api/dashboard/vaccination-stats"],
  });
  

  const navigateToVaccinationDrives = () => {
    navigate("/vaccination-drives");
  };

  const navigateToReports = () => {
    navigate("/reports");
  };

  const isLoading = statsLoading || drivesLoading || vaccinationsLoading || statsChartLoading;
  const hasError = statsError || drivesError || vaccinationsError || statsChartError;

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (hasError) {
    return (
      <Alert severity="error">
        Error loading dashboard data. Please try again later.
      </Alert>
    );
  }

  return (
    <Box sx={{ px: { xs: 1.5, sm: 2 }, py: 2 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4
      }}>
        <Box>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 'bold',
              mb: 1 
            }}
          >
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome to the vaccination portal management dashboard
          </Typography>
        </Box>
        <Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={navigateToVaccinationDrives}
            sx={{ 
              borderRadius: 2,
              px: 3,
              py: 1,
              boxShadow: 'none'
            }}
          >
            Manage Vaccination Drives
          </Button>
        </Box>
      </Box>

      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(4, 1fr)' 
          },
          gap: 2,
          mb: 3
        }}
      >
        <Box>
          <StatCard
            type="primary"
            value={statsData?.data?.totalStudents || 0}
            label="Total Students"
          />
        </Box>
        <Box>
          <StatCard
            type="success"
            value={statsData?.data?.vaccinatedStudents || 0}
            label="Vaccinated Students"
          />
        </Box>
        <Box>
          <StatCard
            type="warning"
            value={`${statsData?.data?.vaccinationPercentage || 0}%`}
            label="Vaccination Rate"
          />
        </Box>
        <Box>
          <StatCard
            type="primary"
            value={statsData?.data?.upcomingDrives || 0}
            label="Upcoming Drives"
          />
        </Box>
      </Box>

      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '7fr 5fr'
          },
          gap: 2
        }}
      >
        {/* Upcoming Drives Section */}
        <Paper 
          elevation={1} 
          sx={{ 
            p: 2.5, 
            borderRadius: 2,
            height: '100%'
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 3,
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            pb: 2
          }}>
            <Typography variant="h6" fontWeight="bold">Upcoming Vaccination Drives</Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Add />}
              onClick={navigateToVaccinationDrives}
              sx={{ borderRadius: 8 }}
            >
              Manage Drives
            </Button>
          </Box>

          {drivesData?.data && drivesData.data.length > 0 ? (
            <DriveTable drives={drivesData.data} />
          ) : (
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                py: 6
              }}
            >
              <EventIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" align="center">
                No upcoming drives
              </Typography>
              <Typography variant="body2" color="text.disabled" align="center" sx={{ mb: 3 }}>
                Schedule new vaccination drives to manage your school health program
              </Typography>
              <Button
                variant="contained"
                size="medium"
                startIcon={<Add />}
                onClick={navigateToVaccinationDrives}
              >
                Manage Vaccination Drives
              </Button>
            </Box>
          )}
        </Paper>

        {/* Recent Vaccinations Section */}
        <Paper 
          elevation={1} 
          sx={{ 
            p: 2.5,
            borderRadius: 2,
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 3,
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            pb: 2
          }}>
            <Typography variant="h6" fontWeight="bold">Recent Vaccinations</Typography>
            <Button 
              variant="text" 
              endIcon={<Box component="span" sx={{ fontSize: '1.2rem' }}>→</Box>}
              onClick={navigateToReports}
              sx={{ 
                color: 'primary.main', 
                fontWeight: 'medium',
                '&:hover': {
                  backgroundColor: 'transparent',
                  transform: 'translateX(2px)'
                }
              }}
            >
              View All
            </Button>
          </Box>

          {vaccinationsData && vaccinationsData?.data?.vaccinations && vaccinationsData?.data?.vaccinations.length > 0 ? (
            <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
              <Box 
                component="table" 
                sx={{ 
                  width: '100%', 
                  borderCollapse: 'separate', 
                  borderSpacing: 0,
                  '& th, & td': {
                    px: 2,
                    py: 1.5,
                    '&:first-of-type': {
                      borderTopLeftRadius: 8,
                      borderBottomLeftRadius: 8,
                    },
                    '&:last-of-type': {
                      borderTopRightRadius: 8,
                      borderBottomRightRadius: 8,
                    },
                  }
                }}
              >
                <Box component="thead">
                  <Box component="tr">
                    <Box component="th" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.875rem' }}>
                      Student
                    </Box>
                    <Box component="th" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.875rem' }}>
                      Vaccine
                    </Box>
                    <Box component="th" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.875rem' }}>
                      Date
                    </Box>
                  </Box>
                </Box>
                <Box component="tbody">
                  {vaccinationsData?.data?.vaccinations.map((vaccination) => (
                    <Box 
                      component="tr" 
                      key={vaccination.id}
                      sx={{ 
                        '&:hover td': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)'
                        }
                      }}
                    >
                      <Box component="td" sx={{ mb: 1 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="body2" fontWeight="medium">
                            {vaccination.student.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {vaccination.student.class} • {vaccination.student.studentId}
                          </Typography>
                        </Box>
                      </Box>
                      <Box component="td">
                        <Typography variant="body2">
                          {vaccination.drive.vaccineName}
                        </Typography>
                      </Box>
                      <Box component="td">
                        <Box 
                          sx={{ 
                            display: 'inline-flex',
                            bgcolor: 'primary.light',
                            color: 'primary.dark',
                            borderRadius: 1,
                            px: 1,
                            py: 0.5,
                            fontSize: '0.75rem',
                            fontWeight: 'medium'
                          }}
                        >
                          {new Date(vaccination.vaccinationDate).toLocaleDateString()}
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          ) : (
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexGrow: 1,
                py: 4
              }}
            >
              <MedicalIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" align="center">
                No vaccinations recorded
              </Typography>
              <Typography variant="body2" color="text.disabled" align="center" sx={{ mb: 2 }}>
                Records will appear here once students are vaccinated
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Charts Section */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
          Vaccination Analytics
        </Typography>

        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, 1fr)'
            },
            gap: 3
          }}
        >
          {/* Vaccine Distribution Chart */}
          <Paper 
            elevation={1}
            sx={{ 
              p: 2.5, 
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 1.5,
              pb: 1,
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`
            }}>
              <PieChartIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" fontWeight="bold">
                Vaccine Distribution
              </Typography>
            </Box>

            {vaccinationStats?.data?.vaccineStats && vaccinationStats?.data?.vaccineStats.length > 0 ? (
              <Box>
                <Box sx={{ height: 240, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={vaccinationStats?.data?.vaccineStats.map(item => ({
                          ...item,
                          count: Number(item.count)
                        }))}
                        dataKey="count"
                        nameKey="vaccineName"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                      >
                        {vaccinationStats?.data?.vaccineStats.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={CHART_COLORS[index % CHART_COLORS.length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} doses`, 'Count']} />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  justifyContent: 'center',
                  maxHeight: '80px',
                  overflowY: 'auto',
                  mt: 1
                }}>
                  {vaccinationStats?.data?.vaccineStats.map((item, index) => (
                    <Box 
                      key={`legend-${index}`} 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mr: 2, 
                        mb: 0.5
                      }}
                    >
                      <Box 
                        sx={{ 
                          width: 10, 
                          height: 10, 
                          backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                          borderRadius: '2px',
                          mr: 1
                        }} 
                      />
                      <Typography variant="caption" color="text.secondary">
                        {item.vaccineName} ({item.count})
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            ) : (
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  py: 3,
                  height: 200
                }}
              >
                <PieChartIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                <Typography variant="subtitle1" color="text.secondary" align="center">
                  No vaccination data
                </Typography>
                <Typography variant="caption" color="text.disabled" align="center">
                  Data will appear once students are vaccinated
                </Typography>
              </Box>
            )}
          </Paper>

          <Paper 
            elevation={1}
            sx={{ 
              p: 2.5, 
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 1.5,
              pb: 1,
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`
            }}>
              <BarChartIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" fontWeight="bold">
                Vaccinations by Class
              </Typography>
            </Box>

            {vaccinationStats?.data?.classStats && vaccinationStats?.data?.classStats.length > 0 ? (
              <Box>
                <Box sx={{ height: 240, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={vaccinationStats?.data?.classStats.map(item => ({
                        class: item.class,
                        count: Number(item.count)
                      }))}
                      margin={{ top: 20, right: 20, left: 20, bottom: 50 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="class" 
                        angle={-45} 
                        textAnchor="end"
                        height={50}
                        tick={{ fontSize: 10 }}
                      />
                      <YAxis 
                        allowDecimals={false}
                        tick={{ fontSize: 10 }}
                      />
                      <Tooltip formatter={(value) => [`${value} students`, 'Vaccinations']}/>
                      <Bar 
                        dataKey="count" 
                        name="Vaccinations"
                        fill={CHART_COLORS[0]}
                        radius={[4, 4, 0, 0]}
                      >
                        {vaccinationStats?.data?.classStats.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={CHART_COLORS[index % CHART_COLORS.length]} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  justifyContent: 'center',
                  maxHeight: '80px',
                  overflowY: 'auto',
                  mt: 1 
                }}>
                  {vaccinationStats?.data?.classStats.map((item, index) => (
                    <Box 
                      key={`legend-${index}`} 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mr: 2, 
                        mb: 0.5 
                      }}
                    >
                      <Box 
                        sx={{ 
                          width: 10, 
                          height: 10, 
                          backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                          borderRadius: '2px',
                          mr: 1
                        }} 
                      />
                      <Typography variant="caption" color="text.secondary">
                        {item.class} ({item.count})
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            ) : (
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  py: 3,
                  height: 200
                }}
              >
                <BarChartIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                <Typography variant="subtitle1" color="text.secondary" align="center">
                  No class vaccination data
                </Typography>
                <Typography variant="caption" color="text.disabled" align="center">
                  Data will appear once students are vaccinated
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
