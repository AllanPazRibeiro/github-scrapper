type GitHubRepository = {
  name: string
  ownerLogin: string
  branches: Array<{
    name: string
    lastCommitSHA: string
  }>
}

export type GitHubParams = {
  username: string
  sort?: 'created' | 'updated' | 'pushed' | 'full_name'
  direction?: 'asc' | 'desc'
  per_page?: number
  page?: number
}

export type GitHubRepositories = Array<GitHubRepository>
