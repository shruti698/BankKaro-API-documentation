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
  StepContent,
  TextField,
  CircularProgress
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  ExpandMore as ExpandMoreIcon,
  Api as ApiIcon,
  Security as SecurityIcon,
  CreditCard as CreditCardIcon,
  Functions as FunctionsIcon,
  VerifiedUser as VerifiedUserIcon,
  ArrowForward as ArrowForwardIcon,
  Dashboard as DashboardIcon,
  Timeline as TimelineIcon,
  Category as CategoryIcon,
  Language as LanguageIcon,
  Code as CodeIcon,
  Cloud as CloudIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { environments } from '../config/environments';

const CardGeniusDashboard = () => {
  const navigate = useNavigate();

  const [workflowState, setWorkflowState] = useState({
    step: 0,
    spendProfile: {
      monthly_online_spend: 15000,
      monthly_travel_spend: 5000,
      monthly_utility_spend: 3000,
    },
    recommendedCard: null,
    eligibility: null,
    isLoading: false,
    error: null
  });

  const [expandedStep, setExpandedStep] = useState(0);

  const environmentList = [
    {
      name: 'Staging',
      url: environments.staging.cardApiUrl || environments.staging.url,
      description: 'CardGenius staging environment',
      icon: <CodeIcon />,
      color: 'warning'
    },
    {
      name: 'Production',
      url: environments.production.cardApiUrl,
      description: 'CardGenius production environment',
      icon: <CloudIcon />,
      color: 'error'
    }
  ];

  const workflowSteps = [
    {
      label: 'Calculate Savings',
      description: 'Find the best card based on spending',
      endpoint: '/v1/cards/calculate',
      method: 'POST',
      details: 'Enter monthly spending habits to receive a personalized card recommendation with estimated yearly savings.'
    },
    {
      label: 'Check Eligibility',
      description: 'Verify if you can apply for the card',
      endpoint: '/v1/cards/eligibility',
      method: 'POST',
      details: 'Check if you meet the basic eligibility criteria for the recommended card before proceeding.'
    },
    {
      label: 'View Card Details',
      description: 'Explore the card features and apply',
      endpoint: '/v1/cards/{card_slug}',
      method: 'GET',
      details: 'Navigate to the detailed documentation to view all features, fees, and benefits of the recommended card.'
    }
  ];

  const quickActions = [
    {
      title: 'Card Calculator',
      description: 'Get card recommendations',
      endpoint: 'v1-card-genius-calculator',
      icon: <FunctionsIcon />,
      color: 'primary'
    },
    {
      title: 'Cards Catalog',
      description: 'Browse all cards',
      endpoint: 'v1-cards-catalog',
      icon: <CreditCardIcon />,
      color: 'success'
    },
    {
      title: 'Eligibility Check',
      description: 'Check your eligibility',
      endpoint: 'v1-eligibility',
      icon: <VerifiedUserIcon />,
      color: 'warning'
    },
    {
      title: 'Bank & Categories',
      description: 'View all banks and card types',
      endpoint: 'v1-banks',
      icon: <CategoryIcon />,
      color: 'info'
    }
  ];

  const stats = [
    {
      title: 'Card APIs',
      value: '12',
      description: 'Available endpoints',
      icon: <ApiIcon />,
      color: 'primary'
    },
    {
      title: 'Personalization',
      value: '3',
      description: 'Calculator & Planners',
      icon: <FunctionsIcon />,
      color: 'success'
    },
    {
      title: 'Data Endpoints',
      value: '5',
      description: 'Banks, Cards, Categories',
      icon: <CreditCardIcon />,
      color: 'warning'
    },
    {
      title: 'Real-time Feeds',
      value: '4',
      description: 'Offers, Lounges, Webhooks',
      icon: <TimelineIcon />,
      color: 'info'
    }
  ];

  const mockResponses = {
    'calculate': {
      "recommendations": [
        {
          "card_slug": "sbi-cashback-credit-card",
          "card_name": "SBI Cashback Credit Card",
          "card_image_url": "https://example.com/sbi.png",
          "total_savings_yearly": 19668,
          "net_savings_after_fees": 18669,
          "spend_breakdown": {
            "monthly_online_spend": { "spend": 15000, "savings": 750, "rate_pct": 5, "note": "5% on all online spends" },
            "monthly_travel_spend": { "spend": 5000, "savings": 50, "rate_pct": 1, "note": "1% on offline spends" },
            "monthly_utility_spend": { "spend": 3000, "savings": 30, "rate_pct": 1, "note": "1% on offline spends" },
          }
        }
      ]
    },
    'eligibility': {
      "card_slug": "sbi-cashback-credit-card",
      "eligible": true,
      "criteria": [
        { "name": "Income", "status": "Pass", "requirement": ">= ₹30,000/month", "value": "₹55,000/month" },
        { "name": "Credit Score", "status": "Pass", "requirement": ">= 700", "value": "750" },
        { "name": "Employment Type", "status": "Pass", "requirement": "Salaried or Self-Employed", "value": "Salaried" },
        { "name": "Age", "status": "Pass", "requirement": "21-65 years", "value": "32 years" }
      ]
    }
  };

  const handleSpendChange = (event) => {
    const { name, value } = event.target;
    setWorkflowState(prev => ({
      ...prev,
      spendProfile: {
        ...prev.spendProfile,
        [name]: Number(value) >= 0 ? Number(value) : 0
      }
    }));
  };

  const getStepStatusIcon = (stepIndex) => {
    if (workflowState.isLoading && stepIndex === workflowState.step) {
      return <CircularProgress size={24} />;
    }
    if (stepIndex < workflowState.step) {
      return <CheckCircleIcon color="success" />;
    }
    return <Box sx={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Typography sx={{fontSize: 12}}>{stepIndex+1}</Typography></Box>;
  };

  const getStepResult = (stepIndex) => {
    switch(stepIndex) {
      case 0: return workflowState.recommendedCard;
      case 1: return workflowState.eligibility;
      default: return null;
    }
  };

  const simulateApiCall = async (stepIndex) => {
    setWorkflowState(prev => ({ ...prev, isLoading: true, error: null }));
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      if (stepIndex === 0) {
        const response = mockResponses.calculate;
        const recommendedCard = response.recommendations[0];
        setWorkflowState(prev => ({
          ...prev,
          step: 1,
          recommendedCard: recommendedCard,
          isLoading: false
        }));
        setExpandedStep(1);
      } else if (stepIndex === 1) {
        if (!workflowState.recommendedCard) {
          throw new Error("Please calculate savings first to get a recommended card.");
        }
        const response = mockResponses.eligibility;
        setWorkflowState(prev => ({
          ...prev,
          step: 2,
          eligibility: response,
          isLoading: false
        }));
        setExpandedStep(2);
      } else if (stepIndex === 2) {
        if (!workflowState.recommendedCard) {
          throw new Error("Please complete the previous steps first.");
        }
        navigate(`/docs/${workflowState.recommendedCard.card_slug}`);
        setWorkflowState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      setWorkflowState(prev => ({ ...prev, isLoading: false, error: error.message }));
    }
  };

  const resetWorkflow = () => {
    setWorkflowState({
      step: 0,
      spendProfile: {
        monthly_online_spend: 15000,
        monthly_travel_spend: 5000,
        monthly_utility_spend: 3000,
      },
      recommendedCard: null,
      eligibility: null,
      isLoading: false,
      error: null
    });
    setExpandedStep(0);
  };

  const renderJson = (data) => {
    if (!data) return null;
    return (
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          mt: 2,
          backgroundColor: '#f8fafc',
          overflowX: 'auto',
          fontSize: '0.8rem',
          fontFamily: 'monospace',
          border: '1px solid #e2e8f0'
        }}
      >
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      </Paper>
    );
  };

  const getStepStatus = (stepIndex) => {
    if (stepIndex < workflowState.step) return 'completed';
    if (stepIndex === workflowState.step) return 'active';
    return 'pending';
  };

  const handleStepHeaderClick = (stepIndex) => {
    if (stepIndex <= workflowState.step) {
      setExpandedStep(expandedStep === stepIndex ? -1 : stepIndex);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>CardGenius Dashboard</Typography>
        <Typography variant="h6" color="text.secondary">
          An interactive guide to the CardGenius API suite.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Left Column: Workflow */}
        <Grid item xs={12} md={7}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            Interactive Workflow
          </Typography>
          <Paper elevation={0} sx={{ p: {xs: 1, sm: 3}, border: '1px solid #e2e8f0' }}>
            {workflowState.isLoading && <LinearProgress sx={{ mb: 2 }} />}
            {workflowState.error && <Alert severity="error" onClose={() => setWorkflowState(prev => ({...prev, error: null}))} sx={{ mb: 2 }}>{workflowState.error}</Alert>}
            
            <Stepper activeStep={workflowState.step} orientation="vertical">
              {workflowSteps.map((step, index) => (
                <Step key={step.label} expanded>
                  <StepLabel
                    StepIconComponent={() => getStepStatusIcon(index)}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>{step.label}</Typography>
                    <Typography variant="body2" color="text.secondary">{step.description}</Typography>
                  </StepLabel>
                  <StepContent>
                    <Typography variant="body2" sx={{ my: 1 }}>{step.details}</Typography>
                    
                    {index === 0 && getStepStatus(0) === 'active' && (
                      <Box sx={{ my: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6} md={4}>
                            <TextField
                              fullWidth
                              label="Online Spend"
                              name="monthly_online_spend"
                              type="number"
                              value={workflowState.spendProfile.monthly_online_spend}
                              onChange={handleSpendChange}
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} md={4}>
                            <TextField
                              fullWidth
                              label="Travel Spend"
                              name="monthly_travel_spend"
                              type="number"
                              value={workflowState.spendProfile.monthly_travel_spend}
                              onChange={handleSpendChange}
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} md={4}>
                            <TextField
                              fullWidth
                              label="Utility Spend"
                              name="monthly_utility_spend"
                              type="number"
                              value={workflowState.spendProfile.monthly_utility_spend}
                              onChange={handleSpendChange}
                              size="small"
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    )}

                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        onClick={() => simulateApiCall(index)}
                        disabled={workflowState.isLoading || getStepStatus(index) !== 'active'}
                        startIcon={<PlayArrowIcon />}
                      >
                        {index === 2 ? 'View API Docs' : `Run Step ${index + 1}`}
                      </Button>
                      {index === 0 && (
                        <Button
                          onClick={resetWorkflow}
                          sx={{ ml: 1 }}
                        >
                          Reset
                        </Button>
                      )}
                    </Box>

                    {getStepResult(index) && (
                      <>
                        <Alert icon={<CheckCircleIcon fontSize="inherit" />} severity="success" sx={{ mt: 2, mb: 1 }}>
                          <AlertTitle>Success</AlertTitle>
                           API call simulation complete. See the mock response data below.
                        </Alert>
                        {renderJson(getStepResult(index))}
                      </>
                    )}
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Paper>
        </Grid>

        {/* Right Column: Info */}
        <Grid item xs={12} md={5}>
          {/* Quick Actions */}
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            {quickActions.map(action => (
              <Grid item xs={12} sm={6} key={action.title}>
                <Card 
                  elevation={0}
                  sx={{ 
                    height: '100%',
                    border: '1px solid #e2e8f0',
                    transition: 'box-shadow 0.3s',
                    '&:hover': {
                      boxShadow: 3
                    }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <ListItemIcon sx={{ justifyContent: 'center', color: `${action.color}.main`, fontSize: '2.5rem' }}>{action.icon}</ListItemIcon>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>{action.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{action.description}</Typography>
                    <Button 
                      size="small"
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => navigate(`/docs/${action.endpoint}`)}
                    >
                      Go to API
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Stats */}
          <Typography variant="h5" sx={{ fontWeight: 600, mt: 4, mb: 2 }}>
            API Stats
          </Typography>
          <Grid container spacing={2}>
            {stats.map(stat => (
              <Grid item xs={6} sm={6} key={stat.title}>
                <Card elevation={0} sx={{ height: '100%', border: '1px solid #e2e8f0' }}>
                  <CardContent>
                    <ListItemIcon sx={{ color: `${stat.color}.main`, mb: 1 }}>{stat.icon}</ListItemIcon>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{stat.value}</Typography>
                    <Typography variant="body2" color="text.secondary">{stat.title}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Environments */}
          <Typography variant="h5" sx={{ fontWeight: 600, mt: 4, mb: 2 }}>
            Environments
          </Typography>
          <List>
            {environmentList.map(env => (
              <ListItem key={env.name} disablePadding>
                <Card elevation={0} sx={{ width: '100%', mb: 1, border: '1px solid #e2e8f0' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ListItemIcon sx={{ color: `${env.color}.main` }}>{env.icon}</ListItemIcon>
                      <ListItemText 
                        primary={env.name} 
                        secondary={env.description} 
                        primaryTypographyProps={{ fontWeight: 'bold' }}
                      />
                    </Box>
                    <Chip label={env.url} size="small" variant="outlined" sx={{ mt: 1, width: '100%', fontFamily: 'monospace' }} />
                  </CardContent>
                </Card>
              </ListItem>
            ))}
          </List>

        </Grid>
      </Grid>
    </Box>
  );
};

export default CardGeniusDashboard; 