# llm-desktop

An Electron application with React and TypeScript

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

### Running Ollama

- install on windows
- customize model location, port, for example:

```
$env:OLLAMA_HOST = "0.0.0.0:11444"
$env:OLLAMA_MODELS = "S:\Ollama\models"
```

Find windows host address in wsl2 (WSL network access mode: NAT):

```
ip route show | grep -i default | awk '{ print $3 }'
```

### TODO

- MCP integration
- RAG & Memory
- add model capabilities: tool, think, image
