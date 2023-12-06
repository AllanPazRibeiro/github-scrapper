import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  CancelTokenSource,
} from 'axios'

import { IHttpClient, IRequestOptions } from '../@types/IHttpClient'

export class HttpClientError extends Error {
  public name = 'HTTPClientError'
  public code: string
  public message: string

  constructor(error: AxiosError) {
    super(undefined)

    this.code = 'internal_server_error'
    this.message = error.message

    if (error.response?.status === 401) {
      this.code = 'unauthorized'
      this.message =
        (error.response?.data as any).suggestedAction || 'Unauthorized'
    }

    if ((error.response?.data as any).code) {
      this.code = (error.response?.data as any).code
      this.message = (error.response?.data as any).message
    }
  }
}

export class HttpClient implements IHttpClient {
  private http: AxiosInstance
  private cancelToken = axios.CancelToken

  constructor(host: string, port?: string, timeout = 30000) {
    const baseURL = port ? `${host}:${port}` : host
    this.http = axios.create({
      timeout,
      baseURL,
      responseType: 'json',
    })
    this.updateInterceptors()
  }

  public get<Response>(
    url: string,
    options?: IRequestOptions,
    query?: any
  ): Promise<Response> {
    const config: IRequestOptions = { ...options, params: query }
    return this.http.get<Response>(url, config).then(this.getData)
  }

  public post<Response, Body>(
    url: string,
    data?: Body,
    options?: IRequestOptions
  ): Promise<Response> {
    return this.http.post(url, data, options).then(this.getData)
  }

  public delete<Response, Body>(
    url: string,
    _data?: Body,
    options?: IRequestOptions
  ): Promise<Response> {
    return this.http.delete(url, options).then(this.getData)
  }

  public put<Response, Body>(
    url: string,
    data?: Body,
    options?: IRequestOptions
  ): Promise<Response> {
    return this.http.put(url, data, options).then(this.getData)
  }

  public patch<Response, Body>(
    url: string,
    data?: Body,
    options?: IRequestOptions
  ): Promise<Response> {
    return this.http.patch(url, data, options).then(this.getData)
  }

  public getCancelTokenSource(): CancelTokenSource {
    return this.cancelToken.source()
  }

  public updateInterceptors() {
    this.http.interceptors.response.use(this.handleSuccess, this.handleError)
  }

  public cancelRequest(source: CancelTokenSource): boolean {
    try {
      source.cancel(`${source.token} canceled`)
      return true
    } catch (e) {
      return false
    }
  }

  private getData<Response>(response: AxiosResponse<Response>): Response {
    return response.data
  }

  private handleSuccess(response: AxiosResponse): AxiosResponse {
    return response
  }

  private handleError(error: AxiosError): Promise<AxiosError> {
    return Promise.reject(new HttpClientError(error))
  }
}
