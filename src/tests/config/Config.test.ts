jest.autoMockOff()

import { Configuration, Config } from '@config/Config'
import dotenv from 'dotenv'

jest.mock('dotenv', () => ({
  config: jest.fn(),
}))

describe('Config', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should get configuration from environment variables', () => {
    const mockedConfigData: Configuration = {
      github: {
        url: 'https://api.github.com',
        authorizationToken: 'your_auth_token',
      },
      serverConfig: {
        port: 3000,
      },
      cache: {
        expirationTime: 300000,
      },
    }

    process.env.GITHUB_URL = mockedConfigData.github.url
    process.env.GITHUB_TOKEN = mockedConfigData.github.authorizationToken
    process.env.PORT = String(mockedConfigData.serverConfig.port)
    process.env.CACHE_EXPIRATION_TIME = String(
      mockedConfigData.cache.expirationTime
    )

    const config = new Config()

    expect(dotenv.config).toHaveBeenCalledWith({ path: '.env', override: true })

    const result = config.get()
    expect(result).toEqual(mockedConfigData)
  })

  it('should provide default configuration when environment variables are missing', () => {
    ;(dotenv.config as jest.Mock).mockReturnValueOnce({})

    const config = new Config()

    expect(dotenv.config).toHaveBeenCalledWith({ path: '.env', override: true })

    const result = config.get()
    expect(result).toEqual({
      github: {
        url: 'https://api.github.com',
        authorizationToken: 'your_auth_token',
      },
      serverConfig: {
        port: 3000,
      },
      cache: {
        expirationTime: 300000,
      },
    })
  })
})
