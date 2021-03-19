const moment = require('moment');

export const formatDate = (date: Date): string => {
    return (moment(date)).format('DD.MM.YYYY, HH:mm')
}

export const formatDateInput = (date: Date): string => {
    return (moment(date)).format('YYYY-MM-DD')

}

export const toLocalDateTimeString = (date?: Date): string | null => {
    if (date) {
        return (moment(date).format())
    } else {
        return null
    }
}
