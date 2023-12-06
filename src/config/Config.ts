import { injectable } from 'tsyringe'
import dotenv from 'dotenv'

export type Configuration = {
  github: {
    url: string
    authorizationToken: string
  }
  serverConfig: {
    port: number
  }
  cache: {
    expirationTime: number
  }
}

@injectable()
export class Config {
  private readonly config: Configuration

  constructor() {
    this.config = this.getConfigFromEnv()
  }

  public get() {
    return this.config
  }

  private getConfigFromEnv(): Configuration {
    dotenv.config({ path: '.env', override: true })

    return {
      github: {
        url: process.env.GITHUB_URL || 'https://api.github.com',
        authorizationToken: process.env.GITHUB_TOKEN || '',
      },
      serverConfig: {
        port: Number(process.env.PORT) || 3000,
      },
      cache: {
        expirationTime: Number(process.env.CACHE_EXPIRATION_TIME) || 300000,
      },
    }
  }
}
