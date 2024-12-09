export function getUserInitials(name: string) {
  if (!name) {
    return 'FT'
  }
  const words = name.trim().split(/\s+/)

  return words.map((word) => word[0].toUpperCase()).join('')
}
