export interface Message {
  id: string
  content: string
  timestamp: string
  sender: 'user' | 'assistant'
  status: 'complete' | 'paused' | 'in-progress'
}
