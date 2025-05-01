import { useLocation, NavLink } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  useTheme,
  useMediaQuery,
  Avatar
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Event as EventIcon,
  Assessment as AssessmentIcon,
  MedicalServices as MedicalIcon
} from "@mui/icons-material";

interface SidebarProps {
  open: boolean;
  onClose?: () => void;
}

function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const drawerWidth = 240;

  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
    },
    {
      text: "Students",
      icon: <PeopleIcon />,
      path: "/students",
    },
    {
      text: "Vaccination Drives",
      icon: <EventIcon />,
      path: "/vaccination-drives",
    },
    {
      text: "Reports",
      icon: <AssessmentIcon />,
      path: "/reports",
    },
  ];

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? drawerWidth : 0,
        flexShrink: 0,
        position: 'fixed',
        display: open ? 'block' : 'none',
        zIndex: theme.zIndex.drawer,
        "& .MuiDrawer-paper": {
          position: 'fixed',
          width: drawerWidth,
          boxSizing: "border-box",
          top: isMobile ? "56px" : "64px",
          height: `calc(100% - ${isMobile ? '56px' : '64px'})`,
          borderRight: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          boxShadow: '2px 0 10px rgba(0, 0, 0, 0.05)',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          mb: 1
        }}>
          <Avatar 
            sx={{ 
              width: 60, 
              height: 60, 
              bgcolor: theme.palette.primary.main,
              mb: 1
            }}
          >
            <MedicalIcon fontSize="large" />
          </Avatar>
          <Typography variant="h6" align="center" sx={{ fontWeight: 'bold' }}>
            Vaccination Portal
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            School Health Management
          </Typography>
        </Box>
        
        <Divider />
        
        <Box sx={{ overflow: "auto", flexGrow: 1 }}>
          <List sx={{ py: 1 }}>
            {menuItems.map((item) => {
              const isSelected = location.pathname === item.path;
              
              return (
                <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                  <NavLink
                    to={item.path}
                    onClick={() => {
                      if (onClose) {
                        onClose();
                      }
                    }}
                    style={{ textDecoration: 'none', width: '100%' }}
                  >
                    <ListItemButton
                      selected={isSelected}
                      sx={{
                        borderRadius: '8px',
                        mx: 1,
                        "&.Mui-selected": {
                          backgroundColor: `${theme.palette.primary.main}15`,
                          "&:hover": {
                            backgroundColor: `${theme.palette.primary.main}25`,
                          },
                        },
                        "&:hover": {
                          backgroundColor: theme.palette.action.hover,
                        },
                      }}
                    >
                      <ListItemIcon 
                        sx={{ 
                          color: isSelected ? theme.palette.primary.main : theme.palette.text.secondary,
                          minWidth: '40px' 
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.text} 
                        primaryTypographyProps={{ 
                          color: isSelected ? theme.palette.primary.main : theme.palette.text.primary,
                          fontWeight: isSelected ? 600 : 400,
                        }}
                      />
                    </ListItemButton>
                  </NavLink>
                </ListItem>
              );
            })}
          </List>
        </Box>
        
        <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="caption" color="text.secondary" display="block" align="center">
            © 2025 School Vaccination System
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
}

export default Sidebar;
