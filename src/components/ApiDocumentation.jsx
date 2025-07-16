import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Divider,
  Grid,
  Card,
  CardContent,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  AlertTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Button
} from '@mui/material';
import {
  Http as HttpIcon,
  Code as CodeIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
  Security as SecurityIcon,
  Warning as WarningIcon,
  TableChart as TableChartIcon,
  Cloud as CloudIcon,
  PlayArrow as PlayArrowIcon,
  RocketLaunch as RocketLaunchIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
  Build as BuildIcon,
  Science as ScienceIcon
} from '@mui/icons-material';
import { environments, getEnvironmentUrl, getApiBaseUrl } from '../config/environments';
import { apiData } from '../data/apiData';
import ApiSandbox from './ApiSandbox';

const API_BASE_URL = getApiBaseUrl();

const ApiDocumentation = () => {
  const { endpoint } = useParams();
  const [api, setApi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('POST');
  const [selectedEnvironment, setSelectedEnvironment] = useState('uat');
  const [showSandbox, setShowSandbox] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    advanced: false,
    testing: false
  });

  useEffect(() => {
    const fetchApiData = async () => {
      try {
        setLoading(true);
        

        
        // If no API URL is configured, use static data directly
        if (!API_BASE_URL) {
          const foundApi = apiData[endpoint];
          if (foundApi) {
            setApi(foundApi);
            setSelectedMethod(foundApi.methods[0] || 'POST');
          } else {
            setError('API endpoint not found');
          }
          return;
        }
        

        const response = await fetch(`${API_BASE_URL}/endpoints`);
        if (!response.ok) {
          throw new Error('Failed to fetch API data');
        }
        const endpointsData = await response.json();

        const foundApi = endpointsData[endpoint];

        
        if (foundApi) {
          setApi(foundApi);
          setSelectedMethod(foundApi.methods[0] || 'POST');
        } else {
          setError('API endpoint not found');
        }
      } catch (err) {
        console.warn('API not available, falling back to static data:', err.message);
        // Fallback to static data if API is not available
        const foundApi = apiData[endpoint];
        if (foundApi) {
          setApi(foundApi);
          setSelectedMethod(foundApi.methods[0] || 'POST');
        } else {
          setError('API endpoint not found');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApiData();
  }, [endpoint]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !api) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {error || 'API endpoint not found. Please select a valid endpoint from the sidebar.'}
        </Alert>
      </Box>
    );
  }

  const hasMultipleMethods = api.methods.length > 1;
  const currentApiData = hasMultipleMethods ? api[selectedMethod.toLowerCase()] : api;

  const renderSchemaProperties = (properties) => {
    if (!properties || typeof properties !== 'object') {
      return null;
    }
    
    return Object.entries(properties).map(([key, prop]) => (
      <Box key={key} sx={{ mb: 2, p: 2, border: '1px solid #e2e8f0', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mr: 1 }}>
            {key}
          </Typography>
          <Chip 
            label={prop.type} 
            size="small" 
            color="primary" 
            variant="outlined"
            sx={{ mr: 1 }}
          />
          {prop.required && (
            <Chip 
              label="Required" 
              size="small" 
              color="error" 
              variant="outlined"
            />
          )}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {prop.description}
        </Typography>
        {prop.validation && (
          <Typography variant="caption" color="text.secondary">
            <strong>Validation:</strong> {prop.validation}
          </Typography>
        )}
        {prop.properties && (
          <Box sx={{ ml: 2, mt: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
              Nested Properties:
            </Typography>
            {renderSchemaProperties(prop.properties)}
          </Box>
        )}
      </Box>
    ));
  };

  const renderJson = (data) => {
    if (!data) {
      return null;
    }
    
    const jsonString = JSON.stringify(data, null, 2);
    
    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(jsonString);
        console.log('JSON copied to clipboard');
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    };

    return (
      <Box sx={{ position: 'relative' }}>
        <Button
          variant="outlined"
          size="small"
          onClick={copyToClipboard}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
            backgroundColor: 'rgba(248, 250, 252, 0.9)',
            color: '#475569',
            '&:hover': {
              backgroundColor: 'rgba(248, 250, 252, 1)',
            }
          }}
        >
          Copy
        </Button>
        <Box
          component="pre"
          sx={{
            backgroundColor: '#f8fafc',
            p: 3,
            borderRadius: 2,
            overflow: 'auto',
            fontSize: '0.875rem',
            fontFamily: 'monospace',
            border: '1px solid #e2e8f0',
            lineHeight: 1.6
          }}
        >
          {jsonString}
        </Box>
      </Box>
    );
  };

      const renderCurlExample = (curlExample, environment = 'staging') => {
      if (!curlExample) return null;
      

      
      // Use environment-specific cURL if available, otherwise fall back to the default
      let curlToUse = curlExample;
      
      if ((environment === 'staging' || environment === 'uat') && currentApiData.curlExampleStaging) {
        curlToUse = currentApiData.curlExampleStaging;

      } else if (environment === 'production' && currentApiData.curlExampleProduction) {
        curlToUse = currentApiData.curlExampleProduction;

      } else {
        // Fall back to the default cURL and replace the URL
        const baseUrl = getEnvironmentUrl(environment, endpoint.startsWith('v1-'));
        curlToUse = curlExample.replace(
          /https:\/\/[^/]+/,
          baseUrl
        );

      }

    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(curlToUse);
        console.log('cURL copied to clipboard');
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    };

    return (
      <Box sx={{ position: 'relative' }}>
        <Button
          variant="outlined"
          size="small"
          onClick={copyToClipboard}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            color: '#e2e8f0',
            '&:hover': {
              backgroundColor: 'rgba(30, 41, 59, 0.9)',
            }
          }}
        >
          Copy
        </Button>
        <Box
          component="pre"
          sx={{
            backgroundColor: '#1e293b',
            color: '#e2e8f0',
            p: 3,
            borderRadius: 2,
            overflow: 'auto',
            fontSize: '0.875rem',
            fontFamily: 'monospace',
            border: '1px solid #334155',
            lineHeight: 1.6
          }}
        >
          {curlToUse}
        </Box>
      </Box>
    );
  };

  const renderFieldTable = (fieldTable) => {
    if (!fieldTable || !Array.isArray(fieldTable)) {
      return null;
    }
    
    return (
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8fafc' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Field Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Required</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Description / Constraints</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fieldTable.map((field, index) => (
              <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f8fafc' } }}>
                <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                  {field.field}
                </TableCell>
                <TableCell>
                  <Chip label={field.type} size="small" color="primary" variant="outlined" />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={field.required} 
                    size="small" 
                    color={field.required === 'Yes' ? 'error' : 'default'} 
                    variant="outlined" 
                  />
                </TableCell>
                <TableCell sx={{ fontSize: '0.875rem' }}>
                  {field.description}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const handleMethodChange = (event, newValue) => {
    setSelectedMethod(newValue);
  };

  const handleEnvironmentChange = (event, newValue) => {
    setSelectedEnvironment(newValue);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <Box sx={{ maxWidth: '100%' }}>
      {/* ===== QUICK NAVIGATION ===== */}
      <Box sx={{ 
        mb: 4, 
        p: 3, 
        backgroundColor: '#f8fafc', 
        borderRadius: 2, 
        border: '1px solid #e2e8f0',
        position: 'sticky',
        top: 16,
        zIndex: 1000
      }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
          📋 Quick Navigation
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => document.getElementById('quick-start')?.scrollIntoView({ behavior: 'smooth' })}
            startIcon={<RocketLaunchIcon />}
          >
            Quick Start
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => document.getElementById('request-details')?.scrollIntoView({ behavior: 'smooth' })}
            startIcon={<UploadIcon />}
          >
            Request Details
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => document.getElementById('response-details')?.scrollIntoView({ behavior: 'smooth' })}
            startIcon={<DownloadIcon />}
          >
            Response Details
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              toggleSection('advanced');
              setTimeout(() => {
                document.getElementById('advanced-info')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            startIcon={<BuildIcon />}
          >
            Advanced Info
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              toggleSection('testing');
              setTimeout(() => {
                document.getElementById('testing-examples')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            startIcon={<ScienceIcon />}
          >
            Testing & Examples
          </Button>
        </Box>
      </Box>

      {/* ===== QUICK START SECTION ===== */}
      <Box id="quick-start" sx={{ mb: 6 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          mb: 4,
          p: 3,
          backgroundColor: '#f8fafc',
          borderRadius: 2,
          border: '1px solid #e2e8f0'
        }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            🚀 Quick Start
          </Typography>
          <Chip 
            label="Essential Info" 
            size="small" 
            color="primary" 
            variant="outlined"
          />
        </Box>
        
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
              {api.name}
            </Typography>
            {api.status && (
              <Chip
                label={api.status === 'live' ? 'Live' : api.status === 'coming-soon' ? 'Coming Soon' : api.status}
                color={api.status === 'live' ? 'success' : api.status === 'coming-soon' ? 'warning' : 'default'}
                variant="filled"
                size="medium"
                sx={{ 
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  '& .MuiChip-label': {
                    px: 2
                  }
                }}
              />
            )}
          </Box>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            {api.description}
          </Typography>
          {api.purpose && (
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
              <strong>Purpose:</strong> {api.purpose}
            </Typography>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <HttpIcon color="primary" sx={{ fontSize: 28 }} />
            <Typography variant="h5" component="code" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
              {api.endpoint}
            </Typography>
          </Box>
          
          {/* Method Tabs */}
          {hasMultipleMethods ? (
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
              <Tabs value={selectedMethod} onChange={handleMethodChange}>
                {api.methods.map((method) => (
                  <Tab 
                    key={method}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={method}
                          color={method === 'GET' ? 'success' : method === 'POST' ? 'primary' : 'default'}
                          size="small"
                          variant="filled"
                        />
                        <Typography variant="body2">
                          {method === 'GET' ? 'Retrieve' : 'Create/Submit'}
                        </Typography>
                      </Box>
                    }
                    value={method}
                  />
                ))}
              </Tabs>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1, mb: 4 }}>
              {api.methods.map((method) => (
                <Chip
                  key={method}
                  label={method}
                  color={method === 'GET' ? 'success' : method === 'POST' ? 'primary' : 'default'}
                  variant="filled"
                  size="medium"
                  sx={{ fontSize: '1rem', px: 2, py: 1 }}
                />
              ))}
            </Box>
          )}
        </Box>

        {/* Important Notes Alert */}
        {api.importantNotes && Array.isArray(api.importantNotes) && (
          <Alert 
            severity="warning" 
            icon={<SecurityIcon />}
            sx={{ mb: 4, borderRadius: 2 }}
          >
            <AlertTitle sx={{ fontWeight: 'bold' }}>Important Security Notes</AlertTitle>
            <List dense sx={{ py: 0 }}>
              {api.importantNotes.map((note, index) => (
                <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                  <ListItemText 
                    primary={note}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
            </List>
          </Alert>
        )}

        {/* Quick cURL Example */}
        {currentApiData.curlExample && (
          <Card sx={{ borderRadius: 2, mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CodeIcon sx={{ mr: 1 }} />
                Quick Start (cURL)
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              {/* Environment Tabs */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={selectedEnvironment} onChange={handleEnvironmentChange}>
                  <Tab 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CloudIcon fontSize="small" />
                        UAT
                      </Box>
                    }
                    value="uat"
                  />
                  <Tab 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CloudIcon fontSize="small" />
                        Production
                      </Box>
                    }
                    value="production"
                  />
                </Tabs>
              </Box>
              
              {renderCurlExample(currentApiData.curlExample, selectedEnvironment)}
            </CardContent>
          </Card>
        )}
      </Box>

      {/* ===== REQUEST DETAILS SECTION ===== */}
      <Box id="request-details" sx={{ mb: 6 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          mb: 4,
          p: 3,
          backgroundColor: '#fef3c7',
          borderRadius: 2,
          border: '1px solid #f59e0b'
        }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
            📤 Request Details
          </Typography>
          <Chip 
            label="Input Data" 
            size="small" 
            color="warning" 
            variant="outlined"
          />
        </Box>
        
        <Grid container spacing={4}>
          {/* Field Table */}
          {currentApiData.fieldTable && Array.isArray(currentApiData.fieldTable) && currentApiData.fieldTable.length > 0 && (
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TableChartIcon sx={{ mr: 1 }} />
                    Request Fields
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  {renderFieldTable(currentApiData.fieldTable)}
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Headers Table */}
          {currentApiData.headers && Array.isArray(currentApiData.headers) && currentApiData.headers.length > 0 && (
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <HttpIcon sx={{ mr: 1 }} />
                    Required Headers
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                          <TableCell sx={{ fontWeight: 'bold' }}>Header</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Value</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Required</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {currentApiData.headers.map((header, index) => (
                          <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f8fafc' } }}>
                            <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                              {header.header}
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.875rem' }}>
                              {header.value}
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={header.required ? 'Yes' : 'No'} 
                                size="small" 
                                color={header.required ? 'error' : 'default'} 
                                variant="outlined" 
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Request Schema */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 2, height: 'fit-content' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CodeIcon sx={{ mr: 1 }} />
                  Request Schema
                </Typography>
                <Divider sx={{ mb: 3 }} />
                {currentApiData.requestSchema && currentApiData.requestSchema.properties && Object.keys(currentApiData.requestSchema.properties).length > 0 ? (
                  renderSchemaProperties(currentApiData.requestSchema.properties)
                ) : (
                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    <AlertTitle>No Request Schema Available</AlertTitle>
                    {api.methods.includes('GET') && api.methods.length === 1 ? (
                      'This GET endpoint does not require a request body or parameters.'
                    ) : (
                      'Request schema has not been defined for this endpoint. Check the admin panel to add request details.'
                    )}
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Sample Request */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CheckCircleIcon sx={{ mr: 1, color: 'success.main' }} />
                  Sample Request
                </Typography>
                <Divider sx={{ mb: 3 }} />
                {(() => {
                  // Check if this is a GET request with no request body
                  const isGetRequest = api.methods.includes('GET') && api.methods.length === 1;
                  const hasEmptyRequest = !currentApiData.sampleRequest || 
                    (typeof currentApiData.sampleRequest === 'object' && 
                     Object.keys(currentApiData.sampleRequest).length === 0);
                  
                  if (isGetRequest && hasEmptyRequest) {
                    return (
                      <Alert severity="info" sx={{ borderRadius: 2 }}>
                        <AlertTitle>No Request Body Required</AlertTitle>
                        This is a GET request that doesn't require a request body. 
                        Simply make the HTTP request with the appropriate headers.
                      </Alert>
                    );
                  } else if (currentApiData.sampleRequest && Object.keys(currentApiData.sampleRequest).length > 0) {
                    return renderJson(currentApiData.sampleRequest);
                  } else {
                    return (
                      <Alert severity="info" sx={{ borderRadius: 2 }}>
                        <AlertTitle>No Sample Request Available</AlertTitle>
                        No sample request data has been provided for this endpoint.
                      </Alert>
                    );
                  }
                })()}
              </CardContent>
            </Card>
          </Grid>

          {/* Validation Notes */}
          {currentApiData.validationNotes && Array.isArray(currentApiData.validationNotes) && currentApiData.validationNotes.length > 0 && (
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <InfoIcon sx={{ mr: 1 }} />
                    Validation Notes
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <List dense>
                    {currentApiData.validationNotes.map((note, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <ErrorIcon color="warning" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={note}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* ===== RESPONSE DETAILS SECTION ===== */}
      <Box id="response-details" sx={{ mb: 6 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          mb: 4,
          p: 3,
          backgroundColor: '#dcfce7',
          borderRadius: 2,
          border: '1px solid #22c55e'
        }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
            📥 Response Details
          </Typography>
          <Chip 
            label="Output Data" 
            size="small" 
            color="success" 
            variant="outlined"
          />
        </Box>
        
        <Grid container spacing={4}>
          {/* Response Schema */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 2, height: 'fit-content' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CodeIcon sx={{ mr: 1 }} />
                  Response Schema
                </Typography>
                <Divider sx={{ mb: 3 }} />
                {currentApiData.responseSchema && currentApiData.responseSchema.properties && Object.keys(currentApiData.responseSchema.properties).length > 0 ? (
                  renderSchemaProperties(currentApiData.responseSchema.properties)
                ) : (
                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    <AlertTitle>No Response Schema Available</AlertTitle>
                    Response schema has not been defined for this endpoint. Check the admin panel to add response details.
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Sample Responses */}
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {/* Success Response */}
          {currentApiData.sampleResponse && Object.keys(currentApiData.sampleResponse).length > 0 && (
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CheckCircleIcon sx={{ mr: 1, color: 'success.main' }} />
                    Success Response
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  {renderJson(currentApiData.sampleResponse)}
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Error Response - Generic fallback */}
          {currentApiData.errorResponse && Object.keys(currentApiData.errorResponse).length > 0 && !currentApiData.errorResponses && (
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ErrorIcon sx={{ mr: 1, color: 'error.main' }} />
                    Error Response
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  {renderJson(currentApiData.errorResponse)}
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>

        {/* Fallback when no response data is available */}
        {(!currentApiData.sampleResponse || Object.keys(currentApiData.sampleResponse).length === 0) &&
         (!currentApiData.errorResponse || Object.keys(currentApiData.errorResponse).length === 0) &&
         (!currentApiData.errorResponses || currentApiData.errorResponses.length === 0) && (
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  <AlertTitle>No Sample Responses Available</AlertTitle>
                  Sample responses have not been configured for this endpoint. 
                  Please check the admin panel to add sample response data.
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Error Responses - Specific for partner-token API */}
        {currentApiData.errorResponses && Array.isArray(currentApiData.errorResponses) && currentApiData.errorResponses.length > 0 && (
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ErrorIcon sx={{ mr: 1, color: 'error.main' }} />
                  Error Responses
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                  {currentApiData.errorResponses.map((error, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 3, 
                          border: '1px solid #fecaca',
                          borderRadius: 2,
                          backgroundColor: '#fef2f2'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                            🔴 {error.title}
                          </Typography>
                          <Chip 
                            label={`${error.statusCode}`} 
                            size="small" 
                            color="error" 
                            variant="outlined"
                            sx={{ ml: 2 }}
                          />
                        </Box>
                        {renderJson(error.response)}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Box>

      {/* ===== ADVANCED INFORMATION SECTION ===== */}
      <Box id="advanced-info" sx={{ mb: 6 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          mb: 3,
          p: 3,
          backgroundColor: '#f1f5f9',
          borderRadius: 2,
          border: '1px solid #64748b'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
              🔧 Advanced Information
            </Typography>
            <Chip 
              label="Optional" 
              size="small" 
              color="default" 
              variant="outlined"
            />
          </Box>
          <Button
            variant="outlined"
            size="small"
            onClick={() => toggleSection('advanced')}
            startIcon={expandedSections.advanced ? <ExpandMoreIcon /> : <ExpandMoreIcon sx={{ transform: 'rotate(-90deg)' }} />}
          >
            {expandedSections.advanced ? 'Collapse' : 'Expand'}
          </Button>
        </Box>
        
        {expandedSections.advanced && (
          <>
            {/* Additional Information */}
            <Grid item xs={12}>
              <Accordion sx={{ borderRadius: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">General API Information</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Authentication
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        All API requests require proper authentication. Use the Partner Authentication endpoint 
                        to obtain access tokens before making other API calls.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Rate Limiting
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        API requests are limited to 100 requests per minute per partner. 
                        Exceeding this limit will result in a 429 Too Many Requests response.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Error Handling
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        All errors return a consistent JSON format with error codes and descriptive messages. 
                        Check the response status code and error details for troubleshooting.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Base URL
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        All API endpoints are relative to: <code>https://api.bankkaro.com</code>
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </>
        )}
      </Box>

      {/* ===== TESTING & EXAMPLES SECTION ===== */}
      <Box id="testing-examples" sx={{ mb: 6 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          mb: 3,
          p: 3,
          backgroundColor: '#f0f9ff',
          borderRadius: 2,
          border: '1px solid #0ea5e9'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main' }}>
              🧪 Testing & Examples
            </Typography>
            <Chip 
              label="Interactive" 
              size="small" 
              color="info" 
              variant="outlined"
            />
          </Box>
          <Button
            variant="outlined"
            size="small"
            onClick={() => toggleSection('testing')}
            startIcon={expandedSections.testing ? <ExpandMoreIcon /> : <ExpandMoreIcon sx={{ transform: 'rotate(-90deg)' }} />}
          >
            {expandedSections.testing ? 'Collapse' : 'Expand'}
          </Button>
        </Box>
        
        {expandedSections.testing && (
          <>
            {/* Sandbox Toggle Button */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant={showSandbox ? "contained" : "outlined"}
                startIcon={<PlayArrowIcon />}
                onClick={() => setShowSandbox(!showSandbox)}
                size="large"
                sx={{ 
                  px: 4, 
                  py: 1.5, 
                  borderRadius: 3,
                  fontWeight: 'bold',
                  fontSize: '1.1rem'
                }}
              >
                {showSandbox ? 'Hide Sandbox' : 'Try API in Sandbox'}
              </Button>
            </Box>

            {/* Sandbox Section */}
            {showSandbox && (
              <Box sx={{ mb: 4 }}>
                <ApiSandbox api={api} />
              </Box>
            )}

            {/* Additional Examples */}
            {currentApiData.additionalExamples && Array.isArray(currentApiData.additionalExamples) && currentApiData.additionalExamples.length > 0 && (
              <Grid item xs={12}>
                <Card sx={{ borderRadius: 2 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CodeIcon sx={{ mr: 1 }} />
                      Additional Examples
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    <Grid container spacing={3}>
                      {currentApiData.additionalExamples.map((example, index) => (
                        <Grid item xs={12} key={index}>
                          <Paper 
                            elevation={0} 
                            sx={{ 
                              p: 3, 
                              border: '1px solid #e2e8f0',
                              borderRadius: 2,
                              backgroundColor: '#f8fafc'
                            }}
                          >
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                              {example.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {example.description}
                            </Typography>
                            {renderCurlExample(example.curl, selectedEnvironment)}
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default ApiDocumentation; 