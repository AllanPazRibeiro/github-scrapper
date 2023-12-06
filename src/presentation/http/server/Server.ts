import express, { Express, Router } from 'express'
import * as http from 'http'

export default class Server {
  private static instance: Server

  private app!: Express
  private server?: http.Server
  private defaultRouter!: Router

  private constructor() {
    this.app = express()
    this.initRouter()
  }

  public static create() {
    if (this.instance) return this.instance
    return new Server()
  }

  public use(...args: any[]) {
    this.defaultRouter.use(...args)
  }

  private initRouter() {
    this.defaultRouter = express.Router()
    this.defaultRouter.use(express.json())
    this.app.disable('x-powered-by')
    this.app.use(this.defaultRouter)
  }

  public listen(port: number) {
    console.info('Starting application')

    this.server = this.app.listen(port, () => {
      console.info(`Application running on :${port}`)
    })

    process.once('SIGTERM', this.onTerminationRequest)
    process.once('SIGINT', this.onTerminationRequest)

    return this
  }

  private closeServer(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.server) {
        this.server.close((err) => {
          if (err) return reject(err)

          return resolve()
        })
      } else {
        resolve()
      }
    })
  }

  private onTerminationRequest = async () => {
    console.info('Termination request. Shutting down')
    try {
      const promises = [this.closeServer()]

      await Promise.all(promises)
      console.info('Gracefully terminating')
      process.exit(0)
    } catch (err) {
      console.error('Error on terminating gracefully')
      console.error(err)
      process.exit(1)
    }
  }
}
