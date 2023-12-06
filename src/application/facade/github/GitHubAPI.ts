import { Config } from '@config/Config'
import type { IHttpClient } from '@shared/@types/IHttpClient'
import { HttpClient } from '@shared/http/HttpClient'
import { inject, injectable } from 'tsyringe'
import type { Repositories } from './@types/IGitHubRepositories'
import { Branches } from './@types/IGitHubBranches'
import { tokens } from '@di/Tokens'
import { PaginationQuery } from '@application/services/@types/GitHubRepoBranches'

@injectable()
export class GitHubAPI {
  private authorizationToken: string
  private client: IHttpClient
  constructor(
    @inject(tokens.Config)
    private config: Config
  ) {
    const {
      github: { authorizationToken, url },
    } = this.config.get()
    this.client = new HttpClient(url)
    this.authorizationToken = authorizationToken
  }

  public async getRepositories(
    username: string,
    query?: PaginationQuery
  ): Promise<Repositories> {
    const path = `/users/${username}/repos`
    const fullPath = query
      ? `${path}?${new URLSearchParams(query as Record<string, string>)}`
      : path
    const headers = {
      Authorization: `Bearer ${this.authorizationToken}`,
      Accept: 'application/vnd.github+json',
    }

    return this.client.get<Repositories>(fullPath, { headers }, query)
  }

  public async getBranches(
    owner: string,
    repoName: string,
    query?: PaginationQuery
  ): Promise<Branches> {
    const path = `/repos/${owner}/${repoName}/branches`
    const fullPath = query
      ? `${path}?${new URLSearchParams(query as Record<string, string>)}`
      : path
    const headers = {
      Authorization: `Bearer ${this.authorizationToken}`,
      Accept: 'application/vnd.github+json',
    }

    return this.client.get<Branches>(fullPath, { headers }, query)
  }
}
