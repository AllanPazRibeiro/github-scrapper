import { GitHubParams } from '@presentation/http/controllers/github/@types/IGitHubRepositories'

export type GitHubRepoBranchesReturn = Array<GitHubRepoBranch>
export type GitHubRepoBranch = {
  repoName: string
  ownerLogin: string
  repoBranches: Array<{
    name: string
    lastCommitSHA: string
  }>
}

export type PaginationQuery = Omit<GitHubParams, 'username'>
