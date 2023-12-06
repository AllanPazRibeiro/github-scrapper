import IServer from './@types/IServer'
import Server from './Server'

const createServer = (): IServer => {
  return Server.create() as unknown as IServer
}

export default createServer
