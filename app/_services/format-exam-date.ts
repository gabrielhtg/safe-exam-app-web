export function formatExamDate(dateString: string) {
  const date = new Date(dateString)

  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long', // Nama hari
    day: '2-digit', // Tanggal
    month: 'short', // Bulan (singkatan)
    year: 'numeric', // Tahun
  })

  const formattedTime = date
    .toLocaleTimeString('en-US', {
      hour: '2-digit', // Jam
      minute: '2-digit', // Menit
      hour12: false, // Format 24 jam
    })
    .replace(':', '.') // Ubah pemisah waktu menjadi titik

  return `${formattedDate}, ${formattedTime} WIB`
}
