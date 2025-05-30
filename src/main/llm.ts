import { Ollama } from 'ollama'

// Configure Ollama with custom host and port
const ollama = new Ollama({
  host: 'http://172.20.96.1:11444'
})

const MODEL = 'gemma3:1b'

export async function* chatStream(msg?: string): AsyncGenerator<string, void, unknown> {
  console.log('Chatting with model:', MODEL, 'msg:', msg)

  try {
    const response = await ollama.chat({
      model: MODEL,
      stream: true,
      messages: [{ role: 'user', content: msg || 'Why is the sky blue?' }]
    })

    for await (const part of response) {
      process.stdout.write(part.message.content)
      yield part.message.content
    }
  } catch (error) {
    console.error('Error during chat:', error)
    yield 'Error during chat, bye'
  }
}

// Export the configured ollama instance for use in other parts of the app
export { ollama }
