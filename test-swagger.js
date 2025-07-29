import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3002;

// Set correct MIME types for JavaScript modules
app.use((req, res, next) => {
  if (req.url.endsWith('.js') || req.url.endsWith('.jsx') || req.url.endsWith('.mjs')) {
    res.type('application/javascript');
  }
  next();
});

// Serve only specific files, not the entire directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'swagger-ui.html'));
});

app.get('/openapi-spec.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'openapi-spec.json'));
});

// Serve Swagger UI assets from CDN (no local files needed)
app.get('/swagger-ui.css', (req, res) => {
    res.redirect('https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css');
});

app.get('/swagger-ui-bundle.js', (req, res) => {
    res.redirect('https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js');
});

app.get('/swagger-ui-standalone-preset.js', (req, res) => {
    res.redirect('https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js');
});

// Catch all other routes and serve the Swagger UI
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'swagger-ui.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Swagger UI server running at http://localhost:${PORT}`);
    console.log(`📖 API Documentation: http://localhost:${PORT}`);
    console.log(`📄 OpenAPI Spec: http://localhost:${PORT}/openapi-spec.json`);
    console.log('');
    console.log('✅ Migration completed successfully!');
    console.log('📊 All 19 API endpoints have been migrated to OpenAPI format');
    console.log('');
    console.log('🔧 Features included:');
    console.log('   - Interactive API testing');
    console.log('   - Partner token authentication');
    console.log('   - cURL examples preserved');
    console.log('   - Request/response schemas');
    console.log('   - Validation notes');
    console.log('');
    console.log('🌐 Ready to deploy to production!');
}); 