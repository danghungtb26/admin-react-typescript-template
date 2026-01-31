import dateTime from '.'

export const HH_MM_SS_DD_MM_YYYY = 'HH:mm:ss DD-MM-YYYY'

export const YYYY_MM_DD_T_HH_MM_SS_Z = 'YYYY-MM-DD[T]HH:mm:ss[Z]'

export const DD_MM_YYYY = 'DD-MM-YYYY'

export const YYYY_MM_DD = 'YYYY-MM-DD'

export const DD_MM_YYYY_T = 'DD [tháng] MM, [năm] YYYY'

export const HH_mm = 'HH:mm'

export const formatDate = (date: string, format?: string) => {
  return dateTime(date).format(format ?? HH_MM_SS_DD_MM_YYYY)
}

export const formatScheduleTime = (start: string, end: string) => {
  const startTime = dateTime(start).utc()
  const endTime = dateTime(end).utc()

  const dStart = startTime.format(DD_MM_YYYY)
  const dEnd = endTime.format(DD_MM_YYYY)

  const hStart = startTime.format(HH_mm)
  const hEnd = endTime.format(HH_mm)

  if (dStart === dEnd) {
    return `${hStart} - ${hEnd}(${dStart})`
  }

  return `${hStart} (${dStart}) - ${hEnd} (${dEnd})`
}
