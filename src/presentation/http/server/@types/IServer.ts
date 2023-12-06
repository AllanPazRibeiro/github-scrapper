interface IServer {
  use(...args: any[]): void
  listen(port: number): void
}

export default IServer
