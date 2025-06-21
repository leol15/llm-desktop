import { Ollama } from 'ollama'
import {
  GetChatResponseStreamHandler,
  StopChatHandler,
  SummarizeChatStreamHandler
} from '../types/apiTypes'
import { MODEL_BY_ID } from '../types/constants'
import { getTools, mcpClient } from './mcp_client'
import { getSummaryTemplate, SUMMARIZE_CHATS_TEMPLATE_SYSTEM_TEMPLATE } from './templates'

// Configure Ollama with custom host and port
const ollama = new Ollama({
  host: 'http://172.20.96.1:11444'
})

const MODEL = 'gemma3:1b'

export async function* chatStream(
  input: Parameters<GetChatResponseStreamHandler>[0]
): ReturnType<GetChatResponseStreamHandler> {
  const model = input.model ?? MODEL
  console.log(
    'Chatting with model:',
    model,
    'msg:',
    input.messages.reduce((acc, msg) => acc + msg.content, '').length,
    'chars'
  )

  try {
    const response = await ollama.chat({
      model: model,
      stream: true,
      messages: input.messages,
      keep_alive: '1h',
      ...(MODEL_BY_ID[model]?.supportsTools === false ? {} : { tools: getTools() })
    })

    let lastTime = process.hrtime.bigint()
    const cachedParts: string[] = []
    for await (const part of response) {
      const currTime = process.hrtime.bigint()
      if (part.message.tool_calls?.length) {
        console.log('Number of tool calls', part.message.tool_calls.length, part)
        const toolCall = part.message.tool_calls[0]
        console.log(JSON.stringify(toolCall))
        // call the tool
        const toolInputStr = `Assistant Tool Input: 
        ${JSON.stringify(toolCall.function, null, 2)}
        `
        let toolResultStr
        yield {
          content: `\nCalling tool input: \n\`\`\`\n${JSON.stringify(toolCall, null, 2)}\n\`\`\`\n`,
          done: false
        }
        try {
          const result = await mcpClient.callTool({
            name: toolCall.function.name,
            arguments: toolCall.function.arguments
          })
          await new Promise((resolve) => setTimeout(resolve, 1000))
          // const result = await this.mcp.callTool({
          //   name: toolName,
          //   arguments: toolArgs,
          // });
          toolResultStr = Array.isArray(result.content)
            ? // ? result.content.map((row) => row.text).join('\n')
              `Calling tool output:\n\`\`\`\n${JSON.stringify(result.content, null, 2)}\n\`\`\`\n`
            : ''
          console.log('result', result, toolResultStr)
        } catch (e: unknown) {
          console.log('error calling tool', e)
          toolResultStr = `\nCalling tool error: \n\`\`\`\n${JSON.stringify(e.message, null, 2)}\n\`\`\`\n`
        }
        yield {
          content: toolResultStr,
          done: false
        }
        console.log('breaking out and adding tool response')
        yield {
          content: '[DOWN]',
          done: false,
          total_duration: part.total_duration / 1_000_000_000,
          load_duration: part.load_duration / 1_000_000_000,
          prompt_eval_count: part.prompt_eval_count,
          prompt_eval_duration: part.prompt_eval_duration / 1_000_000_000,
          eval_count: part.eval_count,
          eval_duration: part.eval_duration / 1_000_000_000
        }
        yield* chatStream({
          ...input,
          messages: [
            ...input.messages,
            { role: 'tool', content: toolInputStr + '\n' + toolResultStr }
            // { role: 'user', content: 'please continue solving with the tool result above' }
          ]
        })
        console.log('back to original chat')
        yield {
          content: '[UP]',
          done: false,
          total_duration: part.total_duration / 1_000_000_000,
          load_duration: part.load_duration / 1_000_000_000,
          prompt_eval_count: part.prompt_eval_count,
          prompt_eval_duration: part.prompt_eval_duration / 1_000_000_000,
          eval_count: part.eval_count,
          eval_duration: part.eval_duration / 1_000_000_000
        }
      }
      if (part.done) {
        console.log('Chat stream done', part)
      } else if (currTime - lastTime < 15 * 1000 * 1000) {
        // cachedParts.push(part.message.content)
        // continue
      }

      const cachedMsg = cachedParts.join('')
      cachedParts.length = 0
      lastTime = currTime
      yield {
        content: cachedMsg + part.message.content,
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
    yield streamErrorHandler(error)
  }
}

export async function* summarizeChatStream(
  input: Parameters<SummarizeChatStreamHandler>[0]
): ReturnType<SummarizeChatStreamHandler> {
  console.log(
    'Summarizing with model:',
    MODEL,
    'msg:',
    input.messages.reduce((acc, msg) => acc + msg.content, '').length,
    'chars'
  )

  try {
    const response = await ollama.chat({
      model: input.model ?? MODEL,
      keep_alive: '1h',
      stream: true,
      messages: [
        { role: 'system', content: SUMMARIZE_CHATS_TEMPLATE_SYSTEM_TEMPLATE },
        { role: 'user', content: getSummaryTemplate(input.messages) }
      ]
    })

    for await (const part of response) {
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
    yield streamErrorHandler(error)
  }
}

function streamErrorHandler(error) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    (error as { name: string }).name === 'AbortError'
  ) {
    console.log('Stream aborted by user.')
    return { content: '[stopped]', done: true }
  } else {
    console.error('Error during chat:', error)
    return { content: 'Error during chat, bye', done: true }
  }
}

export const stopChatStream: StopChatHandler = () => {
  console.log('Chat stream stopped')
  ollama.abort()
}

// Export the configured ollama instance for use in other parts of the app
export { ollama }
