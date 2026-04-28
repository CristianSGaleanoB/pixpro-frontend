export const environment = {
  production: true,
  apiUrl: 'http://localhost:3000/api',
  keycloak: {
    url: 'http://localhost:8085',
    realmName: 'pixpro-realm',
    clientId: 'pixpro-frontend-client',
  },
  workerUrl: 'ws://localhost:3001/ws',
};
