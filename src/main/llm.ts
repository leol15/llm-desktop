import { Ollama } from 'ollama'
import { GetChatResponseStreamHandler } from '../types/apiTypes'

// Configure Ollama with custom host and port
const ollama = new Ollama({
  host: 'http://172.20.96.1:11444'
})

const MODEL = 'gemma3:1b'

export async function* chatStream(
  input: Parameters<GetChatResponseStreamHandler>[0]
): ReturnType<GetChatResponseStreamHandler> {
  console.log(
    'Chatting with model:',
    MODEL,
    'msg:',
    input.messages.reduce((acc, msg) => acc + msg.content, '').length,
    'chars'
  )

  try {
    const response = await ollama.chat({
      model: input.model ?? MODEL,
      stream: true,
      messages: input.messages
      // messages: [{ role: 'user', content: msg }]
    })

    for await (const part of response) {
      // process.stdout.write(part.message.content)
      if (part.done) {
        console.log('Chat stream done', part)
      }
      yield {
        content: part.message.content,
        done: part.done,
        total_duration: part.total_duration / 1_000_000_000,
        load_duration: part.load_duration / 1_000_000_000,
        prompt_eval_count: part.prompt_eval_count,
        prompt_eval_duration: part.prompt_eval_duration / 1_000_000_000,
        eval_count: part.eval_count,
        eval_duration: part.eval_duration / 1_000_000_000
      }
    }
  } catch (error) {
    console.error('Error during chat:', error)
    yield { content: 'Error during chat, bye', done: true }
  }
}

// Export the configured ollama instance for use in other parts of the app
export { ollama }
