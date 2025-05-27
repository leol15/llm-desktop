import { Ollama } from 'ollama'

// Configure Ollama with custom host and port
const ollama = new Ollama({
  host: 'http://172.20.96.1:11444'
})

const MODEL = 'qwen3:0.6b'

export const chat = async (msg?: string) => {
  console.log('Chatting with model:', MODEL, 'msg:', msg)

  try {
    const response = await ollama.chat({
      model: MODEL,
      messages: [{ role: 'user', content: msg || 'Why is the sky blue?' }]
    })
    console.log(response.message.content)
    return response.message.content
  } catch (error) {
    console.error('Error during chat:', error)
    // throw error
    return 'error'
  }
}

// Export the configured ollama instance for use in other parts of the app
export { ollama }
