import { useState, useEffect } from "react";
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  CircularProgress,
  Alert
} from "@mui/material";
import { LocalHospital } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(formData.username, formData.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setIsLoading(false);
    }
  };

  // Direct login for development/testing
  const handleDirectLogin = async () => {
    setFormData({ username: "admin", password: "admin123" });
    setIsLoading(true);
    
    try {
      await login("admin", "admin123");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Card sx={{ maxWidth: 400, width: "100%", p: 3 }}>
        <CardContent>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <LocalHospital sx={{ fontSize: 64, color: "#1976d2" }} />
            <Typography variant="h5" component="h1" sx={{ mt: 2 }}>
              School Vaccination Portal
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              margin="normal"
              required
              autoFocus
              InputLabelProps={{ 
                shrink: true,
                sx: { background: 'white', px: 1 }
              }}
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              InputLabelProps={{ 
                shrink: true,
                sx: { background: 'white', px: 1 }
              }}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{ mt: 3 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : "Login"}
            </Button>
            
            <Button
              fullWidth
              variant="text"
              color="primary"
              onClick={handleDirectLogin}
              sx={{ mt: 2 }}
              disabled={isLoading}
            >
              Login as Admin (for testing)
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;
