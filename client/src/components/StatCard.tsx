import { Box, Paper, Typography, useTheme } from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
  MedicalServices as MedicalIcon,
  Event as EventIcon
} from "@mui/icons-material";

interface StatCardProps {
  type: "primary" | "success" | "warning";
  value: string | number;
  label: string;
}

function StatCard({ type, value, label }: StatCardProps) {
  const theme = useTheme();

  const getColor = () => {
    switch (type) {
      case "primary": return theme.palette.primary.main;
      case "success": return theme.palette.success.main;
      case "warning": return theme.palette.warning.main;
      default: return theme.palette.primary.main;
    }
  };

  const getIcon = () => {
    switch (type) {
      case "primary":
        return label.toLowerCase().includes('student') 
          ? <PersonIcon fontSize="large" /> 
          : <EventIcon fontSize="large" />;
      case "success":
        return <MedicalIcon fontSize="large" />;
      case "warning":
        return <TrendingUpIcon fontSize="large" />;
      default:
        return <PersonIcon fontSize="large" />;
    }
  };

  const getLightColor = () => {
    switch (type) {
      case "primary": return `${theme.palette.primary.main}15`;
      case "success": return `${theme.palette.success.main}15`;
      case "warning": return `${theme.palette.warning.main}15`;
      default: return `${theme.palette.primary.main}15`;
    }
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        height: "100%",
        display: "flex",
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        flexGrow: 1 
      }}>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            color: 'text.secondary',
            fontWeight: 500,
            mb: 1,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          {label}
        </Typography>
        
        <Typography 
          variant="h3" 
          component="div" 
          sx={{ 
            fontWeight: 600,
            color: getColor(),
            lineHeight: 1.2,
            mb: 2
          }}
        >
          {value}
        </Typography>
        
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            mt: 'auto'
          }}
        >
          <Box 
            sx={{ 
              bgcolor: getLightColor(), 
              color: getColor(),
              borderRadius: 1,
              px: 1,
              py: 0.5,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5 }} />
            <Typography variant="caption" fontWeight="bold">
              {type === 'warning' ? 'Rate' : 'Total'}
            </Typography>
          </Box>
        </Box>
      </Box>
      
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center',
          ml: 2,
          p: 2,
          bgcolor: getLightColor(), 
          color: getColor(),
          borderRadius: 2
        }}
      >
        {getIcon()}
      </Box>
    </Paper>
  );
}

export default StatCard;
