import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Alert,
  Switch,
  FormControlLabel
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  Code as CodeIcon,
  Description as DescriptionIcon,
  Settings as SettingsIcon,
  Save as SaveIcon,
  GitHub as GitHubIcon,
  FormatIndentIncrease as FormatIcon
} from '@mui/icons-material';
import { apiData } from '../data/apiData';
import { environments, getEnvironmentUrl } from '../config/environments';

const AdminPanel = () => {
  const [endpoints, setEndpoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEndpoint, setEditingEndpoint] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [saveMode, setSaveMode] = useState('local'); // 'local' or 'download'
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    endpoint: '',
    description: '',
    category: '',
    products: ['Loan Genius'],
    purpose: '',
    methods: [],
    requestSchema: {},
    responseSchema: {},
    sampleRequest: {},
    sampleResponse: {},
    sampleResponses: [],
    errorResponse: {},
    errorResponses: [],
    curlExample: '',
    curlExampleStaging: '',
    curlExampleProduction: '',
    validationNotes: [],
    fieldTable: [],
    importantNotes: [],
    headers: [],
    additionalExamples: []
  });

  useEffect(() => {
    fetchEndpoints();
  }, []);

  const fetchEndpoints = async () => {
    try {
      // Use static data from apiData.js
        const staticEndpoints = Object.entries(apiData).map(([id, data]) => {
          return {
            id,
            name: data.name,
            endpoint: data.endpoint,
            description: data.description || '',
            category: data.category || '',
          products: data.products || (data.category === 'Partner APIs' ? ['Loan Genius', 'Card Genius'] : ['Card Genius']),
            purpose: data.purpose || '',
            methods: data.methods || [],
            requestSchema: data.requestSchema || {},
            responseSchema: data.responseSchema || {},
            sampleRequest: data.sampleRequest || {},
            sampleResponse: data.sampleResponse || {},
            sampleResponses: data.sampleResponses || [],
            errorResponse: data.errorResponse || {},
            errorResponses: data.errorResponses || [],
          curlExample: data.curlExample || '',
          curlExampleStaging: data.curlExampleStaging || '',
          curlExampleProduction: data.curlExampleProduction || '',
            validationNotes: data.validationNotes || [],
            fieldTable: data.fieldTable || []
          };
        });
      
        setEndpoints(staticEndpoints);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching endpoints:', error);
      setLoading(false);
    }
  };

  const handleOpenDialog = (endpoint = null) => {
    if (endpoint) {
      setEditingEndpoint(endpoint);
      setFormData({
        id: endpoint.id,
        name: endpoint.name,
        endpoint: endpoint.endpoint,
        description: endpoint.description || '',
        category: endpoint.category || '',
        products: Array.isArray(endpoint.products) ? endpoint.products : 
                 (endpoint.product ? [endpoint.product] : ['Loan Genius']),
        purpose: endpoint.purpose || '',
        methods: endpoint.methods || [],
        requestSchema: endpoint.requestSchema || {},
        responseSchema: endpoint.responseSchema || {},
        sampleRequest: endpoint.sampleRequest || {},
        sampleResponse: endpoint.sampleResponse || {},
        sampleResponses: endpoint.sampleResponses || [],
        errorResponse: endpoint.errorResponse || {},
        errorResponses: endpoint.errorResponses || [],
        curlExample: endpoint.curlExample || '',
        curlExampleStaging: endpoint.curlExampleStaging || '',
        curlExampleProduction: endpoint.curlExampleProduction || '',
        validationNotes: endpoint.validationNotes || [],
        fieldTable: endpoint.fieldTable || [],
        importantNotes: endpoint.importantNotes || [],
        headers: endpoint.headers || [],
        additionalExamples: endpoint.additionalExamples || []
      });
    } else {
      setEditingEndpoint(null);
      setFormData({
        id: '',
        name: '',
        endpoint: '',
        description: '',
        category: '',
        products: ['Loan Genius'],
        purpose: '',
        methods: [],
        requestSchema: {},
        responseSchema: {},
        sampleRequest: {},
        sampleResponse: {},
        sampleResponses: [],
        errorResponse: {},
        errorResponses: [],
        curlExample: '',
        curlExampleStaging: '',
        curlExampleProduction: '',
        validationNotes: [],
        fieldTable: [],
        importantNotes: [],
        headers: [],
        additionalExamples: []
      });
    }
    setOpenDialog(true);
    setActiveTab(0);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingEndpoint(null);
  };

  const saveToApiData = async (updatedEndpoints) => {
    try {
      // Always use local development server if available, otherwise use Vercel API
      const apiUrl = 'http://localhost:3001/api/update-api-data';
        
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          updatedEndpoints,
          mode: saveMode
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate updated content');
      }

      const result = await response.json();
      
      // Handle the response
      if (result.success) {
        if (result.mode === 'local') {
          // Local mode - changes saved directly to file
          alert('✅ Changes saved to local apiData.js file!\n\n🔄 Refreshing to show updated data...');
          // Force refresh the page to reload the updated apiData.js
          setTimeout(() => window.location.reload(), 1000);
        } else {
          // Fallback to download mode
          alert('⚠️ Local save failed, falling back to download mode.\n\nPlease run: npm run dev-server\nThen access: http://localhost:3001/admin');
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error generating updated content:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      // Create updated endpoints object
      const updatedEndpoints = { ...apiData };

      if (editingEndpoint) {
        // Update existing endpoint
        updatedEndpoints[formData.id] = {
          ...apiData[formData.id],
          name: formData.name,
          endpoint: formData.endpoint,
          description: formData.description,
          category: formData.category,
          products: formData.products,
          purpose: formData.purpose,
          methods: formData.methods,
          requestSchema: formData.requestSchema,
          responseSchema: formData.responseSchema,
          sampleRequest: formData.sampleRequest,
          sampleResponse: formData.sampleResponse,
          sampleResponses: formData.sampleResponses,
          errorResponse: formData.errorResponse,
          errorResponses: formData.errorResponses,
          curlExample: formData.curlExample,
          curlExampleStaging: formData.curlExampleStaging,
          curlExampleProduction: formData.curlExampleProduction,
          validationNotes: formData.validationNotes,
          fieldTable: formData.fieldTable,
          importantNotes: formData.importantNotes,
          headers: formData.headers,
          additionalExamples: formData.additionalExamples
        };
      } else {
        // Add new endpoint
        updatedEndpoints[formData.id] = {
          name: formData.name,
          endpoint: formData.endpoint,
          description: formData.description,
          category: formData.category,
          products: formData.products,
          purpose: formData.purpose,
          methods: formData.methods,
          requestSchema: formData.requestSchema,
          responseSchema: formData.responseSchema,
          sampleRequest: formData.sampleRequest,
          sampleResponse: formData.sampleResponse,
          sampleResponses: formData.sampleResponses,
          errorResponse: formData.errorResponse,
          errorResponses: formData.errorResponses,
          curlExample: formData.curlExample,
          curlExampleStaging: formData.curlExampleStaging,
          curlExampleProduction: formData.curlExampleProduction,
          validationNotes: formData.validationNotes,
          fieldTable: formData.fieldTable,
          importantNotes: formData.importantNotes,
          headers: formData.headers,
          additionalExamples: formData.additionalExamples
        };
      }

      // Save to apiData.js
      const result = await saveToApiData(updatedEndpoints);
      
      if (result.success) {
        // The file download and instructions are handled in saveToApiData
      handleCloseDialog();
        fetchEndpoints(); // Refresh the list
      } else {
        alert('❌ Failed to generate updated content. Please try again.');
      }
    } catch (error) {
      console.error('Error saving endpoint:', error);
      alert('❌ Error saving changes: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this endpoint?')) {
      try {
        // Create updated endpoints object without the deleted endpoint
        const updatedEndpoints = { ...apiData };
        delete updatedEndpoints[id];

        // Save to apiData.js
        const result = await saveToApiData(updatedEndpoints);
        
        if (result.success) {
          // The file download and instructions are handled in saveToApiData
          fetchEndpoints(); // Refresh the list
        } else {
          alert('❌ Failed to delete endpoint. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting endpoint:', error);
        alert('❌ Error deleting endpoint: ' + error.message);
      }
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateArrayField = (field, value) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(item => item);
    updateFormData(field, arrayValue);
  };

  const updateJsonField = (field, value) => {
    // If the value is empty, set it to an empty object
    if (!value || value.trim() === '') {
      updateFormData(field, {});
      return;
    }
    
    try {
      // First, try to clean up the value if it's been double-escaped
      let cleanedValue = value;
      
      // Remove extra quotes at the beginning and end if they exist
      if (cleanedValue.startsWith('"') && cleanedValue.endsWith('"')) {
        try {
          // Try to unescape the string
          cleanedValue = JSON.parse(cleanedValue);
        } catch (e) {
          // If that fails, just remove the outer quotes
          cleanedValue = cleanedValue.slice(1, -1);
        }
      }
      
      // Parse the JSON
      const jsonValue = JSON.parse(cleanedValue);
      updateFormData(field, jsonValue);
    } catch (error) {
      // If parsing fails, store as string but show a warning
      console.warn(`Failed to parse JSON for ${field}:`, error);
      updateFormData(field, value);
    }
  };

  // Function to generate environment-aware cURL examples
  const generateEnvironmentCurlExamples = (baseCurl, endpoint) => {
    if (!baseCurl) return { uat: '', prod: '', base: '' };
    
    const isCardGenius = endpoint && endpoint.startsWith('cardgenius');
    
    // UAT environment
    const uatUrl = getEnvironmentUrl('uat', isCardGenius);
    const uatCurl = baseCurl.replace(/https:\/\/[^/]+/, uatUrl);
    
    // Production environment
    const prodUrl = getEnvironmentUrl('production', isCardGenius);
    const prodCurl = baseCurl.replace(/https:\/\/[^/]+/, prodUrl);
    
    return {
      base: baseCurl,
      uat: uatCurl,
      prod: prodCurl
    };
  };

  // Helper function to safely get JSON string for display
  const getJsonDisplayValue = (field) => {
    const value = formData[field];
    
    // If it's empty or null, return empty string
    if (!value || (typeof value === 'object' && Object.keys(value).length === 0)) {
      return '';
    }
    
    if (typeof value === 'string') {
      // If it's already a string, try to parse it as JSON for display
      try {
        const parsed = JSON.parse(value);
        return JSON.stringify(parsed, null, 2);
      } catch (e) {
        // If it's not valid JSON, return as is
        return value;
      }
    }
    
    // If it's an object, stringify it
    return JSON.stringify(value, null, 2);
  };

  // Function to format JSON
  const formatJson = (field) => {
    const value = formData[field];
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        updateFormData(field, parsed);
      } catch (e) {
        alert('Invalid JSON format. Please check your syntax.');
      }
    }
  };

  // Function to clear JSON field
  const clearJsonField = (field) => {
    updateFormData(field, {});
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          API Documentation Admin
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControlLabel
            control={
              <Switch
                checked={saveMode === 'local'}
                onChange={(e) => setSaveMode(e.target.checked ? 'local' : 'download')}
              />
            }
            label="Local save mode (recommended for development)"
          />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Endpoint
        </Button>
        </Box>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Save Mode:</strong> 
          {saveMode === 'local' 
            ? ' Changes are saved directly to the local apiData.js file. Perfect for development with multiple changes. For true local development, run "npm run dev-server" and access via http://localhost:3001'
            : ' Changes generate a downloadable apiData.js file. Use this for production deployment.'
          }
        </Typography>
      </Alert>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Endpoint</TableCell>
              <TableCell>Products</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Methods</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {endpoints.map((endpoint) => (
              <TableRow key={endpoint.id}>
                <TableCell>{endpoint.id}</TableCell>
                <TableCell>{endpoint.name}</TableCell>
                <TableCell>{endpoint.endpoint}</TableCell>
                <TableCell>
                  {(endpoint.products || [endpoint.product]).filter(Boolean).map((product, index) => (
                    <Chip 
                      key={index}
                      label={product} 
                      color={product === 'Loan Genius' ? 'primary' : 'secondary'}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </TableCell>
                <TableCell>{endpoint.category}</TableCell>
                <TableCell>
                  {endpoint.methods?.map((method) => (
                    <Chip key={method} label={method} size="small" sx={{ mr: 0.5 }} />
                  ))}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(endpoint)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(endpoint.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>
          {editingEndpoint ? 'Edit Endpoint' : 'Add New Endpoint'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
              <Tab icon={<DescriptionIcon />} label="Basic Info" />
              <Tab icon={<CodeIcon />} label="Schemas & Examples" />
              <Tab icon={<SettingsIcon />} label="Advanced" />
            </Tabs>
          </Box>

          {activeTab === 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="ID"
                value={formData.id}
                onChange={(e) => updateFormData('id', e.target.value)}
                disabled={!!editingEndpoint}
                helperText="Unique identifier for the endpoint"
              />
              <TextField
                label="Name"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                fullWidth
                helperText="Display name for the endpoint"
              />
              <TextField
                label="Endpoint URL"
                value={formData.endpoint}
                onChange={(e) => updateFormData('endpoint', e.target.value)}
                fullWidth
                helperText="API endpoint path (e.g., /api/users)"
              />
              <TextField
                label="Description"
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                multiline
                rows={2}
                fullWidth
                helperText="Brief description of what this endpoint does"
              />
              <TextField
                label="Purpose"
                value={formData.purpose}
                onChange={(e) => updateFormData('purpose', e.target.value)}
                multiline
                rows={2}
                fullWidth
                helperText="Detailed purpose and use case"
              />
              <TextField
                label="Category"
                value={formData.category}
                onChange={(e) => updateFormData('category', e.target.value)}
                fullWidth
                helperText="API category (e.g., Partner APIs, User APIs)"
              />
              <FormControl fullWidth>
                <InputLabel>Products</InputLabel>
                <Select
                  multiple
                  value={Array.isArray(formData.products) ? formData.products : ['Loan Genius']}
                  onChange={(e) => updateFormData('products', e.target.value)}
                  label="Products"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem value="Loan Genius">Loan Genius</MenuItem>
                  <MenuItem value="Card Genius">Card Genius</MenuItem>
                  <MenuItem value="Education Genius">Education Genius (Coming Soon)</MenuItem>
                </Select>
                <FormHelperText>Select all products this endpoint supports</FormHelperText>
              </FormControl>
              <TextField
                label="Methods (comma-separated)"
                value={formData.methods.join(', ')}
                onChange={(e) => updateArrayField('methods', e.target.value)}
                placeholder="GET, POST, PUT, DELETE"
                fullWidth
                helperText="HTTP methods supported by this endpoint"
              />
              

            </Box>
          )}

          {activeTab === 1 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Request Schema (JSON)</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Enter valid JSON schema for the request
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          startIcon={<FormatIcon />}
                          onClick={() => formatJson('requestSchema')}
                          variant="outlined"
                        >
                          Format JSON
                        </Button>
                        <Button
                          size="small"
                          onClick={() => clearJsonField('requestSchema')}
                          variant="outlined"
                          color="warning"
                        >
                          Clear
                        </Button>
                      </Box>
                    </Box>
                  <TextField
                    multiline
                    rows={8}
                    fullWidth
                      value={getJsonDisplayValue('requestSchema')}
                    onChange={(e) => updateJsonField('requestSchema', e.target.value)}
                    placeholder='{"type": "object", "properties": {...}}'
                      error={typeof formData.requestSchema === 'string' && formData.requestSchema !== ''}
                      helperText={typeof formData.requestSchema === 'string' && formData.requestSchema !== '' 
                        ? '⚠️ Invalid JSON format. Please check your syntax.' 
                        : 'Paste your JSON here - it will be automatically cleaned up'}
                  />
                  </Box>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Response Schema (JSON)</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Enter valid JSON schema for the response
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          startIcon={<FormatIcon />}
                          onClick={() => formatJson('responseSchema')}
                          variant="outlined"
                        >
                          Format JSON
                        </Button>
                        <Button
                          size="small"
                          onClick={() => clearJsonField('responseSchema')}
                          variant="outlined"
                          color="warning"
                        >
                          Clear
                        </Button>
                      </Box>
                    </Box>
                  <TextField
                    multiline
                    rows={8}
                    fullWidth
                      value={getJsonDisplayValue('responseSchema')}
                    onChange={(e) => updateJsonField('responseSchema', e.target.value)}
                    placeholder='{"type": "object", "properties": {...}}'
                      error={typeof formData.responseSchema === 'string' && formData.responseSchema !== ''}
                      helperText={typeof formData.responseSchema === 'string' && formData.responseSchema !== '' 
                        ? '⚠️ Invalid JSON format. Please check your syntax.' 
                        : 'Paste your JSON here - it will be automatically cleaned up'}
                  />
                  </Box>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Sample Request (JSON)</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {formData.methods.includes('GET') && formData.methods.length === 1 
                        ? 'For GET requests, leave this empty if no request body is required.'
                        : 'Enter sample request data in JSON format'}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Enter valid JSON for sample request
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          startIcon={<FormatIcon />}
                          onClick={() => formatJson('sampleRequest')}
                          variant="outlined"
                        >
                          Format JSON
                        </Button>
                        <Button
                          size="small"
                          onClick={() => clearJsonField('sampleRequest')}
                          variant="outlined"
                          color="warning"
                        >
                          Clear
                        </Button>
                      </Box>
                    </Box>
                  <TextField
                    multiline
                    rows={6}
                    fullWidth
                      value={getJsonDisplayValue('sampleRequest')}
                    onChange={(e) => updateJsonField('sampleRequest', e.target.value)}
                      placeholder={formData.methods.includes('GET') && formData.methods.length === 1 
                        ? '{} (empty for GET requests with no body)'
                        : '{"key": "value"}'}
                      error={typeof formData.sampleRequest === 'string' && formData.sampleRequest !== ''}
                      helperText={(() => {
                        if (typeof formData.sampleRequest === 'string' && formData.sampleRequest !== '') {
                          return '⚠️ Invalid JSON format. Please check your syntax.';
                        }
                        if (formData.methods.includes('GET') && formData.methods.length === 1) {
                          return 'Leave empty for GET requests that don\'t require a request body. The frontend will show "No Request Body Required".';
                        }
                        return 'Paste your JSON here - it will be automatically cleaned up';
                      })()}
                    />
                    {formData.methods.includes('GET') && formData.methods.length === 1 && (
                      <Alert severity="info">
                        <Typography variant="body2">
                          <strong>GET Request Note:</strong>
                          <br />• If this endpoint doesn't require a request body, leave this field empty or as {}
                          <br />• The frontend will automatically display "No Request Body Required" for GET requests
                          <br />• Only add sample data here if your GET request actually requires parameters in the body
                        </Typography>
                      </Alert>
                    )}
                  </Box>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Sample Response (JSON)</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Enter a single sample response for successful API calls.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Enter valid JSON for sample response
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          startIcon={<FormatIcon />}
                          onClick={() => formatJson('sampleResponse')}
                          variant="outlined"
                        >
                          Format JSON
                        </Button>
                        <Button
                          size="small"
                          onClick={() => clearJsonField('sampleResponse')}
                          variant="outlined"
                          color="warning"
                        >
                          Clear
                        </Button>
                      </Box>
                    </Box>
                    <TextField
                      multiline
                      rows={6}
                      fullWidth
                      value={getJsonDisplayValue('sampleResponse')}
                      onChange={(e) => updateJsonField('sampleResponse', e.target.value)}
                      placeholder='{"status": "success", "data": {...}}'
                      error={typeof formData.sampleResponse === 'string' && formData.sampleResponse !== ''}
                      helperText={typeof formData.sampleResponse === 'string' && formData.sampleResponse !== '' 
                        ? '⚠️ Invalid JSON format. Please check your syntax.' 
                        : 'Paste your JSON here - it will be automatically cleaned up'}
                    />
                    <Alert severity="info">
                      <Typography variant="body2">
                        <strong>Sample Response Note:</strong>
                        <br />• This is for a single success response
                        <br />• Use "Sample Responses" below for multiple scenarios
                        <br />• The frontend will show this as "Success Response"
                      </Typography>
                    </Alert>
                  </Box>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Error Response (JSON)</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Enter a single error response for failed API calls.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Enter valid JSON for error response
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          startIcon={<FormatIcon />}
                          onClick={() => formatJson('errorResponse')}
                          variant="outlined"
                        >
                          Format JSON
                        </Button>
                        <Button
                          size="small"
                          onClick={() => clearJsonField('errorResponse')}
                          variant="outlined"
                          color="warning"
                        >
                          Clear
                        </Button>
                      </Box>
                    </Box>
                    <TextField
                      multiline
                      rows={6}
                      fullWidth
                      value={getJsonDisplayValue('errorResponse')}
                      onChange={(e) => updateJsonField('errorResponse', e.target.value)}
                      placeholder='{"status": "error", "message": "Error description"}'
                      error={typeof formData.errorResponse === 'string' && formData.errorResponse !== ''}
                      helperText={typeof formData.errorResponse === 'string' && formData.errorResponse !== '' 
                        ? '⚠️ Invalid JSON format. Please check your syntax.' 
                        : 'Paste your JSON here - it will be automatically cleaned up'}
                    />
                    <Alert severity="info">
                      <Typography variant="body2">
                        <strong>Error Response Note:</strong>
                        <br />• This is for a single error response
                        <br />• Use "Error Responses" below for multiple scenarios
                        <br />• The frontend will show this as "Error Response"
                      </Typography>
                    </Alert>
                  </Box>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Sample Responses (JSON Array)</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Add multiple sample responses for different scenarios (success, partial success, etc.).
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Enter valid JSON array for sample responses
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          startIcon={<FormatIcon />}
                          onClick={() => formatJson('sampleResponses')}
                          variant="outlined"
                        >
                          Format JSON
                        </Button>
                        <Button
                          size="small"
                          onClick={() => clearJsonField('sampleResponses')}
                          variant="outlined"
                          color="warning"
                        >
                          Clear
                        </Button>
                      </Box>
                    </Box>
                    <TextField
                      multiline
                      rows={8}
                      fullWidth
                      value={getJsonDisplayValue('sampleResponses')}
                      onChange={(e) => updateJsonField('sampleResponses', e.target.value)}
                      placeholder='[
  {
    "name": "Success Response",
    "description": "Successful API call response",
    "data": {
      "status": "success",
      "data": {...}
    }
  },
  {
    "name": "Partial Success",
    "description": "Response with some data but warnings",
    "data": {
      "status": "partial",
      "data": {...},
      "warnings": [...]
    }
  }
]'
                      error={typeof formData.sampleResponses === 'string' && formData.sampleResponses !== ''}
                      helperText={typeof formData.sampleResponses === 'string' && formData.sampleResponses !== '' 
                        ? '⚠️ Invalid JSON format. Please check your syntax.' 
                        : 'Paste your JSON array here - it will be automatically cleaned up'}
                    />
                    <Alert severity="info">
                      <Typography variant="body2">
                        <strong>Sample Response Format:</strong>
                        <br />• name: Response scenario name (e.g., "Success", "Partial Success")
                        <br />• description: Brief description of when this response occurs
                        <br />• data: The actual response JSON
                      </Typography>
                    </Alert>
                  </Box>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Error Responses (JSON Array)</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Add multiple error responses for different scenarios. Each error should have a status code, message, and description.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Enter valid JSON array for error responses
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          startIcon={<FormatIcon />}
                          onClick={() => formatJson('errorResponses')}
                          variant="outlined"
                        >
                          Format JSON
                        </Button>
                        <Button
                          size="small"
                          onClick={() => clearJsonField('errorResponses')}
                          variant="outlined"
                          color="warning"
                        >
                          Clear
                        </Button>
                      </Box>
                    </Box>
                    <TextField
                      multiline
                      rows={8}
                      fullWidth
                      value={getJsonDisplayValue('errorResponses')}
                      onChange={(e) => updateJsonField('errorResponses', e.target.value)}
                      placeholder='[
  {
    "statusCode": 400,
    "error": "Bad Request",
    "message": "Invalid input parameters",
    "description": "One or more required fields are missing or invalid"
  },
  {
    "statusCode": 401,
    "error": "Unauthorized",
    "message": "Invalid API key",
    "description": "The provided API key is invalid or expired"
  }
]'
                      error={typeof formData.errorResponses === 'string' && formData.errorResponses !== ''}
                      helperText={typeof formData.errorResponses === 'string' && formData.errorResponses !== '' 
                        ? '⚠️ Invalid JSON format. Please check your syntax.' 
                        : 'Paste your JSON array here - it will be automatically cleaned up'}
                    />
                    <Alert severity="info">
                      <Typography variant="body2">
                        <strong>Error Response Format:</strong>
                        <br />• statusCode: HTTP status code (e.g., 400, 401, 404, 500)
                        <br />• error: Error type (e.g., "Bad Request", "Unauthorized")
                        <br />• message: Brief error message
                        <br />• description: Detailed explanation of the error
                      </Typography>
                    </Alert>
                  </Box>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>cURL Examples</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Add cURL examples for different environments. The frontend will automatically use the appropriate one based on the selected environment.
                    </Typography>

              <TextField
                      label="Base cURL Example (Default)"
                value={formData.curlExample}
                onChange={(e) => updateFormData('curlExample', e.target.value)}
                multiline
                      rows={3}
                fullWidth
                placeholder="curl --location 'https://api.example.com/endpoint' \--header 'Content-Type: application/json'"
                      helperText="This will be used as the default and for environment switching"
                    />
                    
                    <TextField
                      label="Staging cURL Example"
                      value={formData.curlExampleStaging}
                      onChange={(e) => updateFormData('curlExampleStaging', e.target.value)}
                      multiline
                      rows={3}
                      fullWidth
                      placeholder="curl --location 'https://staging.api.example.com/endpoint' \--header 'Content-Type: application/json'"
                      helperText="cURL example for the staging environment"
                    />

                    <TextField
                      label="Production cURL Example"
                      value={formData.curlExampleProduction}
                      onChange={(e) => updateFormData('curlExampleProduction', e.target.value)}
                      multiline
                      rows={3}
                      fullWidth
                      placeholder="curl --location 'https://api.example.com/endpoint' \--header 'Content-Type: application/json'"
                      helperText="cURL example for the production environment"
                    />
                    
                    {/* Environment-aware cURL preview */}
                    {formData.curlExample && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          🔄 Environment-Aware Preview (Frontend will show these):
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {(() => {
                            const examples = generateEnvironmentCurlExamples(formData.curlExample, formData.endpoint);
                            return (
                              <>
                                <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, border: '1px solid #ddd' }}>
                                  <Typography variant="caption" color="text.secondary" display="block">
                                    <strong>UAT Environment:</strong>
                                  </Typography>
                                  <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', m: 0, whiteSpace: 'pre-wrap' }}>
                                    {examples.uat}
                                  </Typography>
                                </Box>
                                <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, border: '1px solid #ddd' }}>
                                  <Typography variant="caption" color="text.secondary" display="block">
                                    <strong>Production Environment:</strong>
                                  </Typography>
                                  <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', m: 0, whiteSpace: 'pre-wrap' }}>
                                    {examples.prod}
                                  </Typography>
                                </Box>
                              </>
                            );
                          })()}
                        </Box>
                      </Box>
                    )}
                    
                    <Alert severity="info">
                      <Typography variant="body2">
                        <strong>How it works:</strong>
                        <br />• The base cURL above will be automatically modified for each environment
                        <br />• Frontend users can switch between UAT and Production environments
                        <br />• The preview above shows exactly what users will see in the frontend
                      </Typography>
                    </Alert>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>
          )}

          {activeTab === 2 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Validation Notes (comma-separated)"
                value={formData.validationNotes.join(', ')}
                onChange={(e) => updateArrayField('validationNotes', e.target.value)}
                multiline
                rows={3}
                fullWidth
                placeholder="Field must be valid email, Required field, etc."
                helperText="Validation rules and notes for this endpoint"
              />

              <TextField
                label="Important Notes (comma-separated)"
                value={formData.importantNotes.join(', ')}
                onChange={(e) => updateArrayField('importantNotes', e.target.value)}
                multiline
                rows={3}
                fullWidth
                placeholder="🔐 Security note, ⚠️ Warning, etc."
                helperText="Important notes that will be displayed prominently in the frontend"
              />

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Headers (JSON Array)</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TextField
                    multiline
                    rows={6}
                    fullWidth
                    value={JSON.stringify(formData.headers, null, 2)}
                    onChange={(e) => updateJsonField('headers', e.target.value)}
                    placeholder='[{"header": "Authorization", "value": "Bearer <token>", "required": true}]'
                    helperText="Array of required headers with their values and required status"
                  />
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Additional Examples (JSON Array)</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TextField
                    multiline
                    rows={8}
                    fullWidth
                    value={JSON.stringify(formData.additionalExamples, null, 2)}
                    onChange={(e) => updateJsonField('additionalExamples', e.target.value)}
                    placeholder='[{"title": "Example Title", "description": "Description", "curl": "curl command"}]'
                    helperText="Additional cURL examples for different scenarios"
                  />
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Field Table (JSON Array)</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TextField
                    multiline
                    rows={8}
                    fullWidth
                    value={JSON.stringify(formData.fieldTable, null, 2)}
                    onChange={(e) => updateJsonField('fieldTable', e.target.value)}
                    placeholder='[{"field": "name", "type": "string", "required": "Yes", "description": "..."}]'
                    helperText="Array of field definitions with type, required status, and descriptions"
                  />
                </AccordionDetails>
              </Accordion>

              <Alert severity="info">
                <Typography variant="body2">
                  <strong>Tips:</strong>
                  <br />• Use JSON format for schemas and examples
                  <br />• Field table should be an array of objects with field, type, required, and description properties
                  <br />• Validation notes should be comma-separated
                  <br />• Important notes support emojis and will be displayed prominently
                  <br />• Headers should include all required headers for the API
                  <br />• Additional examples provide extra cURL commands for different scenarios
                </Typography>
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={saving}
            startIcon={saving ? null : <SaveIcon />}
          >
            {saving ? 'Saving...' : (editingEndpoint ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPanel; 