import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Chip,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Fade,
  Slide,
  Zoom,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Build as BuildIcon,
  Code as CodeIcon,
  Api as ApiIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';

const MaintenancePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [progress, setProgress] = useState(0);
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: <ApiIcon sx={{ fontSize: 40, color: '#3b82f6' }} />,
      title: 'CardGenius APIs',
      description: 'Credit card processing, partner authentication, and transaction management',
      status: 'Enhanced',
      color: '#3b82f6'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: '#10b981' }} />,
      title: 'LoanGenius APIs',
      description: 'Loan applications, eligibility checks, and document processing',
      status: 'Upgraded',
      color: '#10b981'
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40, color: '#f59e0b' }} />,
      title: 'EducationGenius APIs',
      description: 'Student loan management, education financing, and scholarship tracking',
      status: 'Optimized',
      color: '#f59e0b'
    }
  ];

  const apiEndpoints = [
    {
      method: 'POST',
      endpoint: '/partner/token',
      description: 'Generate authentication tokens',
      status: 'Active'
    },
    {
      method: 'GET',
      endpoint: '/cards/eligibility',
      description: 'Check card application eligibility',
      status: 'Active'
    },
    {
      method: 'POST',
      endpoint: '/loans/apply',
      description: 'Submit loan applications',
      status: 'Active'
    },
    {
      method: 'GET',
      endpoint: '/education/scholarships',
      description: 'Browse available scholarships',
      status: 'Active'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          return 0;
        }
        return prevProgress + 1;
      });
    }, 100);

    const featureTimer = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(featureTimer);
    };
  }, [features.length]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        <Fade in timeout={1000}>
          <Paper
            elevation={24}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            {/* Header */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                p: 4,
                textAlign: 'center'
              }}
            >
              <Zoom in timeout={800}>
                <BuildIcon sx={{ fontSize: 80, mb: 2, opacity: 0.9 }} />
              </Zoom>
              <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                BankKaro API Hub
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                🚀 Under Maintenance - Making Things Better
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
                <ScheduleIcon />
                <Typography variant="body1">
                  Expected completion: Soon™
                </Typography>
              </Box>
            </Box>

            {/* Progress Section */}
            <Box sx={{ p: 4, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUpIcon color="primary" />
                Enhancement Progress
              </Typography>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
                  }
                }}
              />
              <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                {progress}% Complete - Enhancing API documentation and sandbox features
              </Typography>
            </Box>

            {/* Features Grid */}
            <Box sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
                What We're Working On
              </Typography>
              <Grid container spacing={3}>
                {features.map((feature, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Slide direction="up" in timeout={1000 + index * 200}>
                      <Card
                        sx={{
                          height: '100%',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: theme.shadows[8]
                          },
                          border: currentFeature === index ? `2px solid ${feature.color}` : 'none'
                        }}
                      >
                        <CardContent sx={{ textAlign: 'center', p: 3 }}>
                          <Box sx={{ mb: 2 }}>
                            {feature.icon}
                          </Box>
                          <Typography variant="h6" gutterBottom fontWeight="bold">
                            {feature.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {feature.description}
                          </Typography>
                          <Chip
                            label={feature.status}
                            size="small"
                            sx={{
                              backgroundColor: feature.color,
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          />
                        </CardContent>
                      </Card>
                    </Slide>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* API Endpoints Preview */}
            <Box sx={{ p: 4, backgroundColor: '#f8fafc' }}>
              <Typography variant="h5" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
                <CodeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                API Endpoints Preview
              </Typography>
              <Grid container spacing={2}>
                {apiEndpoints.map((endpoint, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Fade in timeout={1200 + index * 200}>
                      <Paper
                        sx={{
                          p: 2,
                          border: '1px solid rgba(0,0,0,0.1)',
                          borderRadius: 2,
                          '&:hover': {
                            borderColor: '#667eea',
                            boxShadow: theme.shadows[4]
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Chip
                            label={endpoint.method}
                            size="small"
                            sx={{
                              backgroundColor: endpoint.method === 'GET' ? '#10b981' : '#3b82f6',
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          />
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                            {endpoint.endpoint}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {endpoint.description}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CheckCircleIcon sx={{ fontSize: 16, color: '#10b981' }} />
                          <Typography variant="caption" color="text.secondary">
                            {endpoint.status}
                          </Typography>
                        </Box>
                      </Paper>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Footer */}
            <Box
              sx={{
                p: 4,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
              }}
            >
              <Typography variant="body2" color="text.secondary">
                We're working hard to bring you the best API documentation experience.
                Check back soon for the enhanced version!
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default MaintenancePage; 