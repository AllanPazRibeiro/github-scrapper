jest.autoMockOff()
import { GitHubRepoBranchesReturn } from '@application/services/@types/GitHubRepoBranches'
import { GitHubRepoBranches } from '@application/services/GitHubRepoBranches'
import { GitHubParams } from '@presentation/http/controllers/github/@types/IGitHubRepositories'
import { GitHubController } from '@presentation/http/controllers/github/GitHubController'
import { HttpRequest, HttpResponse } from '@presentation/http/protocols/Http'
describe('GitHubController', () => {
  const mockGitHubRepoBranches = {
    getRepoBranchesInfo: jest.fn(),
  } as unknown as jest.Mocked<GitHubRepoBranches>;

  const makeSut = () => {
    const sut = new GitHubController(mockGitHubRepoBranches)
    return { sut }
  }

  it('should return bad request if parameters are invalid', async () => {
    const { sut } = makeSut()
    const mockHttpRequest: HttpRequest<GitHubParams> = {
      params: { username: 123 },
    }

    const httpResponse: HttpResponse = await sut.handle(mockHttpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(expect.any(Error))
  })

  it('should return bad request if query parameters are invalid', async () => {
    const { sut } = makeSut()
    const mockHttpRequest: HttpRequest<GitHubParams> = {
      params: { username: 'valid' },
      query: { invalid: 'param' },
    } as any

    const httpResponse: HttpResponse = await sut.handle(mockHttpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(expect.any(Error))
  })

  it('should return server error if an unexpected error occurs', async () => {
    mockGitHubRepoBranches.getRepoBranchesInfo.mockRejectedValue(
      new Error('Some error')
    )
    const { sut } = makeSut()
    const mockHttpRequest: HttpRequest<GitHubParams> = {
      params: { username: 'valid' },
      query: { sort: 'created', direction: 'desc' },
    } as any

    const httpResponse: HttpResponse = await sut.handle(mockHttpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(expect.any(Error))
  })

  it('should return OK with correct data', async () => {
    const mockResponseData = {
      repoName: 'reponame',
      ownerLogin: 'ownerLogin',
      repoBranches: [
        {
          name: 'branchname',
          lastCommitSHA: '1q3123',
        },
      ],
    } as unknown as GitHubRepoBranchesReturn
    mockGitHubRepoBranches.getRepoBranchesInfo.mockResolvedValue(
      mockResponseData
    )
    const { sut } = makeSut()
    const mockHttpRequest: HttpRequest<GitHubParams> = {
      params: { username: 'valid' },
      query: { sort: 'created', direction: 'desc' },
    } as any

    const httpResponse: HttpResponse = await sut.handle(mockHttpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(mockResponseData)
  })
})
