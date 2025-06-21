import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { Tool } from 'ollama'

export const mcpClient = new Client({ name: 'mcp-client-cli', version: '1.0.0' })

// connect to the MCP server
// const command = process.execPath // this is electron's execPath
const command = 'node'
console.log('execPath:', command)
const transport = new StdioClientTransport({
  command,
  args: ['../mcp/weather/build/index.js']
})
const tools: Tool[] = []
mcpClient
  .connect(transport)
  .then(async () => {
    console.log('Connected to MCP server')
    const newTools = await getToolsFromMcp()
    tools.push(...newTools)
  })
  .catch((error) => {
    console.error('Failed to connect to MCP server:', error)
  })

export const getTools = (): Tool[] => {
  console.log('getTools called')
  return [
    ...tools,
    {
      type: 'function',
      function: {
        name: 'calculator',
        description: 'Perform basic arithmetic operations',
        parameters: {
          type: 'object',
          properties: {
            leftOperand: {
              type: 'number',
              description: 'The left operand for the operation'
            },
            rightOperand: {
              type: 'number',
              description: 'The right operand for the operation'
            },
            operation: {
              type: 'string',
              description: 'The arithmetic operation to perform',
              enum: ['add', 'subtract', 'multiply', 'divide']
            }
          },
          required: ['leftOperand', 'rightOperand', 'operation']
        }
      }
    }
  ]
}

const getToolsFromMcp = async (): Promise<Tool[]> => {
  return mcpClient.listTools().then((tools) => {
    console.log('Available tools:', JSON.stringify(tools.tools))
    return tools.tools.map((mcpTool) => {
      const tool: Tool = {
        type: 'function',
        function: {
          name: mcpTool.name,
          description: mcpTool.description,
          parameters: {
            properties: mcpTool.inputSchema.properties,
            required: mcpTool.inputSchema.required
          } as Tool['function']['parameters']
        }
      }
      return tool
    })
  })
}
