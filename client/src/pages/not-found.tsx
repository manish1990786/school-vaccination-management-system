import { Card, CardContent, Box, Typography } from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";

export default function NotFound() {
  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        width: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        bgcolor: '#f9fafb' 
      }}
    >
      <Card sx={{ width: '100%', maxWidth: '500px', mx: 2 }}>
        <CardContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', mb: 2, gap: 1, alignItems: 'center' }}>
            <ErrorOutline color="error" sx={{ fontSize: 32 }} />
            <Typography variant="h5" fontWeight="bold" color="text.primary">
              404 Page Not Found
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Did you forget to add the page to the router?
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
