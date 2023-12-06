import { ServerError } from '../errors/ServerError'
import { HttpResponse } from '../protocols/Http'

export const ok = <T>(data: T): HttpResponse => ({
  statusCode: 200,
  body: data,
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(String(error.stack)),
})

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
})

export const forbidden = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: error,
})
