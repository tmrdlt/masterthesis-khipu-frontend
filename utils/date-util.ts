const moment = require('moment');

export const formatDate = (date: Date): string => {
    return (moment(date)).format('DD.MM.YYYY HH:mm:ss')
}

export const formatDateInput = (date: Date): string => {
    return (moment(date)).format('YYYY-MM-DD')

}
