export const environments = {
  staging: {
    name: 'Staging',
    url: 'https://bk-api.bankkaro.com',
    description: 'Development and testing environment',
    color: 'warning',
    cardApiUrl: 'https://bk-api.bankkaro.com/card-genius'
  },
  production: {
    name: 'Production',
    url: 'https://prod-api.bankkaro.com',
    description: 'Production environment for live transactions.',
    color: 'error',
    cardApiUrl: 'https://api.bankkaro.com'
  }
};

export const getEnvironmentUrl = (environment, isCardGenius) => {
  const env = environments[environment] || environments.staging;
  return isCardGenius ? env.cardApiUrl : env.url;
};

// API Base URL configuration
export const getApiBaseUrl = () => {
  // Check if we're in development (localhost) or production
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:4000';
  }
  
  // For production deployment, try the staging API first
  // If that fails, the app will fall back to static data
  return 'https://bk-api.bankkaro.com';
  
  // TODO: Replace with your actual production API URL when available
  // return 'https://your-production-api-url.com';
};
