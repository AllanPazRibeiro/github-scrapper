import { Controller } from '@presentation/http/protocols/Controller'
import { HttpRequest } from '@presentation/http/protocols/Http'
import { Response, Request } from 'express'

export const adaptRoute = (controller: Controller): any => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest<any> = {
      body: req.body,
      params: req.params,
      query: req.query,
    }

    const httpResponse = await controller.handle(httpRequest)

    if (httpResponse.statusCode > 299) {
      return res.status(httpResponse.statusCode).json(httpResponse.body.message)
    }
    return res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
