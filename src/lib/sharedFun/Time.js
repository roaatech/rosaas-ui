const isHour = (hour) => {
  return hour > 0 ? `${hour} hours and` : ''
}

export const DataTransform = (dateTime) => {
  const utcDateTime = new Date(dateTime + 'Z')
  const localDateTime = utcDateTime.toLocaleString(undefined, {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  })
  return localDateTime
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
//console.log(Time(new Date('2023-08-16T09:27:01')), 'dateTest')
export const Time = (date, before) => {
  const timeDifference = timeDifferenceFromNow(date)
  return timeDifference.hours < 24
    ? `${before} ${isHour(timeDifference.hours)} 

    ${
      timeDifference.minutes < 1
        ? 'a few seconds'
        : timeDifference.minutes + ' minutes'
    }  `
    : `${before} ${DataTransform(date)}`
}
