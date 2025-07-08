export const environments = {
  uat: {
    name: 'UAT',
    url: 'https://uat-platform.bankkaro.com',
    description: 'User Acceptance Testing environment',
    color: 'warning',
    cardApiUrl: 'https://uat-platform.bankkaro.com/card-genius'
  },
  production: {
    name: 'Production',
    url: 'https://prod-platform.bankkaro.com',
    description: 'Production environment for live transactions.',
    color: 'error',
    cardApiUrl: 'https://prod-platform.bankkaro.com/card-genius'
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
  
  // For production deployment, return null to use static data
  // This prevents CORS issues and allows the admin panel to work without a backend
  return null;
  
  // TODO: If you have a proper admin API backend, you can uncomment and configure it here
  // return 'https://your-admin-api.com';
};
