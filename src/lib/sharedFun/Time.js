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
  const utcDateTime = new Date(dateTime + 'Z')
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const localDateTime = utcToZonedTime(utcDateTime, timeZone)
  const formattedDateTime = format(localDateTime, 'MM/dd/yyyy HH:mm:ss', {
    timeZone,
  })

  return formattedDateTime
}
export const formatDate = (dateTime) => {
  const utcDateTime = new Date(dateTime + 'Z')
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const localDateTime = utcToZonedTime(utcDateTime, timeZone)

  const formattedDate = format(localDateTime, 'MM/dd/yyyy', {
    timeZone,
  })

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
