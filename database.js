import sqlite3 from 'sqlite3';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path
const DB_PATH = path.join(__dirname, 'api_docs.db');

class DatabaseManager {
  constructor() {
    this.db = null;
  }

  // Initialize database and create tables
  async initialize() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
          console.error('Error opening database:', err);
          reject(err);
          return;
        }
        console.log('✅ Connected to SQLite database');
        this.createTables().then(resolve).catch(reject);
      });
    });
  }

  // Create all necessary tables
  async createTables() {
    const tables = [
      // Main API endpoints table
      `CREATE TABLE IF NOT EXISTS api_endpoints (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        endpoint_key TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        endpoint TEXT NOT NULL,
        methods TEXT NOT NULL,
        status TEXT DEFAULT 'live',
        description TEXT,
        category TEXT,
        purpose TEXT,
        rank REAL DEFAULT 999,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // JSON fields stored as separate tables for better querying
      `CREATE TABLE IF NOT EXISTS request_schemas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        endpoint_key TEXT NOT NULL,
        schema_data TEXT NOT NULL,
        FOREIGN KEY (endpoint_key) REFERENCES api_endpoints (endpoint_key)
      )`,

      `CREATE TABLE IF NOT EXISTS response_schemas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        endpoint_key TEXT NOT NULL,
        schema_data TEXT NOT NULL,
        FOREIGN KEY (endpoint_key) REFERENCES api_endpoints (endpoint_key)
      )`,

      `CREATE TABLE IF NOT EXISTS sample_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        endpoint_key TEXT NOT NULL,
        request_data TEXT NOT NULL,
        FOREIGN KEY (endpoint_key) REFERENCES api_endpoints (endpoint_key)
      )`,

      `CREATE TABLE IF NOT EXISTS sample_responses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        endpoint_key TEXT NOT NULL,
        response_data TEXT NOT NULL,
        FOREIGN KEY (endpoint_key) REFERENCES api_endpoints (endpoint_key)
      )`,

      `CREATE TABLE IF NOT EXISTS error_responses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        endpoint_key TEXT NOT NULL,
        error_data TEXT NOT NULL,
        FOREIGN KEY (endpoint_key) REFERENCES api_endpoints (endpoint_key)
      )`,

      `CREATE TABLE IF NOT EXISTS curl_examples (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        endpoint_key TEXT NOT NULL,
        curl_data TEXT NOT NULL,
        environment TEXT DEFAULT 'default',
        FOREIGN KEY (endpoint_key) REFERENCES api_endpoints (endpoint_key)
      )`,

      `CREATE TABLE IF NOT EXISTS validation_notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        endpoint_key TEXT NOT NULL,
        note TEXT NOT NULL,
        note_order INTEGER DEFAULT 0,
        FOREIGN KEY (endpoint_key) REFERENCES api_endpoints (endpoint_key)
      )`,

      `CREATE TABLE IF NOT EXISTS field_tables (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        endpoint_key TEXT NOT NULL,
        field_name TEXT NOT NULL,
        field_type TEXT NOT NULL,
        required TEXT DEFAULT 'No',
        description TEXT,
        field_order INTEGER DEFAULT 0,
        FOREIGN KEY (endpoint_key) REFERENCES api_endpoints (endpoint_key)
      )`,

      `CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        endpoint_key TEXT NOT NULL,
        product_name TEXT NOT NULL,
        FOREIGN KEY (endpoint_key) REFERENCES api_endpoints (endpoint_key)
      )`,

      `CREATE TABLE IF NOT EXISTS important_notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        endpoint_key TEXT NOT NULL,
        note TEXT NOT NULL,
        note_order INTEGER DEFAULT 0,
        FOREIGN KEY (endpoint_key) REFERENCES api_endpoints (endpoint_key)
      )`,

      `CREATE TABLE IF NOT EXISTS headers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        endpoint_key TEXT NOT NULL,
        header_name TEXT NOT NULL,
        header_value TEXT,
        header_description TEXT,
        header_order INTEGER DEFAULT 0,
        FOREIGN KEY (endpoint_key) REFERENCES api_endpoints (endpoint_key)
      )`,

      `CREATE TABLE IF NOT EXISTS additional_examples (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        endpoint_key TEXT NOT NULL,
        example_title TEXT NOT NULL,
        example_data TEXT NOT NULL,
        example_order INTEGER DEFAULT 0,
        FOREIGN KEY (endpoint_key) REFERENCES api_endpoints (endpoint_key)
      )`
    ];

    for (const table of tables) {
      await this.runQuery(table);
    }
    console.log('✅ All database tables created');
  }

  // Helper method to run queries
  runQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  // Helper method to get single row
  getRow(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Helper method to get multiple rows
  getAll(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Import data from apiData.js
  async importFromApiData(apiData) {
    console.log('🔄 Importing data from apiData.js...');
    
    for (const [endpointKey, data] of Object.entries(apiData)) {
      try {
        // Insert main endpoint data
        await this.runQuery(`
          INSERT OR REPLACE INTO api_endpoints 
          (endpoint_key, name, endpoint, methods, status, description, category, purpose, rank, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `, [
          endpointKey,
          data.name,
          data.endpoint,
          JSON.stringify(data.methods || []),
          data.status || 'live',
          data.description,
          data.category,
          data.purpose,
          data.rank || 999
        ]);

        // Clear existing related data
        await this.runQuery('DELETE FROM request_schemas WHERE endpoint_key = ?', [endpointKey]);
        await this.runQuery('DELETE FROM response_schemas WHERE endpoint_key = ?', [endpointKey]);
        await this.runQuery('DELETE FROM sample_requests WHERE endpoint_key = ?', [endpointKey]);
        await this.runQuery('DELETE FROM sample_responses WHERE endpoint_key = ?', [endpointKey]);
        await this.runQuery('DELETE FROM error_responses WHERE endpoint_key = ?', [endpointKey]);
        await this.runQuery('DELETE FROM curl_examples WHERE endpoint_key = ?', [endpointKey]);
        await this.runQuery('DELETE FROM validation_notes WHERE endpoint_key = ?', [endpointKey]);
        await this.runQuery('DELETE FROM field_tables WHERE endpoint_key = ?', [endpointKey]);
        await this.runQuery('DELETE FROM products WHERE endpoint_key = ?', [endpointKey]);
        await this.runQuery('DELETE FROM important_notes WHERE endpoint_key = ?', [endpointKey]);
        await this.runQuery('DELETE FROM headers WHERE endpoint_key = ?', [endpointKey]);
        await this.runQuery('DELETE FROM additional_examples WHERE endpoint_key = ?', [endpointKey]);

        // Insert request schema
        if (data.requestSchema) {
          await this.runQuery(
            'INSERT INTO request_schemas (endpoint_key, schema_data) VALUES (?, ?)',
            [endpointKey, JSON.stringify(data.requestSchema)]
          );
        }

        // Insert response schema
        if (data.responseSchema) {
          await this.runQuery(
            'INSERT INTO response_schemas (endpoint_key, schema_data) VALUES (?, ?)',
            [endpointKey, JSON.stringify(data.responseSchema)]
          );
        }

        // Insert sample request
        if (data.sampleRequest) {
          await this.runQuery(
            'INSERT INTO sample_requests (endpoint_key, request_data) VALUES (?, ?)',
            [endpointKey, JSON.stringify(data.sampleRequest)]
          );
        }

        // Insert sample responses
        if (data.sampleResponses && data.sampleResponses.length > 0) {
          for (const response of data.sampleResponses) {
            await this.runQuery(
              'INSERT INTO sample_responses (endpoint_key, response_data) VALUES (?, ?)',
              [endpointKey, JSON.stringify(response)]
            );
          }
        }

        // Insert error responses
        if (data.errorResponses && data.errorResponses.length > 0) {
          for (const error of data.errorResponses) {
            await this.runQuery(
              'INSERT INTO error_responses (endpoint_key, error_data) VALUES (?, ?)',
              [endpointKey, JSON.stringify(error)]
            );
          }
        }

        // Insert curl examples
        if (data.curlExample) {
          await this.runQuery(
            'INSERT INTO curl_examples (endpoint_key, curl_data, environment) VALUES (?, ?, ?)',
            [endpointKey, data.curlExample, 'default']
          );
        }

        // Insert validation notes
        if (data.validationNotes && data.validationNotes.length > 0) {
          for (let i = 0; i < data.validationNotes.length; i++) {
            await this.runQuery(
              'INSERT INTO validation_notes (endpoint_key, note, note_order) VALUES (?, ?, ?)',
              [endpointKey, data.validationNotes[i], i]
            );
          }
        }

        // Insert field table
        if (data.fieldTable && data.fieldTable.length > 0) {
          for (let i = 0; i < data.fieldTable.length; i++) {
            const field = data.fieldTable[i];
            await this.runQuery(
              'INSERT INTO field_tables (endpoint_key, field_name, field_type, required, description, field_order) VALUES (?, ?, ?, ?, ?, ?)',
              [endpointKey, field.field, field.type, field.required, field.description, i]
            );
          }
        }

        // Insert products
        if (data.products && data.products.length > 0) {
          for (const product of data.products) {
            await this.runQuery(
              'INSERT INTO products (endpoint_key, product_name) VALUES (?, ?)',
              [endpointKey, product]
            );
          }
        }

        // Insert important notes
        if (data.importantNotes && data.importantNotes.length > 0) {
          for (let i = 0; i < data.importantNotes.length; i++) {
            await this.runQuery(
              'INSERT INTO important_notes (endpoint_key, note, note_order) VALUES (?, ?, ?)',
              [endpointKey, data.importantNotes[i], i]
            );
          }
        }

        // Insert headers
        if (data.headers && data.headers.length > 0) {
          for (let i = 0; i < data.headers.length; i++) {
            const header = data.headers[i];
            await this.runQuery(
              'INSERT INTO headers (endpoint_key, header_name, header_value, header_description, header_order) VALUES (?, ?, ?, ?, ?)',
              [endpointKey, header.name, header.value, header.description, i]
            );
          }
        }

        // Insert additional examples
        if (data.additionalExamples && data.additionalExamples.length > 0) {
          for (let i = 0; i < data.additionalExamples.length; i++) {
            const example = data.additionalExamples[i];
            await this.runQuery(
              'INSERT INTO additional_examples (endpoint_key, example_title, example_data, example_order) VALUES (?, ?, ?, ?)',
              [endpointKey, example.title, JSON.stringify(example.data), i]
            );
          }
        }

      } catch (error) {
        console.error(`Error importing endpoint ${endpointKey}:`, error);
      }
    }
    
    console.log('✅ Data import completed');
  }

  // Export data to apiData.js format
  async exportToApiData() {
    console.log('🔄 Exporting data to apiData.js format...');
    
    const endpoints = await this.getAll(`
      SELECT * FROM api_endpoints 
      ORDER BY rank ASC, created_at ASC
    `);

    const apiData = {};

    for (const endpoint of endpoints) {
      const endpointKey = endpoint.endpoint_key;
      
      // Get all related data
      const [requestSchema] = await this.getAll('SELECT schema_data FROM request_schemas WHERE endpoint_key = ?', [endpointKey]);
      const [responseSchema] = await this.getAll('SELECT schema_data FROM response_schemas WHERE endpoint_key = ?', [endpointKey]);
      const [sampleRequest] = await this.getAll('SELECT request_data FROM sample_requests WHERE endpoint_key = ?', [endpointKey]);
      const sampleResponses = await this.getAll('SELECT response_data FROM sample_responses WHERE endpoint_key = ? ORDER BY id', [endpointKey]);
      const errorResponses = await this.getAll('SELECT error_data FROM error_responses WHERE endpoint_key = ? ORDER BY id', [endpointKey]);
      const [curlExample] = await this.getAll('SELECT curl_data FROM curl_examples WHERE endpoint_key = ? AND environment = "default"', [endpointKey]);
      const validationNotes = await this.getAll('SELECT note FROM validation_notes WHERE endpoint_key = ? ORDER BY note_order', [endpointKey]);
      const fieldTable = await this.getAll('SELECT field_name, field_type, required, description FROM field_tables WHERE endpoint_key = ? ORDER BY field_order', [endpointKey]);
      const products = await this.getAll('SELECT product_name FROM products WHERE endpoint_key = ?', [endpointKey]);
      const importantNotes = await this.getAll('SELECT note FROM important_notes WHERE endpoint_key = ? ORDER BY note_order', [endpointKey]);
      const headers = await this.getAll('SELECT header_name, header_value, header_description FROM headers WHERE endpoint_key = ? ORDER BY header_order', [endpointKey]);
      const additionalExamples = await this.getAll('SELECT example_title, example_data FROM additional_examples WHERE endpoint_key = ? ORDER BY example_order', [endpointKey]);

      // Build the endpoint data object
      apiData[endpointKey] = {
        name: endpoint.name,
        endpoint: endpoint.endpoint,
        methods: JSON.parse(endpoint.methods),
        status: endpoint.status,
        description: endpoint.description,
        category: endpoint.category,
        purpose: endpoint.purpose,
        rank: endpoint.rank,
        requestSchema: requestSchema ? JSON.parse(requestSchema.schema_data) : {},
        responseSchema: responseSchema ? JSON.parse(responseSchema.schema_data) : {},
        sampleRequest: sampleRequest ? JSON.parse(sampleRequest.request_data) : {},
        sampleResponses: sampleResponses.map(r => JSON.parse(r.response_data)),
        errorResponses: errorResponses.map(e => JSON.parse(e.error_data)),
        curlExample: curlExample ? curlExample.curl_data : '',
        validationNotes: validationNotes.map(n => n.note),
        fieldTable: fieldTable.map(f => ({
          field: f.field_name,
          type: f.field_type,
          required: f.required,
          description: f.description
        })),
        products: products.map(p => p.product_name),
        importantNotes: importantNotes.map(n => n.note),
        headers: headers.map(h => ({
          name: h.header_name,
          value: h.header_value,
          description: h.header_description
        })),
        additionalExamples: additionalExamples.map(e => ({
          title: e.example_title,
          data: JSON.parse(e.example_data)
        }))
      };
    }

    return apiData;
  }

  // Get all endpoints for admin panel
  async getAllEndpoints() {
    const endpoints = await this.getAll(`
      SELECT * FROM api_endpoints 
      ORDER BY rank ASC, created_at ASC
    `);

    const result = [];
    for (const endpoint of endpoints) {
      const endpointKey = endpoint.endpoint_key;
      
      // Get related data
      const products = await this.getAll('SELECT product_name FROM products WHERE endpoint_key = ?', [endpointKey]);
      
      result.push({
        id: endpointKey,
        name: endpoint.name,
        endpoint: endpoint.endpoint,
        description: endpoint.description,
        category: endpoint.category,
        products: products.map(p => p.product_name),
        methods: JSON.parse(endpoint.methods),
        purpose: endpoint.purpose,
        status: endpoint.status,
        rank: endpoint.rank
      });
    }

    return result;
  }

  // Get single endpoint with all data
  async getEndpoint(endpointKey) {
    const endpoint = await this.getRow('SELECT * FROM api_endpoints WHERE endpoint_key = ?', [endpointKey]);
    
    if (!endpoint) return null;

    // Get all related data (same as in exportToApiData)
    const [requestSchema] = await this.getAll('SELECT schema_data FROM request_schemas WHERE endpoint_key = ?', [endpointKey]);
    const [responseSchema] = await this.getAll('SELECT schema_data FROM response_schemas WHERE endpoint_key = ?', [endpointKey]);
    const [sampleRequest] = await this.getAll('SELECT request_data FROM sample_requests WHERE endpoint_key = ?', [endpointKey]);
    const sampleResponses = await this.getAll('SELECT response_data FROM sample_responses WHERE endpoint_key = ? ORDER BY id', [endpointKey]);
    const errorResponses = await this.getAll('SELECT error_data FROM error_responses WHERE endpoint_key = ? ORDER BY id', [endpointKey]);
    const [curlExample] = await this.getAll('SELECT curl_data FROM curl_examples WHERE endpoint_key = ? AND environment = "default"', [endpointKey]);
    const validationNotes = await this.getAll('SELECT note FROM validation_notes WHERE endpoint_key = ? ORDER BY note_order', [endpointKey]);
    const fieldTable = await this.getAll('SELECT field_name, field_type, required, description FROM field_tables WHERE endpoint_key = ? ORDER BY field_order', [endpointKey]);
    const products = await this.getAll('SELECT product_name FROM products WHERE endpoint_key = ?', [endpointKey]);
    const importantNotes = await this.getAll('SELECT note FROM important_notes WHERE endpoint_key = ? ORDER BY note_order', [endpointKey]);
    const headers = await this.getAll('SELECT header_name, header_value, header_description FROM headers WHERE endpoint_key = ? ORDER BY header_order', [endpointKey]);
    const additionalExamples = await this.getAll('SELECT example_title, example_data FROM additional_examples WHERE endpoint_key = ? ORDER BY example_order', [endpointKey]);

    return {
      name: endpoint.name,
      endpoint: endpoint.endpoint,
      methods: JSON.parse(endpoint.methods),
      status: endpoint.status,
      description: endpoint.description,
      category: endpoint.category,
      purpose: endpoint.purpose,
      rank: endpoint.rank,
      requestSchema: requestSchema ? JSON.parse(requestSchema.schema_data) : {},
      responseSchema: responseSchema ? JSON.parse(responseSchema.schema_data) : {},
      sampleRequest: sampleRequest ? JSON.parse(sampleRequest.request_data) : {},
      sampleResponses: sampleResponses.map(r => JSON.parse(r.response_data)),
      errorResponses: errorResponses.map(e => JSON.parse(e.error_data)),
      curlExample: curlExample ? curlExample.curl_data : '',
      validationNotes: validationNotes.map(n => n.note),
      fieldTable: fieldTable.map(f => ({
        field: f.field_name,
        type: f.field_type,
        required: f.required,
        description: f.description
      })),
      products: products.map(p => p.product_name),
      importantNotes: importantNotes.map(n => n.note),
      headers: headers.map(h => ({
        name: h.header_name,
        value: h.header_value,
        description: h.header_description
      })),
      additionalExamples: additionalExamples.map(e => ({
        title: e.example_title,
        data: JSON.parse(e.example_data)
      }))
    };
  }

  // Save endpoint to database
  async saveEndpoint(endpointKey, data) {
    try {
      // Insert or update main endpoint data
      await this.runQuery(`
        INSERT OR REPLACE INTO api_endpoints 
        (endpoint_key, name, endpoint, methods, status, description, category, purpose, rank, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `, [
        endpointKey,
        data.name,
        data.endpoint,
        JSON.stringify(data.methods || []),
        data.status || 'live',
        data.description,
        data.category,
        data.purpose,
        data.rank || 999
      ]);

      // Clear existing related data
      await this.runQuery('DELETE FROM request_schemas WHERE endpoint_key = ?', [endpointKey]);
      await this.runQuery('DELETE FROM response_schemas WHERE endpoint_key = ?', [endpointKey]);
      await this.runQuery('DELETE FROM sample_requests WHERE endpoint_key = ?', [endpointKey]);
      await this.runQuery('DELETE FROM sample_responses WHERE endpoint_key = ?', [endpointKey]);
      await this.runQuery('DELETE FROM error_responses WHERE endpoint_key = ?', [endpointKey]);
      await this.runQuery('DELETE FROM curl_examples WHERE endpoint_key = ?', [endpointKey]);
      await this.runQuery('DELETE FROM validation_notes WHERE endpoint_key = ?', [endpointKey]);
      await this.runQuery('DELETE FROM field_tables WHERE endpoint_key = ?', [endpointKey]);
      await this.runQuery('DELETE FROM products WHERE endpoint_key = ?', [endpointKey]);
      await this.runQuery('DELETE FROM important_notes WHERE endpoint_key = ?', [endpointKey]);
      await this.runQuery('DELETE FROM headers WHERE endpoint_key = ?', [endpointKey]);
      await this.runQuery('DELETE FROM additional_examples WHERE endpoint_key = ?', [endpointKey]);

      // Insert request schema
      if (data.requestSchema && Object.keys(data.requestSchema).length > 0) {
        await this.runQuery(
          'INSERT INTO request_schemas (endpoint_key, schema_data) VALUES (?, ?)',
          [endpointKey, JSON.stringify(data.requestSchema)]
        );
      }

      // Insert response schema
      if (data.responseSchema && Object.keys(data.responseSchema).length > 0) {
        await this.runQuery(
          'INSERT INTO response_schemas (endpoint_key, schema_data) VALUES (?, ?)',
          [endpointKey, JSON.stringify(data.responseSchema)]
        );
      }

      // Insert sample request
      if (data.sampleRequest && Object.keys(data.sampleRequest).length > 0) {
        await this.runQuery(
          'INSERT INTO sample_requests (endpoint_key, request_data) VALUES (?, ?)',
          [endpointKey, JSON.stringify(data.sampleRequest)]
        );
      }

      // Insert sample responses
      if (data.sampleResponses && data.sampleResponses.length > 0) {
        for (const response of data.sampleResponses) {
          await this.runQuery(
            'INSERT INTO sample_responses (endpoint_key, response_data) VALUES (?, ?)',
            [endpointKey, JSON.stringify(response)]
          );
        }
      }

      // Insert error responses
      if (data.errorResponses && data.errorResponses.length > 0) {
        for (const error of data.errorResponses) {
          await this.runQuery(
            'INSERT INTO error_responses (endpoint_key, error_data) VALUES (?, ?)',
            [endpointKey, JSON.stringify(error)]
          );
        }
      }

      // Insert curl examples
      if (data.curlExample) {
        await this.runQuery(
          'INSERT INTO curl_examples (endpoint_key, curl_data, environment) VALUES (?, ?, ?)',
          [endpointKey, data.curlExample, 'default']
        );
      }

      // Insert validation notes
      if (data.validationNotes && data.validationNotes.length > 0) {
        for (let i = 0; i < data.validationNotes.length; i++) {
          await this.runQuery(
            'INSERT INTO validation_notes (endpoint_key, note, note_order) VALUES (?, ?, ?)',
            [endpointKey, data.validationNotes[i], i]
          );
        }
      }

      // Insert field table
      if (data.fieldTable && data.fieldTable.length > 0) {
        for (let i = 0; i < data.fieldTable.length; i++) {
          const field = data.fieldTable[i];
          await this.runQuery(
            'INSERT INTO field_tables (endpoint_key, field_name, field_type, required, description, field_order) VALUES (?, ?, ?, ?, ?, ?)',
            [endpointKey, field.field, field.type, field.required, field.description, i]
          );
        }
      }

      // Insert products
      if (data.products && data.products.length > 0) {
        for (const product of data.products) {
          await this.runQuery(
            'INSERT INTO products (endpoint_key, product_name) VALUES (?, ?)',
            [endpointKey, product]
          );
        }
      }

      // Insert important notes
      if (data.importantNotes && data.importantNotes.length > 0) {
        for (let i = 0; i < data.importantNotes.length; i++) {
          await this.runQuery(
            'INSERT INTO important_notes (endpoint_key, note, note_order) VALUES (?, ?, ?)',
            [endpointKey, data.importantNotes[i], i]
          );
        }
      }

      // Insert headers
      if (data.headers && data.headers.length > 0) {
        for (let i = 0; i < data.headers.length; i++) {
          const header = data.headers[i];
          if (header && header.name) { // Add validation
            await this.runQuery(
              'INSERT INTO headers (endpoint_key, header_name, header_value, header_description, header_order) VALUES (?, ?, ?, ?, ?)',
              [endpointKey, header.name, header.value || '', header.description || '', i]
            );
          }
        }
      }

      // Insert additional examples
      if (data.additionalExamples && data.additionalExamples.length > 0) {
        for (let i = 0; i < data.additionalExamples.length; i++) {
          const example = data.additionalExamples[i];
          await this.runQuery(
            'INSERT INTO additional_examples (endpoint_key, example_title, example_data, example_order) VALUES (?, ?, ?, ?)',
            [endpointKey, example.title, JSON.stringify(example.data), i]
          );
        }
      }

      console.log(`✅ Endpoint ${endpointKey} saved to database`);
    } catch (error) {
      console.error(`Error saving endpoint ${endpointKey}:`, error);
      throw error;
    }
  }

  // Close database connection
  close() {
    if (this.db) {
      this.db.close((err) => {
        if (err) {
          console.error('Error closing database:', err);
        } else {
          console.log('✅ Database connection closed');
        }
      });
    }
  }
}

export default DatabaseManager; 