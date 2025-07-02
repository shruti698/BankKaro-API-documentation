import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Container,
  Card,
  CardContent,
  useTheme
} from '@mui/material';
import {
  Lock as LockIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  // Simple password - you can change this to any password you want
  const ADMIN_PASSWORD = 'BankKaro@151085';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    if (password === ADMIN_PASSWORD) {
      // Store admin session in localStorage
      localStorage.setItem('adminAuthenticated', 'true');
      localStorage.setItem('adminLoginTime', Date.now().toString());
      onLogin();
      navigate('/admin');
    } else {
      setError('Invalid password. Please try again.');
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <Card sx={{ 
          width: '100%', 
          maxWidth: 400,
          borderRadius: 3,
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)'
        }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <AdminIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Admin Access
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Enter password to access the admin panel
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                type="password"
                label="Admin Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 3 }}
                required
                autoFocus
              />

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={loading ? null : <LockIcon />}
                sx={{ 
                  py: 1.5, 
                  fontWeight: 'bold',
                  fontSize: '1.1rem'
                }}
              >
                {loading ? 'Authenticating...' : 'Access Admin Panel'}
              </Button>
            </form>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Need help? Contact your system administrator
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default AdminLogin; 