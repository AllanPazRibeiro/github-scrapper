import { Request, Response, Router, json } from 'express'
import { inject, injectable } from 'tsyringe'
import { contentType } from '../middlewares/ContentType'
import cors from 'cors'
import { adaptRoute } from '../adapters/express/express-route-adapter'
import { tokens } from '@di/Tokens'
import { GitHubController } from '../controllers/github/GitHubController'

@injectable()
export class Routes {
  constructor(
    @inject(tokens.GitHubController)
    private gitHubController: GitHubController
  ) {}

  public setupRouter(router: Router) {
    router.use(json())
    router.use(cors())
    router.use(contentType)

    router.get('/v1/status', (_req: Request, res: Response) => {
      res.send('OK')
    })

    router.get('/v1/repositories/:username/', adaptRoute(this.gitHubController))
  }
}
