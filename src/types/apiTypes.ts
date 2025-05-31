export enum StreamApis {
  GET_CHAT_RESPONSE_STREAM = 'GET_CHAT_RESPONSE_STREAM'
}

export interface Message {
  role: 'user' | 'assistant'
  content: string
}
export interface ChatResponsePart {
  content: string
  done: boolean
  total_duration?: number
  load_duration?: number
  prompt_eval_count?: number
  prompt_eval_duration?: number
  eval_count?: number
  eval_duration?: number
}
// export type GetChatResponseStreamApi = (
//   messages: Message[],
//   handleStreamPart: (part: ChatResponsePart) => void,
//   handleStreamClose?: () => void
// ) => void

export type StreamApiClientType<Input, StreamChunkType> = (
  messages: Input,
  handleStreamPart: (part: StreamChunkType) => void,
  handleStreamClose?: () => void
) => void

export type GetChatResponseStreamApi = StreamApiClientType<Message[], ChatResponsePart>

export type GetChatResponseStreamHandler = (
  req: Message[]
) => AsyncGenerator<ChatResponsePart, void, unknown>
