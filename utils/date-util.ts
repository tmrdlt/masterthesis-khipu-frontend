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

export const compareDateOptions = (date1?: Date, date2?: Date): boolean => {
    console.log(date1, date2)
    if (date1 && date2) {
        return date1.getTime() === date2.getTime();
    } else return !date1 && !date2;

}
