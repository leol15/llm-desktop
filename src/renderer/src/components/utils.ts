import { MODELS } from '../../../types/constants'

const getTimeOfDay = (): string => {
  const time = new Date().getHours()
  if (time >= 12 && time <= 18) return 'afternoon'
  if (time > 18 && time <= 22) return 'evening'
  if (time > 22 || time <= 5) return 'night'
  return 'morning'
}

export const getGreeting = (): string => {
  return `Good ${getTimeOfDay()}, Oreo`
}

export const getModelByKey = (key: string): { id: string; name: string } => {
  try {
    const savedModel = window.localStorage.getItem(key)
    return savedModel ? JSON.parse(savedModel) : MODELS.GEMMA_3_12B
  } catch (e) {
    console.log(e)
    return MODELS.GEMMA_3_12B
  }
}

export const saveModel = (key: string, model: unknown) => {
  window.localStorage.setItem(key, JSON.stringify(model))
}
