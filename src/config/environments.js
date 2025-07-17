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
  // Always use local server for consistency with admin panel
  return 'http://localhost:3001';
};
