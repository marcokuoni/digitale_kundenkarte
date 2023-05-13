import { DE_CH, TIME_UNIT } from './const'

const timeFormat = new Intl.RelativeTimeFormat(DE_CH)

export const formatRelativeTimeS = (valueS: number) => {
  const valueSAbs = Math.abs(valueS)
  if (valueSAbs < 60) {
    return timeFormat.format(valueS, TIME_UNIT.SECOND)
  } else if (valueSAbs < 60 * 60) {
    const minutes = Math.floor(valueS / 60)
    return timeFormat.format(minutes, TIME_UNIT.MINUTE)
  } else if (valueSAbs < 60 * 60 * 24) {
    const hours = Math.floor(valueS / (60 * 60))
    return timeFormat.format(hours, TIME_UNIT.HOUR)
  } else {
    const days = Math.floor(valueS / (60 * 60 * 24))
    return timeFormat.format(days, TIME_UNIT.DAY)
  }
}
