import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Divider,
  Paper,
  Alert,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AlertTitle,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  ExpandMore as ExpandMoreIcon,
  Api as ApiIcon,
  Security as SecurityIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  ArrowForward as ArrowForwardIcon,
  Dashboard as DashboardIcon,
  Timeline as TimelineIcon,
  Language as LanguageIcon,
  Code as CodeIcon,
  Cloud as CloudIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const EducationGeniusDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Education APIs',
      value: 'Coming Soon',
      description: 'Future endpoints',
      icon: <ApiIcon />,
      color: 'primary'
    },
    {
      title: 'Loan Products',
      value: '0',
      description: 'Available products',
      icon: <SchoolIcon />,
      color: 'success'
    },
    {
      title: 'Eligibility',
      value: '0',
      description: 'Check methods',
      icon: <SecurityIcon />,
      color: 'warning'
    },
    {
      title: 'Applications',
      value: '0',
      description: 'Processing APIs',
      icon: <AssignmentIcon />,
      color: 'info'
    }
  ];

  const plannedFeatures = [
    {
      title: 'Education Loan Eligibility',
      description: 'Check eligibility for various education loan products',
      status: 'Planned',
      icon: <SecurityIcon />,
      color: 'primary'
    },
    {
      title: 'Loan Product Catalog',
      description: 'Browse available education loan products and schemes',
      status: 'Planned',
      icon: <SchoolIcon />,
      color: 'success'
    },
    {
      title: 'Application Processing',
      description: 'Submit and track education loan applications',
      status: 'Planned',
      icon: <AssignmentIcon />,
      color: 'warning'
    },
    {
      title: 'Document Management',
      description: 'Upload and manage required documents',
      status: 'Planned',
      icon: <DashboardIcon />,
      color: 'info'
    }
  ];

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Education Genius Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Education loan APIs and tools for seamless integration
        </Typography>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          <AlertTitle>Coming Soon</AlertTitle>
          Education Genius APIs are currently in development. Stay tuned for our comprehensive suite of education loan APIs!
        </Alert>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ mb: 2 }}>
                  {React.cloneElement(stat.icon, { 
                    sx: { fontSize: 40, color: `${stat.color}.main` } 
                  })}
                </Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  {stat.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Planned Features */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          Planned Features
        </Typography>
        <Grid container spacing={3}>
          {plannedFeatures.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ mr: 2 }}>
                      {React.cloneElement(feature.icon, { 
                        sx: { fontSize: 32, color: `${feature.color}.main` } 
                      })}
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                        {feature.title}
                      </Typography>
                      <Chip 
                        label={feature.status} 
                        size="small" 
                        color="warning"
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Coming Soon Workflow */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          Future API Workflow
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Stepper orientation="vertical">
            <Step active={false}>
              <StepLabel>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Education Loan Eligibility Check
                </Typography>
              </StepLabel>
              <StepContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Check eligibility for various education loan products based on student profile, course, and institution.
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip label="Coming Soon" size="small" color="warning" />
                </Box>
              </StepContent>
            </Step>
            
            <Step active={false}>
              <StepLabel>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Product Selection & Comparison
                </Typography>
              </StepLabel>
              <StepContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Browse and compare different education loan products, interest rates, and terms.
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip label="Coming Soon" size="small" color="warning" />
                </Box>
              </StepContent>
            </Step>
            
            <Step active={false}>
              <StepLabel>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Application Submission
                </Typography>
              </StepLabel>
              <StepContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Submit complete education loan applications with required documents and information.
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip label="Coming Soon" size="small" color="warning" />
                </Box>
              </StepContent>
            </Step>
            
            <Step active={false}>
              <StepLabel>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Application Tracking
                </Typography>
              </StepLabel>
              <StepContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Track application status, receive updates, and manage loan disbursement.
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip label="Coming Soon" size="small" color="warning" />
                </Box>
              </StepContent>
            </Step>
          </Stepper>
        </Paper>
      </Box>

      {/* Get Notified */}
      <Box sx={{ textAlign: 'center' }}>
        <Card sx={{ p: 4, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
          <NotificationsIcon sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
            Get Notified When We Launch
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Be the first to know when Education Genius APIs are available for integration.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{ 
              backgroundColor: 'white', 
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'grey.100'
              }
            }}
          >
            Subscribe for Updates
          </Button>
        </Card>
      </Box>
    </Box>
  );
};

export default EducationGeniusDashboard; 