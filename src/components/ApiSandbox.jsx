import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  Divider,
  Alert,
  CircularProgress,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  useTheme
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  Code as CodeIcon,
  Description as DescriptionIcon,
  Settings as SettingsIcon,
  ExpandMore as ExpandMoreIcon,
  ContentCopy as ContentCopyIcon,
  Check as CheckIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { environments, getEnvironmentUrl } from '../config/environments';
import mockApiServer from '../utils/mockApiServer';

const ApiSandbox = ({ api }) => {
  const [selectedMethod, setSelectedMethod] = useState('POST');
  const [selectedEnvironment, setSelectedEnvironment] = useState('uat');
  const [requestData, setRequestData] = useState({});
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const theme = useTheme();

  // Predefined test data
  const testData = {
    cards: [
      {
        id: 'card_001',
        name: 'HDFC Regalia Credit Card',
        bank: 'HDFC Bank',
        type: 'Credit',
        limit: '₹500,000',
        features: ['Rewards', 'Travel Insurance', 'Airport Lounge Access'],
        annualFee: '₹2,500',
        interestRate: '3.49%'
      },
      {
        id: 'card_002',
        name: 'SBI SimplyCLICK Credit Card',
        bank: 'State Bank of India',
        type: 'Credit',
        limit: '₹200,000',
        features: ['Online Shopping Rewards', 'Fuel Surcharge Waiver'],
        annualFee: '₹999',
        interestRate: '3.99%'
      },
      {
        id: 'card_003',
        name: 'ICICI Amazon Pay Credit Card',
        bank: 'ICICI Bank',
        type: 'Credit',
        limit: '₹300,000',
        features: ['Amazon Rewards', 'No Annual Fee', 'Contactless'],
        annualFee: '₹0',
        interestRate: '3.99%'
      },
      {
        id: 'card_004',
        name: 'Axis Flipkart Credit Card',
        bank: 'Axis Bank',
        type: 'Credit',
        limit: '₹400,000',
        features: ['Flipkart Rewards', 'Welcome Benefits', 'Fuel Surcharge Waiver'],
        annualFee: '₹500',
        interestRate: '3.49%'
      }
    ],
    banks: [
      {
        id: 'bank_001',
        name: 'HDFC Bank',
        code: 'HDFC0000001',
        type: 'Private',
        rating: '4.5',
        features: ['Digital Banking', '24/7 Support', 'Wide Network']
      },
      {
        id: 'bank_002',
        name: 'State Bank of India',
        code: 'SBIN0000001',
        type: 'Public',
        rating: '4.2',
        features: ['Government Backed', 'Rural Presence', 'Low Charges']
      },
      {
        id: 'bank_003',
        name: 'ICICI Bank',
        code: 'ICIC0000001',
        type: 'Private',
        rating: '4.3',
        features: ['Digital First', 'Innovative Products', 'Good Customer Service']
      },
      {
        id: 'bank_004',
        name: 'Axis Bank',
        code: 'UTIB0000001',
        type: 'Private',
        rating: '4.1',
        features: ['Corporate Banking', 'Investment Services', 'International Presence']
      }
    ],
    users: [
      {
        id: 'user_001',
        name: 'Rahul Sharma',
        email: 'rahul.sharma@example.com',
        mobile: '9876543210',
        pan: 'ABCDE1234F',
        aadhar: '123456789012',
        income: '₹750,000',
        creditScore: '750'
      },
      {
        id: 'user_002',
        name: 'Priya Patel',
        email: 'priya.patel@example.com',
        mobile: '9876543211',
        pan: 'FGHIJ5678K',
        aadhar: '123456789013',
        income: '₹850,000',
        creditScore: '780'
      },
      {
        id: 'user_003',
        name: 'Amit Kumar',
        email: 'amit.kumar@example.com',
        mobile: '9876543212',
        pan: 'LMNOP9012Q',
        aadhar: '123456789014',
        income: '₹650,000',
        creditScore: '720'
      },
      {
        id: 'user_004',
        name: 'Neha Singh',
        email: 'neha.singh@example.com',
        mobile: '9876543213',
        pan: 'RSTUV3456W',
        aadhar: '123456789015',
        income: '₹950,000',
        creditScore: '800'
      }
    ],
    loans: [
      {
        id: 'loan_001',
        type: 'Personal Loan',
        amount: '₹500,000',
        tenure: '36 months',
        interestRate: '12.5%',
        emi: '₹16,750',
        purpose: 'Home Renovation'
      },
      {
        id: 'loan_002',
        type: 'Business Loan',
        amount: '₹1,000,000',
        tenure: '60 months',
        interestRate: '14.5%',
        emi: '₹23,500',
        purpose: 'Business Expansion'
      },
      {
        id: 'loan_003',
        type: 'Education Loan',
        amount: '₹800,000',
        tenure: '84 months',
        interestRate: '10.5%',
        emi: '₹12,800',
        purpose: 'Higher Education'
      },
      {
        id: 'loan_004',
        type: 'Vehicle Loan',
        amount: '₹600,000',
        tenure: '48 months',
        interestRate: '11.5%',
        emi: '₹15,600',
        purpose: 'Car Purchase'
      }
    ]
  };

  useEffect(() => {
    if (api) {
      setSelectedMethod(api.methods[0] || 'POST');
      initializeRequestData();
    }
  }, [api]);

  const initializeRequestData = () => {
    if (!api) return;

    const initialData = {};
    
    // Initialize with sample data based on API endpoint
    if (api.sampleRequest) {
      Object.keys(api.sampleRequest).forEach(key => {
        const value = api.sampleRequest[key];
        
        // Replace placeholder values with real test data
        if (typeof value === 'string') {
          if (value.includes('card')) {
            initialData[key] = testData.cards[0].id;
          } else if (value.includes('bank')) {
            initialData[key] = testData.banks[0].id;
          } else if (value.includes('user') || value.includes('mobile')) {
            initialData[key] = testData.users[0].mobile;
          } else if (value.includes('loan')) {
            initialData[key] = testData.loans[0].id;
          } else {
            initialData[key] = value;
          }
        } else {
          initialData[key] = value;
        }
      });
    }

    setRequestData(initialData);
  };

  const handleInputChange = (field, value) => {
    setRequestData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getTestDataOptions = (field) => {
    if (field.toLowerCase().includes('card')) {
      return testData.cards.map(card => ({
        value: card.id,
        label: `${card.name} (${card.bank})`
      }));
    } else if (field.toLowerCase().includes('bank')) {
      return testData.banks.map(bank => ({
        value: bank.id,
        label: `${bank.name} (${bank.type})`
      }));
    } else if (field.toLowerCase().includes('user') || field.toLowerCase().includes('mobile')) {
      return testData.users.map(user => ({
        value: user.mobile,
        label: `${user.name} (${user.mobile})`
      }));
    } else if (field.toLowerCase().includes('loan')) {
      return testData.loans.map(loan => ({
        value: loan.id,
        label: `${loan.type} - ${loan.amount}`
      }));
    }
    return [];
  };

  const makeApiCall = async () => {
    if (!api) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const baseUrl = getEnvironmentUrl(selectedEnvironment, api.endpoint?.startsWith('v1-'));
      const url = `${baseUrl}${api.endpoint}`;
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sandbox_token_12345'
      };

      const options = {
        method: selectedMethod,
        headers,
        ...(selectedMethod !== 'GET' && { body: JSON.stringify(requestData) })
      };

      // Try real API first, fallback to mock if it fails
      let response;
      try {
        response = await fetch(url, options);
        const data = await response.json();

        setResponse({
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          data
        });
      } catch (apiError) {
        console.warn('Real API failed, falling back to mock server:', apiError.message);
        
        // Fallback to mock server
        const mockResponse = await mockApiServer.makeRequest(url, options);
        const mockData = await mockResponse.json();

        setResponse({
          status: mockResponse.status,
          statusText: mockResponse.statusText,
          headers: Object.fromEntries(mockResponse.headers.entries()),
          data: mockData
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateCurlCommand = () => {
    if (!api) return '';

    const baseUrl = getEnvironmentUrl(selectedEnvironment, api.endpoint?.startsWith('v1-'));
    const url = `${baseUrl}${api.endpoint}`;
    
    let curl = `curl -X ${selectedMethod} "${url}" \\\n`;
    curl += `  -H "Content-Type: application/json" \\\n`;
    curl += `  -H "Authorization: Bearer sandbox_token_12345"`;
    
    if (selectedMethod !== 'GET' && Object.keys(requestData).length > 0) {
      curl += ` \\\n  -d '${JSON.stringify(requestData, null, 2)}'`;
    }

    return curl;
  };

  const renderRequestForm = () => {
    if (!api) return null;

    const currentApiData = api.methods.length > 1 ? api[selectedMethod.toLowerCase()] : api;
    const requestSchema = currentApiData.requestSchema?.properties || {};

    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Request Parameters
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(requestSchema).map(([field, schema]) => (
            <Grid item xs={12} sm={6} key={field}>
              <FormControl fullWidth>
                {getTestDataOptions(field).length > 0 ? (
                  <>
                    <InputLabel>{field}</InputLabel>
                    <Select
                      value={requestData[field] || ''}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      label={field}
                    >
                      {getTestDataOptions(field).map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </>
                ) : (
                  <TextField
                    label={field}
                    value={requestData[field] || ''}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    fullWidth
                    helperText={schema.description}
                    required={schema.required}
                  />
                )}
              </FormControl>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  const renderResponse = () => {
    if (!response) return null;

    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Response</Typography>
          <Chip 
            label={`${response.status} ${response.statusText}`}
            color={response.status >= 200 && response.status < 300 ? 'success' : 'error'}
            sx={{ ml: 2 }}
          />
        </Box>
        
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Response Headers</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              component="pre"
              sx={{
                backgroundColor: '#f8fafc',
                p: 2,
                borderRadius: 1,
                fontSize: '0.875rem',
                fontFamily: 'monospace'
              }}
            >
              {JSON.stringify(response.headers, null, 2)}
            </Box>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Response Body</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              component="pre"
              sx={{
                backgroundColor: '#f8fafc',
                p: 2,
                borderRadius: 1,
                fontSize: '0.875rem',
                fontFamily: 'monospace',
                maxHeight: 400,
                overflow: 'auto'
              }}
            >
              {JSON.stringify(response.data, null, 2)}
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
    );
  };

  if (!api) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">Select an API endpoint to test it in the sandbox.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2">
            API Sandbox
          </Typography>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={initializeRequestData}
          >
            Reset
          </Button>
        </Box>

        {/* Environment and Method Selection */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Environment</InputLabel>
              <Select
                value={selectedEnvironment}
                onChange={(e) => setSelectedEnvironment(e.target.value)}
                label="Environment"
              >
                <MenuItem value="uat">UAT</MenuItem>
                <MenuItem value="production">Production</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Method</InputLabel>
              <Select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                label="Method"
              >
                {api.methods.map(method => (
                  <MenuItem key={method} value={method}>{method}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="Request" icon={<SettingsIcon />} />
            <Tab label="cURL" icon={<CodeIcon />} />
            <Tab label="Response" icon={<DescriptionIcon />} />
          </Tabs>
        </Box>

        {/* Request Tab */}
        {activeTab === 0 && (
          <Box>
            {renderRequestForm()}
            
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <PlayArrowIcon />}
                onClick={makeApiCall}
                disabled={loading}
              >
                {loading ? 'Testing...' : 'Test API'}
              </Button>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        )}

        {/* cURL Tab */}
        {activeTab === 1 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">cURL Command</Typography>
              <Button
                startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
                onClick={() => copyToClipboard(generateCurlCommand())}
                variant="outlined"
                size="small"
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </Box>
            <Box
              component="pre"
              sx={{
                backgroundColor: '#1e293b',
                color: '#e2e8f0',
                p: 3,
                borderRadius: 2,
                fontSize: '0.875rem',
                fontFamily: 'monospace',
                overflow: 'auto'
              }}
            >
              {generateCurlCommand()}
            </Box>
          </Box>
        )}

        {/* Response Tab */}
        {activeTab === 2 && (
          <Box>
            {response ? (
              renderResponse()
            ) : (
              <Alert severity="info">
                Make an API call to see the response here.
              </Alert>
            )}
          </Box>
        )}
      </Paper>

      {/* Test Data Reference */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Available Test Data
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(testData).map(([category, items]) => (
            <Grid item xs={12} sm={6} md={3} key={category}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {category.charAt(0).toUpperCase() + category.slice(1)} ({items.length})
                  </Typography>
                  <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                    {items.map((item, index) => (
                      <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                        • {item.name || item.type || item.id}
                      </Typography>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default ApiSandbox; 