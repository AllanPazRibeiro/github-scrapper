import { AxiosRequestConfig, CancelToken, CancelTokenSource } from 'axios'

export type IHeaders = {
  [key: string]: string | undefined
}

export type IRequestOptions<H = IHeaders> = {
  cancelToken?: CancelToken
  params?: AxiosRequestConfig['params']
  headers?: H
}

export interface IHttpClient {
  get<Response>(
    url: string,
    options?: IRequestOptions,
    query?: any
  ): Promise<Response>

  post<Response, Body>(
    url: string,
    data?: Body,
    options?: IRequestOptions
  ): Promise<Response>

  delete<Response, Body>(
    url: string,
    _data?: Body,
    options?: IRequestOptions
  ): Promise<Response>

  put<Response, Body>(
    url: string,
    data?: Body,
    options?: IRequestOptions
  ): Promise<Response>

  patch<Response, Body>(
    url: string,
    data?: Body,
    options?: IRequestOptions
  ): Promise<Response>

  getCancelTokenSource(): CancelTokenSource

  updateInterceptors(): void

  cancelRequest(source: CancelTokenSource): boolean
}
