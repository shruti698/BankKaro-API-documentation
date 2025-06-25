import { useState } from 'react';
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
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  ArrowForward as ArrowForwardIcon,
  Dashboard as DashboardIcon,
  Timeline as TimelineIcon,
  Language as LanguageIcon,
  Code as CodeIcon,
  Cloud as CloudIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { environments } from '../config/environments';

const Dashboard = () => {
  const navigate = useNavigate();

  const [workflowState, setWorkflowState] = useState({
    step: 0,
    partnerToken: null,
    authToken: null,
    userData: null,
    leadId: null,
    applicationId: null,
    isLoading: false,
    error: null
  });

  const [expandedStep, setExpandedStep] = useState(0);

  const environmentList = [
    {
      name: 'Staging',
      url: environments.staging.url,
      description: environments.staging.description,
      icon: <CodeIcon />,
      color: environments.staging.color
    },
    {
      name: 'Production',
      url: environments.production.url,
      description: environments.production.description,
      icon: <CloudIcon />,
      color: environments.production.color
    }
  ];

  const workflowSteps = [
    {
      label: 'Generate Partner Token',
      description: 'Get a JWT token for API authentication',
      endpoint: '/sp/api/partner-token',
      method: 'POST',
      details: 'Use your x-api-key to generate a partner token that will be used for all subsequent API calls.'
    },
    {
      label: 'Partner Authentication',
      description: 'Authenticate with mobile and OTP',
      endpoint: '/sp/api/partner-auth',
      method: 'POST',
      details: 'Authenticate the partner using mobile number and OTP to get access token for API operations.'
    },
    {
      label: 'Create Lead',
      description: 'Submit customer lead information',
      endpoint: '/sp/api/lead-details',
      method: 'POST',
      details: 'Create a new lead with customer details and loan requirements.'
    },
    {
      label: 'Submit Application',
      description: 'Complete loan application with documents',
      endpoint: '/sp/api/application',
      method: 'POST',
      details: 'Submit comprehensive loan application with personal, employment, and document information.'
    }
  ];

  const quickActions = [
    {
      title: 'Partner Token API',
      description: 'Generate authentication tokens',
      endpoint: 'partner-token',
      icon: <SecurityIcon />,
      color: 'primary'
    },
    {
      title: 'Partner Auth API',
      description: 'Authenticate partners',
      endpoint: 'partner-auth',
      icon: <ApiIcon />,
      color: 'success'
    },
    {
      title: 'Lead Details API',
      description: 'Manage lead information',
      endpoint: 'lead-details',
      icon: <DashboardIcon />,
      color: 'warning'
    },
    {
      title: 'Application API',
      description: 'Submit loan applications',
      endpoint: 'application',
      icon: <CodeIcon />,
      color: 'info'
    }
  ];

  const stats = [
    {
      title: 'Total APIs',
      value: '5',
      description: 'Available endpoints',
      icon: <ApiIcon />,
      color: 'primary'
    },
    {
      title: 'Authentication',
      value: '2',
      description: 'Auth methods',
      icon: <SecurityIcon />,
      color: 'success'
    },
    {
      title: 'Lead Management',
      value: '2',
      description: 'Lead & application APIs',
      icon: <DashboardIcon />,
      color: 'warning'
    },
    {
      title: 'Auto Auth',
      value: '1',
      description: 'Seamless authentication',
      icon: <TimelineIcon />,
      color: 'info'
    }
  ];

  const mockResponses = {
    'partner-token': {
      status: 'success',
      message: '',
      data: {
        jwttoken: "pt_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        expiresAt: "2025-06-20T13:21:57.283Z"
      }
    },
    'auth': {
      success: true,
      data: {
        accessToken: "auth_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        refreshToken: "auth_rt_1234567890abcdef1234567890abcdef",
        expiresIn: 3600,
        tokenType: "Bearer",
        userData: {
          partnerId: "550e8400-e29b-41d4-a716-446655440000",
          partnerName: "Demo Partner",
          permissions: ["leads:read", "leads:write", "applications:write"]
        }
      },
      message: "Authentication successful"
    },
    'lead-details': {
      success: true,
      data: {
        leadId: "lead_550e8400-e29b-41d4-a716-446655440001",
        status: "created",
        createdAt: new Date().toISOString(),
        customerDetails: {
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "9876543210"
        },
        loanDetails: {
          amount: 500000,
          purpose: "personal",
          status: "pending"
        }
      },
      message: "Lead created successfully"
    },
    'application': {
      success: true,
      data: {
        applicationId: "app_1234567890abcdef",
        status: "submitted",
        submittedAt: new Date().toISOString(),
        estimatedProcessingTime: "3-5 business days",
        nextSteps: [
          "Document verification",
          "Credit check",
          "Loan approval"
        ]
      },
      message: "Application submitted successfully"
    }
  };

  const getStepStatusIcon = (stepIndex) => {
    if (stepIndex < workflowState.step) {
      return <CheckCircleIcon color="success" />;
    }
    if (workflowState.isLoading && stepIndex === workflowState.step) {
      return <CircularProgress size={24} />;
    }
    return <Box sx={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Typography sx={{fontSize: 12}}>{stepIndex+1}</Typography></Box>;
  };

  const getStepResult = (stepIndex) => {
    switch(stepIndex) {
      case 0: return workflowState.partnerToken;
      case 1: return workflowState.authToken;
      case 2: return workflowState.leadId;
      case 3: return workflowState.applicationId;
      default: return null;
    }
  };

  const simulateApiCall = async (stepId) => {
    setWorkflowState(prev => ({ ...prev, isLoading: true, error: null }));
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const response = mockResponses[stepId];
    
    if (response.status === 'success' || response.success) {
      setWorkflowState(prev => ({
        ...prev,
        step: prev.step + 1,
        isLoading: false,
        [stepId === 'partner-token' ? 'partnerToken' : 
         stepId === 'auth' ? 'authToken' : 
         stepId === 'lead-details' ? 'leadId' : 'applicationId']: response.data,
        userData: stepId === 'auth' ? response.data.userData : prev.userData
      }));
    } else {
      setWorkflowState(prev => ({
        ...prev,
        isLoading: false,
        error: response.message
      }));
    }
  };

  const resetWorkflow = () => {
    setWorkflowState({
      step: 0,
      partnerToken: null,
      authToken: null,
      userData: null,
      leadId: null,
      applicationId: null,
      isLoading: false,
      error: null
    });
    setExpandedStep(0);
  };

  const renderJson = (data) => {
    return (
      <Box
        component="pre"
        sx={{
          backgroundColor: '#f5f5f5',
          p: 2,
          borderRadius: 1,
          overflow: 'auto',
          fontSize: '0.75rem',
          fontFamily: 'monospace',
          border: '1px solid #e0e0e0',
          maxHeight: '200px'
        }}
      >
        {JSON.stringify(data, null, 2)}
      </Box>
    );
  };

  const getStepStatus = (stepIndex) => {
    if (stepIndex < workflowState.step) return 'completed';
    if (stepIndex === workflowState.step) return 'current';
    return 'pending';
  };

  return (
    <Box sx={{ maxWidth: '100%' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
          BankKaro API Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
          Welcome to the BankKaro Partner API documentation. This dashboard provides an overview of available APIs 
          and guides you through the typical integration workflow.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid xs={12} md={8}>
          <Box>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <LanguageIcon sx={{ mr: 1, color: 'primary.main' }} />
                Environment URLs
              </Typography>
              <Grid container spacing={3}>
                {environmentList.map((env, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card sx={{ borderRadius: 2 }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            backgroundColor: `${env.color}.light`,
                            color: `${env.color}.main`,
                            mr: 2
                          }}>
                            {env.icon}
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                              {env.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {env.description}
                            </Typography>
                          </Box>
                          <Chip 
                            label={env.name} 
                            color={env.color} 
                            variant="outlined" 
                            size="small"
                          />
                        </Box>
                        <Paper 
                          elevation={0} 
                          sx={{ 
                            p: 2, 
                            backgroundColor: '#f8fafc', 
                            border: '1px solid #e2e8f0',
                            borderRadius: 2
                          }}
                        >
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontFamily: 'monospace', 
                              fontWeight: 500,
                              wordBreak: 'break-all'
                            }}
                          >
                            {env.url}
                          </Typography>
                        </Paper>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Stats */}
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
              API Stats
            </Typography>
            <Grid container spacing={3}>
              {stats.map((stat, index) => (
                <Grid xs={12} sm={6} md={3} key={index}>
                  <Card sx={{ borderRadius: 2, height: '100%' }}>
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <Box sx={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        backgroundColor: `${stat.color}.light`,
                        color: `${stat.color}.main`,
                        mb: 2
                      }}>
                        {stat.icon}
                      </Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
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

            <Divider sx={{ my: 4 }} />

            {/* Environments */}
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
              Environments
            </Typography>
            <Grid container spacing={3}>
              {environmentList.map((env) => (
                <Grid xs={12} md={6} key={env.name}>
                  <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          backgroundColor: `${env.color}.light`,
                          color: `${env.color}.main`,
                          mr: 2
                        }}>
                          {env.icon}
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                            {env.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {env.description}
                          </Typography>
                        </Box>
                        <Chip 
                          label={env.name} 
                          color={env.color} 
                          variant="outlined" 
                          size="small"
                        />
                      </Box>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2, 
                          backgroundColor: '#f8fafc', 
                          border: '1px solid #e2e8f0',
                          borderRadius: 2
                        }}
                      >
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontFamily: 'monospace', 
                            fontWeight: 500,
                            wordBreak: 'break-all'
                          }}
                        >
                          {env.url}
                        </Typography>
                      </Paper>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Quick Actions */}
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              {quickActions.map((action, index) => (
                <Grid xs={12} sm={6} key={index}>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      display: 'flex', 
                      alignItems: 'center', 
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }
                    }}
                    onClick={() => navigate(`/docs/${action.endpoint}`)}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: `${action.color}.light`,
                      color: `${action.color}.main`,
                      mr: 2
                    }}>
                      {action.icon}
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {action.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {action.description}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>

        {/* Sidebar */}
        <Grid xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 88 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              API Integration Workflow
            </Typography>
            
            {/* Workflow Steps */}
            <Box sx={{ mt: 3 }}>
              <Stepper activeStep={workflowState.step} orientation="vertical">
                {workflowSteps.map((step, index) => (
                  <Step key={step.label} expanded={expandedStep === index}>
                    <StepLabel 
                      onClick={() => setExpandedStep(expandedStep === index ? -1 : index)}
                      sx={{ cursor: 'pointer' }}
                      icon={getStepStatusIcon(index)}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {step.label}
                      </Typography>
                    </StepLabel>
                    <StepContent>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {step.description}
                      </Typography>
                      
                      <Grid container spacing={2} sx={{ alignItems: 'center', mb: 2 }}>
                        <Grid>
                          <Chip label={step.method} color="primary" size="small" />
                        </Grid>
                        <Grid sx={{ flex: 1 }}>
                          <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                            {step.endpoint}
                          </Typography>
                        </Grid>
                      </Grid>

                      {index === workflowState.step && (
                        <Button 
                          variant="outlined"
                          size="small"
                          onClick={() => simulateApiCall(step.endpoint.split('/').pop())}
                          sx={{ mt: 1 }}
                        >
                          Simulate API Call
                        </Button>
                      )}

                      {/* Display results of each step */}
                      {index < workflowState.step && (
                        <Box sx={{ mt: 2 }}>
                          <Alert 
                            severity="success" 
                            icon={<CheckCircleIcon fontSize="inherit" />}
                            sx={{ mb: 1 }}
                          >
                            <AlertTitle>Success</AlertTitle>
                            {renderJson(getStepResult(index))}
                          </Alert>
                        </Box>
                      )}
                      
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </Box>

            {/* Reset Button */}
            {workflowState.step > 0 && (
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Button onClick={resetWorkflow} variant="outlined">
                  Reset Workflow
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 