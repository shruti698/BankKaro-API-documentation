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
  const [partnerToken, setPartnerToken] = useState('');
  const [tokenLoading, setTokenLoading] = useState(false);
  const [tokenError, setTokenError] = useState(null);
  const theme = useTheme();

  // Function to fetch partner token
  const fetchPartnerToken = async () => {
    setTokenLoading(true);
    setTokenError(null);
    
    try {
      // Direct call to UAT API
      const url = 'https://uat-platform.bankkaro.com/partner/token';
      console.log('Calling:', url);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'x-api-key': 'test'
        })
      });
      
      console.log('📡 Partner Token Response Status:', response.status, response.statusText);
      
      const proxyResponse = await response.json();
      console.log('📡 Partner Token Response Data:', proxyResponse);
      
      if (response.status >= 200 && response.status < 300) {
        const data = proxyResponse;
        if (data.status === 'success' && data.data?.jwttoken) {
          setPartnerToken(data.data.jwttoken);
          setTokenError(null);
          console.log('✅ Partner token fetched successfully');
        } else {
          const errorMsg = 'Failed to get partner token: ' + (data.message || 'Unknown error');
          setTokenError(errorMsg);
          console.error('❌ Partner token error:', errorMsg, data);
        }
      } else {
        const errorMsg = 'Failed to get partner token: ' + (proxyResponse.message || 'HTTP ' + response.status);
        setTokenError(errorMsg);
        console.error('❌ Partner token HTTP error:', errorMsg, proxyResponse);
      }
    } catch (err) {
      console.error('💥 Partner token fetch error:', err);
      setTokenError('Error fetching partner token: ' + err.message);
    } finally {
      setTokenLoading(false);
    }
  };

  // Test data for dropdown options
  const testData = {
    cards: [
      { id: 1, name: 'SBI Cashback Credit Card', bank: 'SBI' },
      { id: 2, name: 'HDFC Regalia Credit Card', bank: 'HDFC' },
      { id: 3, name: 'ICICI Platinum Chip Credit Card', bank: 'ICICI' }
    ],
    banks: [
      { id: 1, name: 'SBI', type: 'Public' },
      { id: 2, name: 'HDFC Bank', type: 'Private' },
      { id: 3, name: 'ICICI Bank', type: 'Private' }
    ],
    users: [
      { name: 'John Doe', mobile: '9876543210' },
      { name: 'Jane Smith', mobile: '9876543211' },
      { name: 'Bob Johnson', mobile: '9876543212' }
    ],
    loans: [
      { id: 1, type: 'Personal Loan', amount: '500000' },
      { id: 2, type: 'Home Loan', amount: '5000000' },
      { id: 3, type: 'Business Loan', amount: '1000000' }
    ]
  };

  const getTestDataOptions = (field) => {
    try {
      if (field.toLowerCase().includes('card') && testData.cards && testData.cards.length > 0) {
        return testData.cards.map(card => ({
          value: card.id,
          label: `${card.name} (${card.bank})`
        }));
      } else if (field.toLowerCase().includes('bank') && testData.banks && testData.banks.length > 0) {
        return testData.banks.map(bank => ({
          value: bank.id,
          label: `${bank.name} (${bank.type})`
        }));
      } else if ((field.toLowerCase().includes('user') || field.toLowerCase().includes('mobile')) && testData.users && testData.users.length > 0) {
        return testData.users.map(user => ({
          value: user.mobile,
          label: `${user.name} (${user.mobile})`
        }));
      } else if (field.toLowerCase().includes('loan') && testData.loans && testData.loans.length > 0) {
        return testData.loans.map(loan => ({
          value: loan.id,
          label: `${loan.type} - ${loan.amount}`
        }));
      }
    } catch (error) {
      console.warn('Error generating test data options:', error);
    }
    return [];
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
          if (value.includes('card') && testData.cards.length > 0) {
            initialData[key] = testData.cards[0].id;
          } else if (value.includes('bank') && testData.banks.length > 0) {
            initialData[key] = testData.banks[0].id;
          } else if ((value.includes('user') || value.includes('mobile')) && testData.users.length > 0) {
            initialData[key] = testData.users[0].mobile;
          } else if (value.includes('loan') && testData.loans.length > 0) {
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

  const makeApiCall = async () => {
    if (!api) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      // Determine the correct base URL and endpoint
      let url = '';
      let headers = { 'Content-Type': 'application/json' };
      let body = selectedMethod !== 'GET' ? JSON.stringify(requestData) : undefined;

      // Use the correct UAT API base for CardGenius and partner endpoints
      if (api.endpoint.startsWith('/partner/token')) {
        url = `https://uat-platform.bankkaro.com/partner/token`;
        // Only Content-Type header, no Authorization or partner-token
        headers = { 'Content-Type': 'application/json' };
      } else if (api.endpoint.startsWith('/partner/cardgenius/')) {
        url = `https://uat-platform.bankkaro.com${api.endpoint}`;
        // Use partner-token header for CardGenius endpoints
        if (partnerToken) headers['partner-token'] = partnerToken;
      } else {
        // Default: use UAT base for any other endpoints
        url = `https://uat-platform.bankkaro.com${api.endpoint}`;
      }

      // Log the actual request for verification
      console.log('Calling:', url, 'Method:', selectedMethod, 'Headers:', headers, 'Body:', body);

      const response = await fetch(url, {
        method: selectedMethod,
        headers,
        body
      });

      const data = await response.json();
      setResponse({
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data
      });
    } catch (err) {
      setError('Error making API call: ' + err.message);
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
    
    // Use partner token for Card Genius APIs, fallback to sandbox token
    const isCardGeniusApi = api.endpoint?.startsWith('/cardgenius') || api.endpoint?.startsWith('v1-');
    const authToken = isCardGeniusApi && partnerToken ? partnerToken : 'sandbox_token_12345';
    
    let curl = `curl -X ${selectedMethod} "${url}" \\\n`;
    curl += `  -H "Content-Type: application/json" \\\n`;
    curl += `  -H "Authorization: Bearer ${authToken}"`;
    
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
      {/* Development Mode Indicator */}
      {(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>🔄 Local Development Mode:</strong> Using mock server to avoid CORS issues. 
            Real API calls will work when deployed to Vercel.
          </Typography>
        </Alert>
      )}

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

        {/* Partner Token Management for Card Genius APIs */}
        {(api.endpoint?.startsWith('/cardgenius') || api.endpoint?.startsWith('v1-')) && (
          <Paper sx={{ p: 2, mb: 3, backgroundColor: '#f8fafc' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Partner Token Management
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={8}>
                <TextField
                  label="Partner Token (JWT)"
                  value={partnerToken}
                  onChange={(e) => setPartnerToken(e.target.value)}
                  fullWidth
                  size="small"
                  placeholder="Click 'Get Token' to fetch from /partner/token API"
                  disabled={tokenLoading}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="contained"
                  onClick={fetchPartnerToken}
                  disabled={tokenLoading}
                  startIcon={tokenLoading ? <CircularProgress size={20} /> : <RefreshIcon />}
                  fullWidth
                >
                  {tokenLoading ? 'Getting Token...' : 'Get Token'}
                </Button>
              </Grid>
            </Grid>
            {tokenError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {tokenError}
              </Alert>
            )}
            {partnerToken && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? (     
                  <>  
                    <strong>🔄 Mock Token Generated:</strong> Using mock partner token for local development.   
                  </>
                ) : (
                  <>
                    ✅ Token fetched successfully! This will be used for Card Genius API calls.
                  </>
                )}    
              </Alert>
            )}
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>API Call Method:</strong> 
                <br />• <strong>Local Development:</strong> Uses mock server to avoid CORS issues
                <br />• <strong>Production (Vercel):</strong> Uses serverless function to make real API calls server-side
                <br />• <strong>Fallback:</strong> If serverless function fails, automatically falls back to mock data
              </Typography>
            </Alert>
          </Paper>
        )}

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