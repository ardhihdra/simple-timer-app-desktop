import { ElectronAPI } from '@electron-toolkit/preload'

type ApiType = {
  onPingData: (callback: (data: any) => void) => void;
  onLogData: (callback: (data: any) => void) => void;
  onPostLogData: (callback: (data: any) => void) => void;
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: ApiType
  }
}

