import { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  useTheme,
  useMediaQuery,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper
} from '@mui/material';
import {
  Api as ApiIcon,
  Menu as MenuIcon,
  Code as CodeIcon,
  Dashboard as DashboardIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiData, projects } from '../data/apiData';

const drawerWidth = 320;

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState('bankkaro');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleApiSelect = (endpoint) => {
    navigate(`/docs/${endpoint}`);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleDashboardSelect = () => {
    const dashboardPath = selectedProject === 'cardGenius' ? '/cardgenius-dashboard' : '/loangenius-dashboard';
    navigate(dashboardPath);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleProjectChange = (event) => {
    const newProject = event.target.value;
    setSelectedProject(newProject);
    
    if (newProject === 'cardGenius') {
      navigate('/cardgenius-dashboard');
    } else {
      navigate('/loangenius-dashboard');
    }
    
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const currentProject = projects[selectedProject];
  const currentApis = currentProject.apis;

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc'
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
          {currentProject.name} API Docs
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {currentProject.description}
        </Typography>
      </Paper>
      
      {/* Project Switcher */}
      <Box sx={{ p: 3, borderBottom: '1px solid #e2e8f0' }}>
        <FormControl fullWidth size="small">
          <InputLabel sx={{ fontWeight: 500 }}>Project</InputLabel>
          <Select
            value={selectedProject}
            label="Project"
            onChange={handleProjectChange}
            sx={{ 
              '& .MuiSelect-select': { 
                display: 'flex', 
                alignItems: 'center',
                fontWeight: 500
              }
            }}
          >
            <MenuItem value="bankkaro">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BusinessIcon fontSize="small" />
                BankKaro
              </Box>
            </MenuItem>
            <MenuItem value="cardGenius">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ApiIcon fontSize="small" />
                CardGenius
              </Box>
            </MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {/* Navigation Items */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <List sx={{ py: 0 }}>
          {/* Dashboard */}
          {currentProject.dashboard && (
            <ListItem disablePadding>
              <ListItemButton
                selected={location.pathname.includes('dashboard')}
                onClick={handleDashboardSelect}
                sx={{
                  mx: 2,
                  my: 0.5,
                  borderRadius: 2,
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.light,
                    color: theme.palette.primary.contrastText,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.light,
                    },
                  },
                  '&:hover': {
                    backgroundColor: '#f1f5f9',
                  },
                }}
              >
                <ListItemIcon>
                  <DashboardIcon 
                    color={location.pathname.includes('dashboard') ? 'inherit' : 'primary'} 
                  />
                </ListItemIcon>
                <ListItemText 
                  primary="Dashboard"
                  primaryTypographyProps={{
                    fontSize: '0.95rem',
                    fontWeight: location.pathname.includes('dashboard') ? 'bold' : 500
                  }}
                />
              </ListItemButton>
            </ListItem>
          )}
          
          {/* API Endpoints */}
          {Object.keys(currentApis).length > 0 && (
            <>
              <Box sx={{ px: 3, py: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                  {currentProject.name} APIs
                </Typography>
              </Box>
              {Object.entries(currentApis).map(([key, api]) => {
                const isSelected = location.pathname === `/docs/${key}`;
                return (
                  <ListItem key={key} disablePadding>
                    <ListItemButton
                      selected={isSelected}
                      onClick={() => handleApiSelect(key)}
                      sx={{
                        mx: 2,
                        my: 0.5,
                        borderRadius: 2,
                        '&.Mui-selected': {
                          backgroundColor: theme.palette.primary.light,
                          color: theme.palette.primary.contrastText,
                          '&:hover': {
                            backgroundColor: theme.palette.primary.light,
                          },
                        },
                        '&:hover': {
                          backgroundColor: '#f1f5f9',
                        },
                      }}
                    >
                      <ListItemIcon>
                        <CodeIcon color={isSelected ? 'inherit' : 'primary'} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={api.name}
                        secondary={api.endpoint}
                        primaryTypographyProps={{
                          fontSize: '0.95rem',
                          fontWeight: isSelected ? 'bold' : 500
                        }}
                        secondaryTypographyProps={{
                          fontSize: '0.75rem',
                          fontFamily: 'monospace'
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </>
          )}
          
          {/* Coming Soon for CardGenius */}
          {selectedProject === 'cardGenius' && Object.keys(currentApis).length === 0 && (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                APIs coming soon...
              </Typography>
            </Box>
          )}
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: '#ffffff',
          color: '#1e293b',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          borderBottom: '1px solid #e2e8f0'
        }}
      >
        <Toolbar sx={{ minHeight: 70 }}>
          {isMobile && (
            <Box sx={{ mr: 2 }}>
              <MenuIcon 
                onClick={handleDrawerToggle} 
                sx={{ cursor: 'pointer', fontSize: 28 }} 
              />
            </Box>
          )}
          <ApiIcon sx={{ mr: 2, fontSize: 28, color: 'primary.main' }} />
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            {currentProject.name} API Documentation
          </Typography>
          
          {/* Project Switcher in AppBar for mobile */}
          {isMobile && (
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={selectedProject}
                onChange={handleProjectChange}
                sx={{ 
                  color: 'primary.main',
                  fontWeight: 500,
                  '& .MuiSelect-icon': { color: 'primary.main' }
                }}
              >
                <MenuItem value="bankkaro">BankKaro</MenuItem>
                <MenuItem value="cardGenius">CardGenius</MenuItem>
              </Select>
            </FormControl>
          )}
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: drawerWidth,
                border: 'none'
              },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: drawerWidth,
                border: 'none',
                backgroundColor: '#ffffff'
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        )}
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: '70px',
          backgroundColor: '#f8fafc',
          minHeight: 'calc(100vh - 70px)'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 