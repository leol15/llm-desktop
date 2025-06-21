export const MODELS = {
  GEMMA_3_1B: {
    id: 'gemma3:1b',
    name: 'Gemma 3 1B',
    supportsTools: false
  },
  GEMMA_3_4B: {
    id: 'gemma3:4b',
    name: 'Gemma 3 4B',
    supportsTools: false
  },
  GEMMA_3_12B: {
    id: 'gemma3:12b',
    name: 'Gemma 3 12B',
    supportsTools: false
  },
  DEEPSEEK_R1_7B: {
    id: 'deepseek-r1:7b',
    name: 'DeepSeek R1 7B',
    supportsTools: false
  },
  DEEPSEEK_R1_14B: {
    id: 'deepseek-r1:14b',
    name: 'DeepSeek R1 14B',
    supportsTools: false
  },
  QWEN_2_5VL_7B: {
    id: 'qwen2.5vl:7b',
    name: 'Qwen 2.5VL 7B',
    supportsTools: false
  },
  QWEN_3_0_6B: {
    id: 'qwen3:0.6b',
    name: 'Qwen 3 0.6B  (T)',
    supportsTools: true
  },
  QWEN_3_14B: {
    id: 'qwen3:14b',
    name: 'Qwen 3 14B (T)',
    supportsTools: true
  },
  PHI_4_14B: {
    id: 'phi4:14b',
    name: 'Phi 4 14B',
    supportsTools: false
  },
  MISTRAL_3_2_24B: {
    id: 'mistral-small3.2:24b',
    name: 'Mistral 3.2 24B (T)',
    supportsTools: true
  },
  MISTRAL_22B: {
    id: 'mistral-small:22b',
    name: 'Mistral 22B (T)',
    supportsTools: true
  },
  LLAMA_3_1_8B: {
    id: 'llama3.1:8b',
    name: 'Llama 3.1 8B (T)',
    supportsTools: true
  },
  LLAMA_3_2_3B: {
    id: 'llama3.2:3b',
    name: 'Llama 3.2 3B (T)',
    supportsTools: true
  }
}

export const MODEL_BY_ID = Object.fromEntries(
  Object.entries(MODELS).map(([, model]) => [model.id, model])
)
