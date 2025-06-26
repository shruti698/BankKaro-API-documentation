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
