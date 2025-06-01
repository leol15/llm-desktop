import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'
import {
  AsyncApis,
  GetChatResponseStreamHandler,
  StopChatHandler,
  StreamApis,
  SummarizeChatStreamHandler
} from '../types/apiTypes'
import { chatStream, stopChatStream, summarizeChatStream } from './llm'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    // frame: false,
    titleBarStyle: 'hidden',
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // Handle chat requests with response
  ipcMain.handle('chat', async (_event, message) => {
    try {
      return { success: true, data: message }
    } catch (error) {
      console.error('Chat error:', error)
      return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
  })

  // streaming
  const handleGetResponseStream = <Req, StreamChunk>(
    api: StreamApis,
    chunkGenerator: (req: Req) => AsyncGenerator<StreamChunk, void, unknown>
  ): void => {
    // streaming
    ipcMain.on(api, async (event, request: Req) => {
      // The renderer has sent us a MessagePort that it wants us to send our
      // response over.
      const [replyPort] = event.ports

      // Here we send the messages synchronously, but we could just as easily store
      // the port somewhere and send messages asynchronously.
      const responses = await chunkGenerator(request)
      for await (const part of responses) {
        replyPort.postMessage(part)
      }

      // We close the port when we're done to indicate to the other end that we
      // won't be sending any more messages. This isn't strictly necessary--if we
      // didn't explicitly close the port, it would eventually be garbage
      // collected, which would also trigger the 'close' event in the renderer.
      replyPort.close()
    })
  }

  // non-streaming
  const handleGetResponse = <Req, Res>(
    api: AsyncApis,
    responseHandler: (req: Req) => Promise<Res> | Res
  ): void => {
    ipcMain.handle(api, async (_event, request: Req) => {
      try {
        return await responseHandler(request)
      } catch (error) {
        console.error(`Error handling ${api}:`, error)
        return {
          success: false,
          error: error instanceof Error ? error.message : String(error)
        }
      }
    })
  }

  handleGetResponseStream(
    StreamApis.GET_CHAT_RESPONSE_STREAM,
    chatStream as GetChatResponseStreamHandler
  )

  handleGetResponseStream(
    StreamApis.SUMMARIZE_CHAT_STREAM,
    summarizeChatStream as SummarizeChatStreamHandler
  )

  handleGetResponse(AsyncApis.STOP_CHAT, stopChatStream as StopChatHandler)

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
