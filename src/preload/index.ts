import { contextBridge, ipcRenderer } from 'electron'
import {
  AsyncApiClientType,
  AsyncApis,
  GetChatResponseStreamApi,
  StopChatApi,
  StreamApiClientType,
  StreamApis,
  SummarizeChatStreamApi
} from '../types/apiTypes'

// helper types to forward any request to backend
type GetTypeA<T> = T extends StreamApiClientType<infer A, unknown> ? A : never
type GetTypeB<T> = T extends StreamApiClientType<unknown, infer B> ? B : never
const passStreamRequestToMain =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <T extends StreamApiClientType<any, any>>(
      api: StreamApis
    ): StreamApiClientType<GetTypeA<T>, GetTypeB<T>> =>
    (a, b, c) =>
      getResponseStream(api, a, b, c)

type GetAsyncTypeA<T> = T extends AsyncApiClientType<infer A, unknown> ? A : never
type GetAsyncTypeB<T> = T extends AsyncApiClientType<unknown, infer B> ? B : never
const passRequestToMain =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <T extends AsyncApiClientType<any, any>>(
      api: AsyncApis
    ): AsyncApiClientType<GetAsyncTypeA<T>, GetAsyncTypeB<T>> =>
    (a) =>
      getResponse(api, a)

// Custom APIs for renderer
const api = {
  getChatResponseStream: passStreamRequestToMain<GetChatResponseStreamApi>(
    StreamApis.GET_CHAT_RESPONSE_STREAM
  ),
  summarizeDialogStream: passStreamRequestToMain<SummarizeChatStreamApi>(
    StreamApis.SUMMARIZE_CHAT_STREAM
  ),
  stopChat: passRequestToMain<StopChatApi>(AsyncApis.STOP_CHAT),
  // TODO
  invoke: <Req, Res>(api: string, request: Req): Promise<Res> => {
    return ipcRenderer.invoke(api, request)
  },
  // TODO
  send: <T>(api: string, request: T): void => {
    ipcRenderer.send(api, request)
  }
}

export type ApiType = typeof api

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  // window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

// utils
function getResponseStream<Input, Output>(
  api: StreamApis,
  input: Input,
  onMessage: (outputPart: Output) => void,
  onclose?: () => void
): void {
  const { port1, port2 } = new MessageChannel()

  // We send one end of the port to the main process ...
  ipcRenderer.postMessage(api, input, [port2])
  // ... and we hang on to the other end. The main process will send messages
  // to its end of the port, and close it when it's finished.
  port1.onmessage = (event: MessageEvent<Output>) => {
    onMessage(event.data)
  }

  port1.addEventListener('close', () => {
    onclose && onclose()
  })
}

function getResponse<Input, Output>(api: AsyncApis, input: Input): Promise<Output> {
  return ipcRenderer
    .invoke(api, input)
    .then((response: Output) => response)
    .catch((error: Error) => {
      console.error(`Error invoking API ${api}:`, error)
      throw error
    })
}
