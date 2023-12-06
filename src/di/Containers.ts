import { Config } from '@config/Config'
import { container } from 'tsyringe'
import { tokens } from './Tokens'
import { GitHubAPI } from '@application/facade/github/GitHubAPI'
import { GitHubController } from '@presentation/http/controllers/github/GitHubController'
import { GitHubRepoBranches } from '@application/services/GitHubRepoBranches'
import { Routes } from '@presentation/http/router/Routes'
import { GenericCache } from '@domain/cache/Cache'

const childContainer = container.createChildContainer()

childContainer.register(tokens.Config, { useClass: Config })
childContainer.register(tokens.Routes, { useClass: Routes })
childContainer.register(tokens.GitHubAPI, { useClass: GitHubAPI })
childContainer.register(tokens.GitHubController, { useClass: GitHubController })
childContainer.register(tokens.GitHubRepoBranches, {
  useClass: GitHubRepoBranches,
})
childContainer.register(tokens.Cache, { useClass: GenericCache })

export { childContainer as container }
