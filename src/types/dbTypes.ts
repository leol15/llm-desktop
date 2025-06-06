export interface DDialog {
  id: string
  title: string
  timestamp: string
}

export interface DMessage {
  id: string
  timestamp: string
  sender: string
  content: string
  extra: unknown
}
