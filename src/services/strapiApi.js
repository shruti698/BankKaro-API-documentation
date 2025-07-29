// Strapi API service for fetching API documentation data
const STRAPI_URL = 'http://localhost:1337';

export const strapiApi = {
  // Fetch all API endpoints from Strapi
  async getAllEndpoints() {
    try {
      const response = await fetch(`${STRAPI_URL}/api/api-endpoints?populate=*`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Transform Strapi data format to match your existing apiData structure
      const transformedData = {};
      
      data.data.forEach(item => {
        const api = item.attributes;
        const key = api.endpoint?.replace(/\//g, '-').replace(/^-/, '') || item.id;
        
        transformedData[key] = {
          name: api.name,
          endpoint: api.endpoint,
          methods: api.method ? api.method.split(',').map(m => m.trim()) : [],
          status: api.state, // Map state back to status for compatibility
          description: api.description,
          category: api.category,
          purpose: api.purpose,
          requestSchema: api.request_schema ? JSON.parse(api.request_schema) : {},
          responseSchema: api.response_schema ? JSON.parse(api.response_schema) : {},
          sampleRequest: api.sample_request ? JSON.parse(api.sample_request) : {},
          curlExample: api.curl_example,
          curlExampleStaging: api.curl_example_staging,
          curlExampleProduction: api.curl_example_production,
          validationNotes: api.validation_notes ? JSON.parse(api.validation_notes) : [],
          fieldTable: api.field_table ? JSON.parse(api.field_table) : [],
          products: api.products ? api.products.split(',').map(p => p.trim()) : [],
          sampleResponses: api.sample_response ? [JSON.parse(api.sample_response)] : [],
          errorResponses: api.error_response ? [JSON.parse(api.error_response)] : []
        };
      });
      
      return transformedData;
    } catch (error) {
      console.error('Error fetching from Strapi:', error);
      throw error;
    }
  },

  // Fetch a single API endpoint by key
  async getEndpointByKey(key) {
    try {
      const allEndpoints = await this.getAllEndpoints();
      return allEndpoints[key];
    } catch (error) {
      console.error('Error fetching endpoint by key:', error);
      throw error;
    }
  },

  // Fetch endpoints by category
  async getEndpointsByCategory(category) {
    try {
      const response = await fetch(`${STRAPI_URL}/api/api-endpoints?filters[category][$eq]=${category}&populate=*`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Transform data similar to getAllEndpoints
      const transformedData = {};
      data.data.forEach(item => {
        const api = item.attributes;
        const key = api.endpoint?.replace(/\//g, '-').replace(/^-/, '') || item.id;
        
        transformedData[key] = {
          name: api.name,
          endpoint: api.endpoint,
          methods: api.method ? api.method.split(',').map(m => m.trim()) : [],
          status: api.state,
          description: api.description,
          category: api.category,
          purpose: api.purpose,
          requestSchema: api.request_schema ? JSON.parse(api.request_schema) : {},
          responseSchema: api.response_schema ? JSON.parse(api.response_schema) : {},
          sampleRequest: api.sample_request ? JSON.parse(api.sample_request) : {},
          curlExample: api.curl_example,
          curlExampleStaging: api.curl_example_staging,
          curlExampleProduction: api.curl_example_production,
          validationNotes: api.validation_notes ? JSON.parse(api.validation_notes) : [],
          fieldTable: api.field_table ? JSON.parse(api.field_table) : [],
          products: api.products ? api.products.split(',').map(p => p.trim()) : [],
          sampleResponses: api.sample_response ? [JSON.parse(api.sample_response)] : [],
          errorResponses: api.error_response ? [JSON.parse(api.error_response)] : []
        };
      });
      
      return transformedData;
    } catch (error) {
      console.error('Error fetching endpoints by category:', error);
      throw error;
    }
  }
};

export default strapiApi; 