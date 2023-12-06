jest.autoMockOff()

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
import { container } from 'tsyringe'
import { GenericCache } from '@domain/cache/Cache'
import { GitHubRepoBranches } from '@application/services/GitHubRepoBranches'
import { Config } from '@config/Config'
import { MockConfig } from '@tests/__mock__/ConfigMocked'
import { PaginationQuery } from '@application/services/@types/GitHubRepoBranches'

describe('GitHubRepoBranches - getRepoBranchesInfo method', () => {
  let gitHubApiMock: jest.Mocked<GitHubAPI>
  let repositoriesCacheMock: GenericCache<Repository>
  let branchesCacheMock: GenericCache<Branch>

  beforeEach(() => {
    gitHubApiMock = new GitHubAPI(
      MockConfig as unknown as Config
    ) as jest.Mocked<GitHubAPI>
    gitHubApiMock.getRepositories = jest.fn()
    gitHubApiMock.getBranches = jest.fn()
    container.register(tokens.GitHubAPI, { useValue: gitHubApiMock })

    repositoriesCacheMock = new GenericCache<Repository>(
      MockConfig as unknown as Config
    )
    branchesCacheMock = new GenericCache<Branch>(
      MockConfig as unknown as Config
    )

    container.register(tokens.Cache, { useValue: repositoriesCacheMock })
    container.register(tokens.Cache, { useValue: branchesCacheMock })
  })

  afterEach(() => {
    container.clearInstances()
    jest.clearAllMocks()
  })

  it('should return repository branches info', async () => {
    const repositories: Repositories = [
      { id: 1, name: 'repo1', owner: { login: 'owner1' } } as Repository,
      { id: 2, name: 'repo2', owner: { login: 'owner2' } } as Repository,
    ]

    const branches: Branches = [
      { name: 'main', commit: { sha: 'sha123' } } as Branch,
      { name: 'dev', commit: { sha: 'sha456' } } as Branch,
    ]

    gitHubApiMock.getRepositories.mockResolvedValue(repositories)
    gitHubApiMock.getBranches.mockResolvedValue(branches)

    const gitHubRepoBranches = container.resolve(GitHubRepoBranches)

    const result = await gitHubRepoBranches.getRepoBranchesInfo('username')

    expect(result).toEqual([
      {
        repoName: 'repo1',
        ownerLogin: 'owner1',
        repoBranches: [
          { name: 'main', lastCommitSHA: 'sha123' },
          { name: 'dev', lastCommitSHA: 'sha456' },
        ],
      },
      {
        repoName: 'repo2',
        ownerLogin: 'owner2',
        repoBranches: [
          { name: 'main', lastCommitSHA: 'sha123' },
          { name: 'dev', lastCommitSHA: 'sha456' },
        ],
      },
    ])

    expect(gitHubApiMock.getRepositories).toHaveBeenCalledWith(
      'username',
      undefined
    )
    expect(gitHubApiMock.getBranches).toHaveBeenCalledTimes(2)
  })

  it('should return repository branches info using cache info', async () => {
    const repositories: Repositories = [
      {
        id: 1,
        name: 'cached-repo1',
        owner: { login: 'cached-owner1' },
      } as Repository,
      {
        id: 2,
        name: 'cached-repo2',
        owner: { login: 'cached-owner2' },
      } as Repository,
    ]
    repositoriesCacheMock.addData('username', repositories)

    const branches: Branches = [
      { name: 'cached-main', commit: { sha: 'sha123' } } as Branch,
      { name: 'cached-dev', commit: { sha: 'sha456' } } as Branch,
    ]

    branchesCacheMock.addData('repo1owner1', branches)
    branchesCacheMock.addData('repo2owner2', branches)

    gitHubApiMock.getRepositories.mockResolvedValue(repositories)
    gitHubApiMock.getBranches.mockResolvedValue(branches)

    const gitHubRepoBranches = container.resolve(GitHubRepoBranches)

    const result = await gitHubRepoBranches.getRepoBranchesInfo('username', {
      sort: 'asc',
    } as unknown as PaginationQuery)

    expect(result).toEqual([
      {
        repoName: 'cached-repo1',
        ownerLogin: 'cached-owner1',
        repoBranches: [
          { name: 'cached-main', lastCommitSHA: 'sha123' },
          { name: 'cached-dev', lastCommitSHA: 'sha456' },
        ],
      },
      {
        repoName: 'cached-repo2',
        ownerLogin: 'cached-owner2',
        repoBranches: [
          { name: 'cached-main', lastCommitSHA: 'sha123' },
          { name: 'cached-dev', lastCommitSHA: 'sha456' },
        ],
      },
    ])
  })
})
