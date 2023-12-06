import { Config } from '@config/Config'
import { tokens } from '@di/Tokens'
import type { ICache } from './@types/ICache'
import { injectable, inject } from 'tsyringe'

@injectable()
export class GenericCache<T> implements ICache<T> {
  private cacheData: Map<string, Array<T>> = new Map<string, Array<T>>()
  private expire: number
  private expirationTime: number = 30000

  constructor(
    @inject(tokens.Config)
    private config: Config
  ) {
    this.expirationTime =
      this.config.get().cache.expirationTime || this.expirationTime
    this.expire = Date.now() + this.expirationTime
  }

  public isValid(): boolean {
    return this.expire > Date.now()
  }

  public getData(key: string): Array<T> | undefined {
    return this.cacheData.get(key)
  }

  public addData(key: string, newData: Array<T>): void {
    const existingData = this.getData(key)
    const uniqueData = this.removeDuplicates(existingData, newData)
    this.cacheData.set(key, uniqueData)
    this.updateExpirationTime()
  }

  private removeDuplicates(
    existingData: Array<T> | undefined,
    newData: Array<T>
  ): Array<T> {
    const uniqueData: Array<T> = existingData ? [...existingData] : []

    for (const item of newData) {
      if (!existingData?.includes(item)) {
        uniqueData.push(item)
      }
    }
    return uniqueData
  }

  private updateExpirationTime(): void {
    this.expire = Date.now() + this.expirationTime
  }
}
