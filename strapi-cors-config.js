// CORS configuration for Strapi to allow React frontend access
// This should be added to your Strapi project's config/middlewares.js

module.exports = [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: false,
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: [
        'http://localhost:3000',  // React development server
        'http://localhost:3001',  // Alternative React port
        'http://localhost:3002',  // Your current Swagger server
        'http://localhost:5173',  // Vite default port
        'http://localhost:4173',  // Vite preview port
        'http://localhost:8080',  // Alternative port
      ],
      headers: [
        'Content-Type',
        'Authorization',
        'X-Frame-Options',
        'X-Requested-With',
        'Accept',
        'Origin',
      ],
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
]; 