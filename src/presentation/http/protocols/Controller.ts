import { HttpRequest, HttpResponse } from './Http'

export interface Controller {
  handle(httpRequest: HttpRequest<any>): Promise<HttpResponse>
}
