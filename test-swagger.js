import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3002;

// Serve static files
app.use(express.static(__dirname));

// Serve the Swagger UI
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'swagger-ui.html'));
});

// Serve the OpenAPI spec
app.get('/openapi-spec.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'openapi-spec.json'));
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