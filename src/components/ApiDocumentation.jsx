import { useState } from 'react';
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
  TableRow
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
  Cloud as CloudIcon
} from '@mui/icons-material';
import { apiData, cardGeniusApiData } from '../data/apiData';
import { environments, getEnvironmentUrl } from '../config/environments';

const allApis = { ...apiData, ...cardGeniusApiData };

const ApiDocumentation = () => {
  const { endpoint } = useParams();
  const api = allApis[endpoint];
  const [selectedMethod, setSelectedMethod] = useState(api?.methods[0] || 'POST');
  const [selectedEnvironment, setSelectedEnvironment] = useState('staging');

  if (!api) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          API endpoint not found. Please select a valid endpoint from the sidebar.
        </Alert>
      </Box>
    );
  }

  const hasMultipleMethods = api.methods.length > 1;
  const currentApiData = hasMultipleMethods ? api[selectedMethod.toLowerCase()] : api;

  const renderSchemaProperties = (properties) => {
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
    return (
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
        {JSON.stringify(data, null, 2)}
      </Box>
    );
  };

  const renderCurlExample = (curlExample, environment = 'staging') => {
    if (!curlExample) return null;
    
    // Replace the URL in the cURL example with the selected environment
    const baseUrl = getEnvironmentUrl(environment, endpoint.startsWith('v1-'));
    const updatedCurl = curlExample.replace(
      /https:\/\/[^/]+/,
      baseUrl
    );

    return (
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
        {updatedCurl}
      </Box>
    );
  };

  const renderFieldTable = (fieldTable) => {
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

  return (
    <Box sx={{ maxWidth: '100%' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
          {api.name}
        </Typography>
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
      {api.importantNotes && (
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

      <Grid container spacing={4}>
        {/* cURL Example with Environment Switcher */}
        {currentApiData.curlExample && (
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CodeIcon sx={{ mr: 1 }} />
                  Sample Request (cURL)
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                {/* Environment Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                  <Tabs value={selectedEnvironment} onChange={handleEnvironmentChange}>
                    <Tab 
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CloudIcon fontSize="small" />
                          Staging
                        </Box>
                      }
                      value="staging"
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
          </Grid>
        )}

        {/* Field Table */}
        {currentApiData.fieldTable && (
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
        {currentApiData.headers && (
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

        {/* Additional Examples */}
        {currentApiData.additionalExamples && (
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

        {/* Request Schema */}
        {currentApiData.requestSchema && (
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 2, height: 'fit-content' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CodeIcon sx={{ mr: 1 }} />
                  Request Schema
                </Typography>
                <Divider sx={{ mb: 3 }} />
                {renderSchemaProperties(currentApiData.requestSchema.properties)}
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Response Schema */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, height: 'fit-content' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CodeIcon sx={{ mr: 1 }} />
                Response Schema
              </Typography>
              <Divider sx={{ mb: 3 }} />
              {currentApiData.responseSchema && renderSchemaProperties(currentApiData.responseSchema.properties)}
            </CardContent>
          </Card>
        </Grid>

        {/* Sample Request */}
        {currentApiData.sampleRequest && (
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CheckCircleIcon sx={{ mr: 1, color: 'success.main' }} />
                  Sample Request
                </Typography>
                <Divider sx={{ mb: 3 }} />
                {renderJson(currentApiData.sampleRequest)}
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Success Response */}
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

        {/* Error Responses - Specific for partner-token API */}
        {currentApiData.errorResponses && (
          <Grid item xs={12}>
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

        {/* Error Response - Generic fallback */}
        {currentApiData.errorResponse && !currentApiData.errorResponses && (
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

        {/* Validation Notes */}
        {currentApiData.validationNotes && (
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

        {/* HTTP Methods Details */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                HTTP Methods
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={3}>
                {api.methods.map((method) => (
                  <Grid item xs={12} sm={6} md={4} key={method}>
                    <Paper 
                      elevation={1} 
                      sx={{ 
                        p: 3, 
                        border: '1px solid',
                        borderColor: method === 'GET' ? 'success.main' : 
                                   method === 'POST' ? 'primary.main' : 'grey.300',
                        borderRadius: 2
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Chip
                          label={method}
                          color={method === 'GET' ? 'success' : method === 'POST' ? 'primary' : 'default'}
                          size="medium"
                          sx={{ mr: 2 }}
                        />
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {method === 'GET' ? 'Retrieve data' : 
                           method === 'POST' ? 'Create/Submit data' : 'Update data'}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {method === 'GET' ? 'Use this method to retrieve lead information' :
                         method === 'POST' ? 'Use this method to create new leads or submit applications' :
                         'Use this method to update existing data'}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Additional Information */}
        <Grid item xs={12}>
          <Accordion sx={{ borderRadius: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Additional Information</Typography>
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
      </Grid>
    </Box>
  );
};

export default ApiDocumentation; 