export function checkSize (size) {
  let adjustedSize = size
  let isnum = /^\d+$/.test(size)
  if (size && isnum) {
    if (size.toString().length > 3 && size.toString().length < 7) {
      adjustedSize = size / 1000
      adjustedSize = Math.round(adjustedSize)
      adjustedSize = adjustedSize.toString()
      adjustedSize = adjustedSize + ' KB'
    } else if (size.toString().length > 6) {
      adjustedSize = size / 1000000
      adjustedSize = Math.round(adjustedSize)
      adjustedSize = adjustedSize.toString()
      adjustedSize = adjustedSize + ' MB'
    } else if (size.toString().length < 4) {
      adjustedSize = Math.round(adjustedSize)
      adjustedSize = adjustedSize.toString()
      adjustedSize = adjustedSize + ' Bytes'
    }
  } else {
    adjustedSize = ''
  }
  return adjustedSize
}
