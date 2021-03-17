const moment = require('moment');

export const formatDate = (date: Date): string => {
    return (moment(date)).format('DD.MM.YYYY HH:mm:ss')

}
