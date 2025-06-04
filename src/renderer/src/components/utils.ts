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
