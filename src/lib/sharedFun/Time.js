import { format, utcToZonedTime } from 'date-fns-tz'
import { useIntl } from 'react-intl'

// export const DataTransform = (dateTime) => {
//   const utcDateTime = new Date(dateTime + 'Z')
//   const localDateTime = utcDateTime.toLocaleString(undefined, {
//     timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
//   })
//   return localDateTime
// }

// export const DataTransform = (dateTime) => {
//   const utcDateTime = new Date(dateTime + 'Z')
//   const localDateTime = new Date(
//     utcDateTime.toLocaleString(undefined, {
//       timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
//     })
//   )

//   const year = localDateTime.getFullYear()
//   const month = String(localDateTime.getMonth() + 1).padStart(2, '0')
//   const day = String(localDateTime.getDate()).padStart(2, '0')
//   const hours = String(localDateTime.getHours()).padStart(2, '0')
//   const minutes = String(localDateTime.getMinutes()).padStart(2, '0')
//   const seconds = String(localDateTime.getSeconds()).padStart(2, '0')

//   return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`
// }

export const DataTransform = (dateTime) => {
  if (!dateTime || isNaN(new Date(dateTime).getTime())) {
    return ''
  }

  const utcDateTime = new Date(dateTime + 'Z')
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const localDateTime = utcToZonedTime(utcDateTime, timeZone)

  const hasTime = localDateTime.toISOString().split('T')[1] !== '00:00:00.000Z'

  const formattedDateTime = hasTime
    ? format(localDateTime, 'MM/dd/yyyy HH:mm:ss', {
        timeZone,
      })
    : format(localDateTime, 'MM/dd/yyyy', {
        timeZone,
      })

  return formattedDateTime
}

export const UppercaseMonthDateFormat = (
  dateTime,
  withTime = false,
  withSeconds = false,
  withMilliseconds = false
) => {
  if (!dateTime || isNaN(new Date(dateTime).getTime())) {
    return ''
  }

  const utcDateTime = new Date(dateTime + 'Z')
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const localDateTime = utcToZonedTime(utcDateTime, timeZone)

  const currentYear = new Date().getFullYear()
  const dateYear = localDateTime.getFullYear()

  const dateFormat = currentYear === dateYear ? 'MMM dd' : 'MMM dd, yyyy'

  // Add milliseconds to the time format based on the flags
  let timeFormat = 'HH:mm'
  if (withSeconds) {
    timeFormat += ':ss'
  }
  if (withMilliseconds) {
    timeFormat += '.SSS'
  }

  const formattedDateTime = format(
    localDateTime,
    withTime ? `${dateFormat}, ${timeFormat}` : dateFormat,
    { timeZone }
  )

  return formattedDateTime.toUpperCase()
}

export const formatDate = (dateTime) => {
  if (!dateTime || isNaN(new Date(dateTime).getTime())) {
    return ''
  }

  const utcDateTime = dateTime ? new Date(dateTime + 'Z') : ''
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const localDateTime = dateTime ? utcToZonedTime(utcDateTime, timeZone) : ''

  const formattedDate = dateTime
    ? format(localDateTime, 'MM/dd/yyyy', {
        timeZone,
      })
    : ''

  return formattedDate
}
export const timeDifferenceFromNow = (targetDate) => {
  // Convert the targetDate parameter to a Date object if it is not already
  if (!(targetDate instanceof Date)) {
    targetDate = new Date(targetDate)
  }

  // Get the current date and time
  const currentDate = new Date()

  // Calculate the difference in milliseconds between the current date and the target date
  const timeDifferenceMillis =
    Date.parse(currentDate) - Date.parse(DataTransform(targetDate))
  // Calculate the difference in hours and minutes
  const hoursDifference = Math.floor(timeDifferenceMillis / (1000 * 60 * 60))
  const minutesDifference = Math.floor(
    (timeDifferenceMillis % (1000 * 60 * 60)) / (1000 * 60)
  )

  return { hours: hoursDifference, minutes: minutesDifference }
}
export const Time = (date, before) => {
  const timeDifference = timeDifferenceFromNow(date)
  const intl = useIntl()
  const isHour = (hour) => {
    return hour > 0
      ? `${hour} ${intl.formatMessage({
          id: 'hours-and',
        })}`
      : ''
  }

  return timeDifference.hours < 24
    ? `${before} ${isHour(timeDifference.hours)} 

    ${
      timeDifference.minutes < 1
        ? intl.formatMessage({
            id: 'a-few-seconds',
          })
        : timeDifference.minutes +
          intl.formatMessage({
            id: 'minutes',
          })
    }  `
    : `${before} ${DataTransform(date)}`
}
