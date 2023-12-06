import 'reflect-metadata'

import { Config } from '@config/Config'
import app from '@presentation/http/App'

const config = new Config()

app.listen(config.get().serverConfig.port)
