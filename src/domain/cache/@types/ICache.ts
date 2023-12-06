export interface ICache<T> {
  isValid(): boolean
  getData(key: string): Array<T> | undefined
  addData(key: string, newData: Array<T>): void
}
