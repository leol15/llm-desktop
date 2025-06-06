// import { ElectronAPI } from '@electron-toolkit/preload'
import { ApiType, DataApiType } from './index'

declare global {
  interface Window {
    // electron: ElectronAPI
    api: ApiType
    dataApi: DataApiType
  }
}
