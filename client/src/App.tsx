import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import VaccinationDrives from "./pages/VaccinationDrives";
import Reports from "./pages/Reports";
import NotFound from "./pages/not-found";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Alert, Box, Snackbar } from "@mui/material";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

function Router() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAuthenticated && location.pathname !== "/login") {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/students" element={<Students />} />
      <Route path="/vaccination-drives" element={<VaccinationDrives />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const location = useLocation();

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  if (location.pathname === "/login" || !isAuthenticated) {
    return <Router />;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Header toggleDrawer={toggleDrawer} />
      <Sidebar open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { 
            xs: '100%', 
            sm: `calc(100% - ${isDrawerOpen ? '240px' : '0px'})` 
          },
          mt: { xs: '56px', sm: '64px' },
          p: { xs: 2, sm: 3 },
          ml: { xs: 0, sm: isDrawerOpen ? '240px' : 0 },
          transition: (theme) => theme.transitions.create(['width', 'margin', 'margin-left'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          overflow: 'auto'
        }}
      >
        <Router />
      </Box>
    </Box>
  );
}

function App() {
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
    open: boolean;
  }>({
    message: "",
    type: "info",
    open: false,
  });

  const closeNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
          <Snackbar
            open={notification.open}
            autoHideDuration={6000}
            onClose={closeNotification}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert
              onClose={closeNotification}
              severity={notification.type}
              sx={{ width: "100%" }}
            >
              {notification.message}
            </Alert>
          </Snackbar>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
