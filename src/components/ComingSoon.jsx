import {
  Box,
  Typography,
  Card,
  CardContent,
  Paper,
  Chip,
  Grid
} from '@mui/material';
import {
  Construction as ConstructionIcon,
  CreditCard as CreditCardIcon,
  Timeline as TimelineIcon,
  Code as CodeIcon
} from '@mui/icons-material';

const ComingSoon = ({ projectName = 'CardGenius' }) => {
  const features = [
    {
      icon: <CreditCardIcon />,
      title: 'Credit Card APIs',
      description: 'Complete credit card management and processing APIs'
    },
    {
      icon: <CodeIcon />,
      title: 'Developer Tools',
      description: 'SDKs, webhooks, and comprehensive documentation'
    },
    {
      icon: <TimelineIcon />,
      title: 'Analytics Dashboard',
      description: 'Real-time analytics and reporting capabilities'
    }
  ];

  return (
    <Box sx={{ maxWidth: '100%', textAlign: 'center' }}>
      {/* Header */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          mb: 3 
        }}>
          <ConstructionIcon sx={{ fontSize: 80, color: 'warning.main', mr: 2 }} />
          <Typography variant="h3" component="h1">
            Coming Soon
          </Typography>
        </Box>
        <Typography variant="h4" gutterBottom color="primary">
          {projectName} API Documentation
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          We're working hard to bring you comprehensive API documentation for {projectName}. 
          Our team is building powerful credit card management and processing APIs that will 
          revolutionize how you handle credit card operations.
        </Typography>
      </Box>

      {/* Features Preview */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" gutterBottom>
          What's Coming
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%', p: 2 }}>
                <CardContent>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    mb: 2 
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      width: 60, 
                      height: 60, 
                      borderRadius: '50%',
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText'
                    }}>
                      {feature.icon}
                    </Box>
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Timeline */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" gutterBottom>
          Development Timeline
        </Typography>
        <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Chip 
                  label="Q1 2024" 
                  color="primary" 
                  variant="filled"
                  sx={{ mb: 1 }}
                />
                <Typography variant="subtitle2" gutterBottom>
                  Core APIs
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Basic credit card management APIs
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Chip 
                  label="Q2 2024" 
                  color="secondary" 
                  variant="filled"
                  sx={{ mb: 1 }}
                />
                <Typography variant="subtitle2" gutterBottom>
                  Advanced Features
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Processing and analytics APIs
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Chip 
                  label="Q3 2024" 
                  color="success" 
                  variant="filled"
                  sx={{ mb: 1 }}
                />
                <Typography variant="subtitle2" gutterBottom>
                  SDKs & Tools
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Developer SDKs and documentation
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Chip 
                  label="Q4 2024" 
                  color="warning" 
                  variant="filled"
                  sx={{ mb: 1 }}
                />
                <Typography variant="subtitle2" gutterBottom>
                  Full Launch
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Complete API platform release
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Contact Info */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Stay Updated
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Want to be notified when {projectName} APIs are ready?
        </Typography>
        <Chip 
          label="Contact our team" 
          color="primary" 
          variant="outlined"
          sx={{ cursor: 'pointer' }}
        />
      </Box>
    </Box>
  );
};

export default ComingSoon; 