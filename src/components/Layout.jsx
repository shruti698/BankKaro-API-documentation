import { useState, useEffect } from 'react';
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
  IconButton,
  Button,
  Menu,
  MenuItem,
  Paper,
  CircularProgress,
  Alert,
  Container
} from '@mui/material';
import {
  Api as ApiIcon,
  Menu as MenuIcon,
  Code as CodeIcon,
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  School as SchoolIcon,
  Home as HomeIcon,
  CreditCard as CreditCardIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { getApiBaseUrl } from '../config/environments';

const API_BASE_URL = getApiBaseUrl();
const drawerWidth = 280;

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState('cardGenius');
  const [anchorEl, setAnchorEl] = useState(null);
  const [endpoints, setEndpoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Fetch endpoints from admin API
  useEffect(() => {
    const fetchEndpoints = async () => {
      try {
        setLoading(true);
        
        if (!API_BASE_URL) {
          setError('API server not configured. Please start the local server.');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/endpoints`);
        if (!response.ok) {
          throw new Error('Failed to fetch endpoints from server');
        }
        const data = await response.json();

        // Convert object to array format
        const endpointsArray = Object.entries(data)
          .sort((a, b) => {
            // Sort by rank first, then FIFO for equal ranks
            const rankA = a[1].rank || 999; // Default high rank for unranked items
            const rankB = b[1].rank || 999;
            
            if (rankA !== rankB) {
              return rankA - rankB; // Lower rank numbers appear first
            }
            
            // If ranks are equal, maintain FIFO order (return 0)
            return 0;
          })
          .map(([id, endpointData]) => ({
            id,
            name: endpointData.name,
            endpoint: endpointData.endpoint,
            description: endpointData.description,
            category: endpointData.category,
            products: endpointData.products || (endpointData.category === 'Partner APIs' ? ['Loan Genius', 'Card Genius'] : ['Card Genius']),
            methods: endpointData.methods,
            purpose: endpointData.purpose
          }));

        console.log('Layout - Server endpoints array:', endpointsArray.map(ep => ep.id));
        console.log('Layout - First few endpoint details:', endpointsArray.slice(0, 3).map(ep => ({ id: ep.id, name: ep.name, endpoint: ep.endpoint })));
        console.log('Layout - All endpoint IDs:', endpointsArray.map(ep => ep.id));
        setEndpoints(endpointsArray);
      } catch (err) {
        console.error('Failed to fetch endpoints:', err.message);
        setError('Failed to load endpoints from server. Please ensure the local server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchEndpoints();
  }, []);

  // Organize endpoints by product
  const organizeEndpointsByProduct = () => {
    const organized = {
      'Loan Genius': [],
      'Card Genius': [],
      'Education Genius': []
    };


    
    // Ensure endpoints is an array
    if (!Array.isArray(endpoints)) {
      console.warn('Layout - endpoints is not an array, using empty array');
      return organized;
    }

    endpoints.forEach(endpoint => {
      const products = endpoint.products || [endpoint.product];
      products.forEach(product => {
        if (organized[product]) {
          organized[product].push(endpoint);
        }
      });
    });

    return organized;
  };

  const organizedApis = organizeEndpointsByProduct();

  useEffect(() => {
    const path = location.pathname;
    
    if (path.startsWith('/cardgenius')) {
      setSelectedProject('cardGenius');
    } else if (path.startsWith('/loangenius')) {
      setSelectedProject('bankkaro');
    } else if (path.startsWith('/educationgenius')) {
      setSelectedProject('educationGenius');
    } else if (path.startsWith('/docs/')) {
      const endpointSlug = path.substring('/docs/'.length);
      const endpoint = endpoints.find(ep => ep.id === endpointSlug);
      if (endpoint) {
        const products = endpoint.products || [endpoint.product];
        if (products.includes('Card Genius')) {
          setSelectedProject('cardGenius');
        } else if (products.includes('Loan Genius')) {
          setSelectedProject('bankkaro');
        } else if (products.includes('Education Genius')) {
          setSelectedProject('educationGenius');
        }
      }
    } else if (path === '/') {
      // Default to Card Genius when on home page
      setSelectedProject('cardGenius');
    }
  }, [location.pathname, endpoints]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProjectMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProjectMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProjectSelect = (projectKey) => {
    setSelectedProject(projectKey);
    if (projectKey === 'cardGenius') {
      navigate('/docs/initial-data');
    } else if (projectKey === 'bankkaro') {
      navigate('/docs/partner-auth');
    } else if (projectKey === 'educationGenius') {
      navigate('/educationgenius');
    }
    setAnchorEl(null);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleApiSelect = (endpoint) => {
    console.log('Layout - handleApiSelect called with endpoint:', endpoint);
    // Remove leading slash to avoid double slash in URL
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    console.log('Layout - Navigating to:', `/docs/${cleanEndpoint}`);
    navigate(`/docs/${cleanEndpoint}`);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleHomeClick = () => {
    navigate('/');
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const getCurrentProductApis = () => {
    const productMap = {
      'bankkaro': 'Loan Genius',
      'cardGenius': 'Card Genius',
      'educationGenius': 'Education Genius'
    };
    return organizedApis[productMap[selectedProject]] || [];
  };

  const currentApis = getCurrentProductApis();

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
          BankKaro API Docs
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Financial API Documentation Hub
        </Typography>
        {/* Only show product name if on a product/API page and not on home */}
        {location.pathname !== '/' &&
          (/^\/(docs|loangenius|cardgenius|educationgenius)/.test(location.pathname)) && (
            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>
              {selectedProject === 'bankkaro' ? 'Loan Genius' : selectedProject === 'cardGenius' ? 'Card Genius' : 'Education Genius'}
            </Typography>
        )}
      </Paper>
      
      {/* Navigation Items */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {/* Home */}
        <ListItem disablePadding>
          <ListItemButton
            selected={location.pathname === '/'}
            onClick={handleHomeClick}
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
              <HomeIcon 
                color={location.pathname === '/' ? 'inherit' : 'primary'} 
              />
            </ListItemIcon>
            <ListItemText 
              primary="Home"
              primaryTypographyProps={{
                fontSize: '0.95rem',
                fontWeight: location.pathname === '/' ? 'bold' : 500
              }}
            />
          </ListItemButton>
        </ListItem>

        {/* Card Status */}
        <ListItem disablePadding>
          <ListItemButton
            selected={location.pathname === '/card-status'}
            onClick={() => navigate('/card-status')}
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
              <CreditCardIcon 
                color={location.pathname === '/card-status' ? 'inherit' : 'primary'} 
              />
            </ListItemIcon>
            <ListItemText 
              primary="Card Status"
              primaryTypographyProps={{
                fontSize: '0.95rem',
                fontWeight: location.pathname === '/card-status' ? 'bold' : 500
              }}
            />
          </ListItemButton>
        </ListItem>

        <Divider sx={{ my: 1 }} />

        {/* Product Selection - Only show when not on home page */}
        {location.pathname !== '/' && (
          <Box sx={{ px: 3, py: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 'bold', mb: 2 }}>
              APIs
            </Typography>
          </Box>
        )}

        {/* API Endpoints - Only show when not on home page */}
        {location.pathname !== '/' && (
          <>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress size={24} />
              </Box>
            ) : error ? (
              <Box sx={{ p: 3 }}>
                <Alert severity="error" sx={{ fontSize: '0.875rem' }}>
                  {error}
                </Alert>
              </Box>
            ) : selectedProject === 'educationGenius' ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Education Genius APIs
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Coming Soon: Our education loan API suite is launching soon. Stay tuned!
                </Typography>
              </Box>
            ) : currentApis.length > 0 ? (
              <>
                {currentApis.map((api) => {
                  const cleanEndpoint = api.id.startsWith('/') ? api.id.substring(1) : api.id;
                  const decodedPathname = decodeURIComponent(location.pathname);
                  const isSelected = decodedPathname === `/docs/${cleanEndpoint}`;
                  console.log('Layout - Rendering API item:', api.id, 'cleanEndpoint:', cleanEndpoint, 'isSelected:', isSelected);
                  return (
                    <ListItem key={api.id} disablePadding>
                      <ListItemButton
                        selected={isSelected}
                        onClick={() => handleApiSelect(api.id)}
                        sx={{
                          mx: 2,
                          my: 0.25,
                          borderRadius: 1,
                          pl: 4,
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
                        <ListItemText 
                          primary={api.name || api.id}
                          primaryTypographyProps={{
                            fontSize: '0.9rem',
                            fontWeight: isSelected ? 'bold' : 400
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </>
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No APIs found for this product.
                </Typography>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: isHomePage ? '100%' : `calc(100% - ${drawerWidth}px)` },
          ml: { md: isHomePage ? 0 : `${drawerWidth}px` },
          backgroundColor: 'white',
          color: 'text.primary',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            {location.pathname !== '/' ? (
              selectedProject === 'bankkaro' ? 'Loan Genius' : selectedProject === 'cardGenius' ? 'Card Genius' : 'Education Genius'
            ) : (
              'BankKaro API Docs'
            )}
          </Typography>

          {/* Admin Link */}
          <Button
            onClick={() => navigate('/admin')}
            startIcon={<AdminIcon />}
            sx={{ 
              textTransform: 'none', 
              fontWeight: 600,
              color: 'text.secondary',
              '&:hover': {
                color: 'primary.main'
              }
            }}
          >
            Admin
          </Button>

          {/* Product Switcher for Mobile */}
          {isMobile && (
            <Button
              onClick={handleProjectMenuOpen}
              endIcon={<CodeIcon />}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Switch Product
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Product Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProjectMenuClose}
        PaperProps={{
          sx: { minWidth: 200 }
        }}
      >
        {[
          { key: 'bankkaro', name: 'Loan Genius', icon: <BusinessIcon /> },
          { key: 'cardGenius', name: 'Card Genius', icon: <ApiIcon /> },
          { key: 'educationGenius', name: 'Education Genius', icon: <SchoolIcon />, comingSoon: true }
        ].map((project) => (
          <MenuItem 
            key={project.key} 
            onClick={() => handleProjectSelect(project.key)}
            selected={selectedProject === project.key}
          >
            <ListItemIcon>
              {project.icon}
            </ListItemIcon>
            <ListItemText 
              primary={project.name}
              secondary={project.comingSoon ? 'Coming Soon' : ''}
            />
          </MenuItem>
        ))}
      </Menu>

      {/* Drawer - Only show on non-homepage */}
      {!isHomePage && (
        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: isHomePage ? 0 : 3,
          width: { md: isHomePage ? '100%' : `calc(100% - ${drawerWidth}px)` },
          mt: { xs: 7, md: 8 },
          ...(isHomePage && {
            maxWidth: 1200,
            mx: 'auto'
          })
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 