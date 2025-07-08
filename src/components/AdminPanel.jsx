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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Alert
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  Code as CodeIcon,
  Description as DescriptionIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { getApiBaseUrl, getEnvironmentUrl } from '../config/environments';
import { apiData } from '../data/apiData';

const API_BASE_URL = getApiBaseUrl();

const AdminPanel = () => {
  const [endpoints, setEndpoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEndpoint, setEditingEndpoint] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
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
    sampleResponses: [],
    errorResponses: [],
    curlExample: '',
    validationNotes: [],
    fieldTable: []
  });

  useEffect(() => {
    fetchEndpoints();
  }, []);

  const fetchEndpoints = async () => {
    try {
      // If no API URL is configured, use static data
      if (!API_BASE_URL) {
        const staticEndpoints = Object.entries(apiData).map(([id, data]) => {
          // Generate dynamic cURL example using environment URLs
          const baseUrl = getEnvironmentUrl('uat', data.endpoint?.startsWith('v1-'));
          const dynamicCurlExample = data.curlExample ? 
            data.curlExample.replace(/https:\/\/[^\/]+/, baseUrl) : 
            `curl --location '${baseUrl}${data.endpoint}' \\\n--header 'Authorization: Bearer <jwt>'`;
          
          return {
            id,
            name: data.name,
            endpoint: data.endpoint,
            description: data.description || '',
            category: data.category || '',
            products: data.category === 'Partner APIs' ? ['Loan Genius', 'Card Genius'] : ['Card Genius'],
            purpose: data.purpose || '',
            methods: data.methods || [],
            requestSchema: data.requestSchema || {},
            responseSchema: data.responseSchema || {},
            sampleRequest: data.sampleRequest || {},
            sampleResponse: data.sampleResponse || {},
            sampleResponses: data.sampleResponses || [],
            errorResponse: data.errorResponse || {},
            errorResponses: data.errorResponses || [],
            curlExample: dynamicCurlExample,
            validationNotes: data.validationNotes || [],
            fieldTable: data.fieldTable || []
          };
        });
        setEndpoints(staticEndpoints);
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/endpoints`);
      const data = await response.json();
      setEndpoints(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching endpoints:', error);
      // Fallback to static data if API fails
      const staticEndpoints = Object.entries(apiData).map(([id, data]) => {
        // Generate dynamic cURL example using environment URLs
        const baseUrl = getEnvironmentUrl('uat', data.endpoint?.startsWith('v1-'));
        const dynamicCurlExample = data.curlExample ? 
          data.curlExample.replace(/https:\/\/[^\/]+/, baseUrl) : 
          `curl --location '${baseUrl}${data.endpoint}' \\\n--header 'Authorization: Bearer <jwt>'`;
        
        return {
          id,
          name: data.name,
          endpoint: data.endpoint,
          description: data.description || '',
          category: data.category || '',
          products: data.category === 'Partner APIs' ? ['Loan Genius', 'Card Genius'] : ['Card Genius'],
          purpose: data.purpose || '',
          methods: data.methods || [],
          requestSchema: data.requestSchema || {},
          responseSchema: data.responseSchema || {},
          sampleRequest: data.sampleRequest || {},
          sampleResponse: data.sampleResponse || {},
          sampleResponses: data.sampleResponses || [],
          errorResponse: data.errorResponse || {},
          errorResponses: data.errorResponses || [],
          curlExample: dynamicCurlExample,
          validationNotes: data.validationNotes || [],
          fieldTable: data.fieldTable || []
        };
      });
      setEndpoints(staticEndpoints);
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
        products: endpoint.products || endpoint.product ? [endpoint.product] : ['Loan Genius'],
        purpose: endpoint.purpose || '',
        methods: endpoint.methods || [],
        requestSchema: endpoint.requestSchema || {},
        responseSchema: endpoint.responseSchema || {},
        sampleRequest: endpoint.sampleRequest || {},
        sampleResponses: endpoint.sampleResponses || [],
        errorResponses: endpoint.errorResponses || [],
        curlExample: endpoint.curlExample || '',
        validationNotes: endpoint.validationNotes || [],
        fieldTable: endpoint.fieldTable || []
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
        sampleResponses: [],
        errorResponses: [],
        curlExample: '',
        validationNotes: [],
        fieldTable: []
      });
    }
    setOpenDialog(true);
    setActiveTab(0);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingEndpoint(null);
  };

  const handleSubmit = async () => {
    try {
      if (!API_BASE_URL) {
        // In production (no API), show demo message
        alert('Demo Mode: Changes would be saved to the database in a real environment.\n\nIn this demo, changes are simulated for demonstration purposes.');
        handleCloseDialog();
        return;
      }

      if (editingEndpoint) {
        await fetch(`${API_BASE_URL}/endpoints/${editingEndpoint.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        await fetch(`${API_BASE_URL}/endpoints`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }
      fetchEndpoints();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving endpoint:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this endpoint?')) {
      try {
        if (!API_BASE_URL) {
          // In production (no API), show demo message
          alert('Demo Mode: Endpoint deletion would be processed in a real environment.\n\nIn this demo, deletion is simulated for demonstration purposes.');
          return;
        }

        await fetch(`${API_BASE_URL}/endpoints/${id}`, {
          method: 'DELETE'
        });
        fetchEndpoints();
      } catch (error) {
        console.error('Error deleting endpoint:', error);
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
    try {
      const jsonValue = JSON.parse(value);
      updateFormData(field, jsonValue);
    } catch (error) {
      updateFormData(field, value);
    }
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
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Endpoint
        </Button>
      </Box>

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
                  value={formData.products}
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
                  <TextField
                    multiline
                    rows={8}
                    fullWidth
                    value={JSON.stringify(formData.requestSchema, null, 2)}
                    onChange={(e) => updateJsonField('requestSchema', e.target.value)}
                    placeholder='{"type": "object", "properties": {...}}'
                  />
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Response Schema (JSON)</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TextField
                    multiline
                    rows={8}
                    fullWidth
                    value={JSON.stringify(formData.responseSchema, null, 2)}
                    onChange={(e) => updateJsonField('responseSchema', e.target.value)}
                    placeholder='{"type": "object", "properties": {...}}'
                  />
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Sample Request (JSON)</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TextField
                    multiline
                    rows={6}
                    fullWidth
                    value={JSON.stringify(formData.sampleRequest, null, 2)}
                    onChange={(e) => updateJsonField('sampleRequest', e.target.value)}
                    placeholder='{"key": "value"}'
                  />
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
                    <TextField
                      multiline
                      rows={8}
                      fullWidth
                      value={JSON.stringify(formData.sampleResponses, null, 2)}
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
                    <TextField
                      multiline
                      rows={8}
                      fullWidth
                      value={JSON.stringify(formData.errorResponses, null, 2)}
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

              <TextField
                label="cURL Example"
                value={formData.curlExample}
                onChange={(e) => updateFormData('curlExample', e.target.value)}
                multiline
                rows={4}
                fullWidth
                placeholder="curl --location 'https://api.example.com/endpoint' \--header 'Content-Type: application/json'"
              />
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
                </Typography>
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingEndpoint ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPanel; 