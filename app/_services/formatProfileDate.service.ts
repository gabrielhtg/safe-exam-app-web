export function formatProfileDate(isString: string) {
  const date = new Date(isString)

  const formattedDate = date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  return `${formattedDate}`
}
