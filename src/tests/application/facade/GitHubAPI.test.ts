jest.autoMockOff()

import { GitHubAPI } from '@application/facade/github/GitHubAPI'
import { Config } from '@config/Config'
import { HttpClient } from '@shared/http/HttpClient'
import { MockConfig } from '@tests/__mock__/ConfigMocked'
import { HttpClientMocked } from '@tests/__mock__/HttpClientMocked'

describe('GitHubAPI Integration Tests', () => {
  let githubApi: GitHubAPI

  beforeEach(() => {
    githubApi = new GitHubAPI(MockConfig as Config)
    githubApi['client'] = HttpClientMocked as HttpClient
  })

  describe('getRepositories', () => {
    it('should fetch repositories for a given valid username', async () => {
      const username = 'valid_username'
      HttpClientMocked.get = async () => {
        return ['', '']
      }

      const repos = await githubApi.getRepositories(username)

      expect(Array.isArray(repos)).toBe(true)
      expect(repos.length).toBe(2)
    })

    it('should throw an error for an invalid username', async () => {
      const username = 'invalid_username'
      HttpClientMocked.get = async () => {
        throw new Error('Invalid username')
      }

      await expect(githubApi.getRepositories(username)).rejects.toThrow(
        'Invalid username'
      )
    })
  })

  describe('getBranches', () => {
    it('should fetch branches for a given valid owner and repo name', async () => {
      const owner = 'valid_owner'
      const repo = 'valid_repo'
      HttpClientMocked.get = async () => {
        return ['', '']
      }

      const branches = await githubApi.getBranches(owner, repo)

      expect(Array.isArray(branches)).toBe(true)
      expect(branches.length).toBe(2)
    })

    it('should throw an error for an invalid owner or repo', async () => {
      const owner = 'invalid_owner'
      const repo = 'invalid_repo'
      HttpClientMocked.get = async () => {
        throw new Error('Invalid owner or repo')
      }

      await expect(githubApi.getBranches(owner, repo)).rejects.toThrow(
        'Invalid owner or repo'
      )
    })
  })
})
