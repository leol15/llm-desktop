export enum StreamApis {
  GET_CHAT_RESPONSE_STREAM = 'GET_CHAT_RESPONSE_STREAM',
  SUMMARIZE_CHAT_STREAM = 'SUMMARIZE_CHAT_STREAM'
}

export type StreamApiClientType<Input, StreamChunkType> = (
  messages: Input,
  handleStreamPart: (part: StreamChunkType) => void,
  handleStreamClose?: () => void
) => void

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
export interface GetChatResponseInput {
  messages: Message[]
  model: string
}

export type GetChatResponseStreamApi = StreamApiClientType<GetChatResponseInput, ChatResponsePart>

export type GetChatResponseStreamHandler = (
  input: GetChatResponseInput
) => AsyncGenerator<ChatResponsePart, void, unknown>

export interface SummarizeChatStreamApiInput {
  messages: Message[]
  model: string
}
export type SummarizeChatStreamApi = StreamApiClientType<
  SummarizeChatStreamApiInput,
  ChatResponsePart
>
export type SummarizeChatStreamHandler = (
  input: SummarizeChatStreamApiInput
) => AsyncGenerator<ChatResponsePart, void, unknown>
