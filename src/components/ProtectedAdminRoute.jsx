import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import AdminPanel from './AdminPanel';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton
} from '@mui/material';
import {
  Logout as LogoutIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';

const ProtectedAdminRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    const authenticated = localStorage.getItem('adminAuthenticated') === 'true';
    const loginTime = localStorage.getItem('adminLoginTime');
    
    if (authenticated && loginTime) {
      // Check if session is still valid (24 hours)
      const sessionAge = Date.now() - parseInt(loginTime);
      const sessionValid = sessionAge < 24 * 60 * 60 * 1000; // 24 hours
      
      if (sessionValid) {
        setIsAuthenticated(true);
      } else {
        // Session expired
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminLoginTime');
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
    
    setIsChecking(false);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminLoginTime');
    setIsAuthenticated(false);
  };

  if (isChecking) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Admin Header */}
      <AppBar position="static" sx={{ backgroundColor: '#1e293b' }}>
        <Toolbar>
          <AdminIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            BankKaro API Admin Panel
          </Typography>
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ textTransform: 'none' }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Admin Panel Content */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <AdminPanel />
      </Box>
    </Box>
  );
};

export default ProtectedAdminRoute; 