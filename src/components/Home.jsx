import React from 'react';
import { Box, Typography, Button, Paper, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowForward } from '@mui/icons-material';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box 
      sx={{ 
        flexGrow: 1, 
        p: 4, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'background.default'
      }}
    >
      <Box sx={{ maxWidth: 800, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          BankKaro for Business API Documentation
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 6 }}>
          Welcome to the central hub for our powerful financial API suites. Choose a product to get started.
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={2}
              sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 3 }}
            >
              <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
                Loan Genius
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, flexGrow: 1 }}>
                Access APIs for lead generation, eligibility checks, and managing loans & credit cards.
              </Typography>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                onClick={() => navigate('/loangenius')}
                sx={{ mt: 'auto' }}
              >
                Go to Loan Genius
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={2}
              sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 3 }}
            >
              <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
                CardGenius
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, flexGrow: 1 }}>
                Integrate with our card catalog, get detailed card information, and manage credit card applications.
              </Typography>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                onClick={() => navigate('/cardgenius')}
              >
                Go to CardGenius
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Home; 