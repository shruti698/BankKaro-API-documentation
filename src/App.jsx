import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
// Force new deployment - cache bust
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import Layout from './components/Layout';
import ApiDocumentation from './components/ApiDocumentation';
import LoanGeniusDashboard from './components/LoanGeniusDashboard';
import CardGeniusDashboard from './components/CardGeniusDashboard';
import EducationGeniusDashboard from './components/EducationGeniusDashboard';
import ComingSoon from './components/ComingSoon';
import Home from './components/Home';
import CardStatus from './components/CardStatus';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import MaintenancePage from './components/MaintenancePage';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',
      light: '#3b82f6',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#7c3aed',
      light: '#8b5cf6',
      dark: '#6d28d9',
      contrastText: '#ffffff',
    },
    success: {
      main: '#059669',
      light: '#10b981',
      dark: '#047857',
    },
    warning: {
      main: '#d97706',
      light: '#f59e0b',
      dark: '#b45309',
    },
    error: {
      main: '#dc2626',
      light: '#ef4444',
      dark: '#b91c1c',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.4,
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          border: '1px solid #e2e8f0',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          '&:before': {
            display: 'none',
          },
        },
      },
    },
  },
});

function App() {
  // Set this to true when you want to show maintenance page
  const isMaintenanceMode = false;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', height: '100vh', justifyContent: 'center' }}>
          <Routes>
            <Route path="/admin/*" element={<ProtectedAdminRoute />} />
            <Route path="/" element={
              isMaintenanceMode ? (
                <MaintenancePage />
              ) : (
                <Layout>
                  <Home />
                </Layout>
              )
            } />
            <Route path="/loangenius" element={
              <Layout>
                <Navigate to="/docs/partner-auth" replace />
              </Layout>
            } />
            <Route path="/cardgenius" element={
              <Layout>
                <Navigate to="/docs/initial-data" replace />
              </Layout>
            } />
            <Route path="/educationgenius" element={
              <Layout>
                <EducationGeniusDashboard />
              </Layout>
            } />
            <Route path="/docs/*" element={
              <Layout>
                <ApiDocumentation />
              </Layout>
            } />
            <Route path="/card-status" element={
              <Layout>
                <CardStatus />
              </Layout>
            } />
            <Route path="/coming-soon" element={
              <Layout>
                <ComingSoon />
              </Layout>
            } />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
