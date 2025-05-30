import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
const api = {
  getResponseStream: (msg, callback, onclose?) => {
    const { port1, port2 } = new MessageChannel()

    // We send one end of the port to the main process ...
    ipcRenderer.postMessage('send-chat-message', { message: msg }, [port2])

    // ... and we hang on to the other end. The main process will send messages
    // to its end of the port, and close it when it's finished.
    port1.onmessage = (event) => {
      callback(event.data)
    }

    port1.addEventListener('close', () => {
      onclose && onclose()
    })
  }
}

export type ApiType = typeof api

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
