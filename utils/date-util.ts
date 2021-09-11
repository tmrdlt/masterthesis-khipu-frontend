const moment = require('moment')
const momentDurationFormatSetup = require('moment-duration-format')
momentDurationFormatSetup(moment)

export const formatDate = (date: Date): string => {
  return moment(date).format('DD.MM.YYYY, HH:mm')
}

export const formatDateInput = (date: Date): string => {
  return moment(date).format('YYYY-MM-DD')
}

export const toLocalDateTimeString = (date?: Date): string | null => {
  if (date) {
    return moment(date).format()
  } else {
    return null
  }
}

export const compareDateOptions = (date1?: Date, date2?: Date): boolean => {
  if (date1 && date2) {
    return date1.getTime() === date2.getTime()
  } else return !date1 && !date2
}

export const formatDuration = (minutes: number): string => {
  return moment.duration(minutes, 'minutes').format('h [hours], m [minutes]', { trim: 'both' })
}
