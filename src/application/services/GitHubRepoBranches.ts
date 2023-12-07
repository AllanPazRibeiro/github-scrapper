import { GitHubAPI } from '@application/facade/github/GitHubAPI'
import {
  Branch,
  Branches,
} from 'application/facade/github/@types/IGitHubBranches'
import {
  Repositories,
  Repository,
} from 'application/facade/github/@types/IGitHubRepositories'
import { tokens } from '@di/Tokens'
import { inject, injectable } from 'tsyringe'
import {
  GitHubRepoBranchesReturn,
  PaginationQuery,
} from './@types/GitHubRepoBranches'
import { GenericCache } from '@domain/cache/Cache'

@injectable()
export class GitHubRepoBranches {
  constructor(
    @inject(tokens.GitHubAPI)
    private gitHubApi: GitHubAPI,
    @inject(tokens.Cache)
    private repositoriesCache: GenericCache<Repository>,
    @inject(tokens.Cache)
    private branchesCache: GenericCache<Branch>
  ) {}

  private async getRepositoriesBy(
    username: string,
    query?: PaginationQuery
  ): Promise<Repositories> {
    const cacheKey = username
    const cachedData = this.repositoriesCache.getData(cacheKey)
    if (
      this.repositoriesCache.isValid() &&
      cachedData &&
      cachedData.length > 0
    ) {
      return cachedData
    } else {
      try {
        const repositories = await this.gitHubApi.getRepositories(
          username,
          query
        )
        this.repositoriesCache.addData(cacheKey, repositories)
        return repositories
      } catch (error) {
        console.error(error)
        throw error
      }
    }
  }

  private async getBranchesBy(
    repoName: string,
    ownerLogin: string,
    query?: PaginationQuery
  ): Promise<Branches> {
    const cacheKey = `${repoName}${ownerLogin}`
    const cachedData = this.branchesCache.getData(cacheKey)
    if (this.branchesCache.isValid() && cachedData && cachedData.length > 0) {
      return cachedData
    } else {
      try {
        const branches = await this.gitHubApi.getBranches(
          ownerLogin,
          repoName,
          query
        )
        this.branchesCache.addData(cacheKey, branches)
        return branches
      } catch (error) {
        console.error(error)
        throw new Error('Failed to fetch branches')
      }
    }
  }

  public async getRepoBranchesInfo(
    repoId: string,
    query?: PaginationQuery
  ): Promise<GitHubRepoBranchesReturn> {
    const repos = await this.getRepositoriesBy(repoId, query)

    const repoBranchesInfo = repos
      .filter((repo) => !repo.fork)
      .map(async (repo) => {
        const repoInfo = {
          repoId: repo.id,
          repoName: repo.name,
          ownerLogin: repo.owner.login,
        }

        const branches = await this.getBranchesBy(
          repoInfo.repoName,
          repoInfo.ownerLogin,
          query
        )

        const branchesInfo = branches.map((branch) => ({
          name: branch.name,
          lastCommitSHA: branch.commit.sha,
        }))

        return {
          repoName: repoInfo.repoName,
          ownerLogin: repoInfo.ownerLogin,
          repoBranches: branchesInfo,
        }
      })

    return Promise.all(repoBranchesInfo)
  }
}
