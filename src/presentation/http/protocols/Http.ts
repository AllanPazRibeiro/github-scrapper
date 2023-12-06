export type HttpResponse = {
  statusCode: number
  body: any
}

export type HttpRequest<T> = {
  referer?: any
  route?: any
  url?: string
  method?: any
  userAgent?: any
  remoteAddress?: any
  body?: any
  headers?: any
  params: any
  customer?: {
    id: string
  }
  query?: T
  request?: any
}
