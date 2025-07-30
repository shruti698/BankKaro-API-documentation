import fs from 'fs';
import path from 'path';

class DatabaseManager {
  constructor() {
    this.dbPath = path.join(process.cwd(), 'api', 'data', 'endpoints.json');
    this.ensureDbExists();
  }

  ensureDbExists() {
    const dir = path.dirname(this.dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(this.dbPath)) {
      try {
        const apiDataPath = path.join(process.cwd(), 'src', 'data', 'apiData.js');
        if (fs.existsSync(apiDataPath)) {
          const content = fs.readFileSync(apiDataPath, 'utf8');
          const match = content.match(/export const apiData = ({[\s\S]*?});/);
          if (match) {
            const dataString = match[1];
            const apiData = eval(`(${dataString})`);
            const endpoints = Object.entries(apiData).map(([key, data]) => ({ id: key, ...data }));
            fs.writeFileSync(this.dbPath, JSON.stringify({ endpoints }, null, 2));
            console.log('✅ Database initialized with apiData.js content');
          }
        }
      } catch (error) {
        console.warn('Could not initialize from apiData.js:', error.message);
        fs.writeFileSync(this.dbPath, JSON.stringify({ endpoints: [] }, null, 2));
      }
    }
  }

  readDb() {
    try {
      const content = fs.readFileSync(this.dbPath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      console.error('Error reading database:', error);
      return { endpoints: [] };
    }
  }

  writeDb(data) {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error('Error writing database:', error);
      return false;
    }
  }

  async getAllEndpoints() {
    const db = this.readDb();
    return db.endpoints || [];
  }

  async getEndpoint(endpointKey) {
    const endpoints = await this.getAllEndpoints();
    return endpoints.find(ep => ep.id === endpointKey);
  }

  async saveEndpoint(endpointKey, data) {
    const db = this.readDb();
    const endpoints = db.endpoints || [];
    
    const existingIndex = endpoints.findIndex(ep => ep.id === endpointKey);
    
    const endpointData = {
      id: endpointKey,
      name: data.name || '',
      endpoint: data.endpoint || '',
      methods: Array.isArray(data.methods) ? data.methods : [],
      status: data.status || 'live',
      description: data.description || '',
      category: data.category || '',
      purpose: data.purpose || '',
      rank: data.rank || 999,
      requestSchema: data.requestSchema || {},
      responseSchema: data.responseSchema || {},
      sampleRequest: data.sampleRequest || {},
      sampleResponse: data.sampleResponse || {},
      errorResponses: data.errorResponses || [],
      curlExamples: data.curlExamples || [],
      validationNotes: data.validationNotes || [],
      fieldTable: data.fieldTable || []
    };

    if (existingIndex >= 0) {
      endpoints[existingIndex] = endpointData;
    } else {
      endpoints.push(endpointData);
    }

    db.endpoints = endpoints;
    return this.writeDb(db);
  }

  async deleteEndpoint(endpointKey) {
    const db = this.readDb();
    const endpoints = db.endpoints || [];
    db.endpoints = endpoints.filter(ep => ep.id !== endpointKey);
    return this.writeDb(db);
  }

  async getStatus() {
    const endpoints = await this.getAllEndpoints();
    return {
      status: 'connected',
      endpointCount: endpoints.length,
      databasePath: this.dbPath
    };
  }

  async initialize() {
    // Database is already initialized in constructor
    console.log('✅ Database already initialized');
    return true;
  }

  async importFromApiData(apiData) {
    try {
      const endpoints = Object.entries(apiData).map(([key, data]) => ({ id: key, ...data }));
      const db = { endpoints };
      this.writeDb(db);
      console.log('✅ Imported data from apiData.js');
      return true;
    } catch (error) {
      console.error('❌ Failed to import from apiData:', error);
      return false;
    }
  }
}

export default DatabaseManager; 