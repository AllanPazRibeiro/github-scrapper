import { tokens } from '@di/Tokens'
import createRouter from './router/CreateRouter'
import { Routes } from './router/Routes'
import createServer from './server/CreateServer'
import { container } from '@di/Containers'

const app = createServer()

const router = createRouter()
const routes = container.resolve<Routes>(tokens.Routes)

routes.setupRouter(router)
app.use(router)

export default app
