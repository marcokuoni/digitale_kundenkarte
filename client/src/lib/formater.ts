const timeFormat = new Intl.RelativeTimeFormat('de-CH')

export const formatRelativeTimeS = (valueS: number) => {
  const valueSAbs = Math.abs(valueS)
  if (valueSAbs < 60) {
    return timeFormat.format(valueS, 'second')
  } else if (valueSAbs < 60 * 60) {
    const minutes = Math.floor(valueS / 60)
    return timeFormat.format(minutes, 'minutes')
  } else if (valueSAbs < 60 * 60 * 24) {
    const hours = Math.floor(valueS / (60 * 60))
    return timeFormat.format(hours, 'hour')
  } else {
    const days = Math.floor(valueS / (60 * 60 * 24))
    return timeFormat.format(days, 'day')
  }
}
