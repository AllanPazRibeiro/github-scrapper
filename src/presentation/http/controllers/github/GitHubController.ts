import { GitHubRepoBranchesReturn } from '@application/services/@types/GitHubRepoBranches'
import { GitHubRepoBranches } from '@application/services/GitHubRepoBranches'
import { tokens } from '@di/Tokens'
import {
  badRequest,
  notFound,
  ok,
  serverError,
} from '@presentation/http/helpers/HttpHelper'
import { Controller } from '@presentation/http/protocols/Controller'
import { HttpRequest, HttpResponse } from '@presentation/http/protocols/Http'
import {
  makeRepositoriesParamsSchema,
  makeRepositoriesQuerySchema,
} from '@presentation/http/validators/Schemas'
import { inject, injectable } from 'tsyringe'
import { GitHubParams } from './@types/IGitHubRepositories'

@injectable()
export class GitHubController implements Controller {
  constructor(
    @inject(tokens.GitHubRepoBranches)
    private gitHubRepoBranches: GitHubRepoBranches
  ) {}

  public async handle(
    httpRequest: HttpRequest<GitHubParams>
  ): Promise<HttpResponse> {
    try {
      const { params, query } = httpRequest

      try {
        await makeRepositoriesParamsSchema.validateAsync(params)
      } catch (error) {
        return badRequest(error as Error)
      }

      const { username } = params
      let queryParams

      if (query) {
        try {
          await makeRepositoriesQuerySchema.validateAsync(query)
          queryParams = query
        } catch (error) {
          return badRequest(new Error('invalid parameters'))
        }
      }

      const response = await this.gitHubRepoBranches.getRepoBranchesInfo(
        username,
        queryParams
      )

      if (response instanceof Error) {
        return badRequest(response as Error)
      }

      return ok<GitHubRepoBranchesReturn>(response)
    } catch (error: any) {
      if (error.status === 404) {
        return notFound()
      }
      return serverError(error as Error)
    }
  }
}
