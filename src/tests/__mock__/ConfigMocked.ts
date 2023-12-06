export const MockConfig = {
  get: () => ({
    github: {
      url: 'mocked_github_url',
      authorizationToken: 'mocked_github_token',
    },
    serverConfig: {
      port: 3000,
    },
    cache: {
      expirationTime: 300000,
    },
  }),
}
