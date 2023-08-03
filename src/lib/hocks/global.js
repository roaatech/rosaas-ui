import { useDispatch } from 'react-redux'
import { directionFun } from '../../store/slices/main'
let x = 0
const useGlobal = () => {
  const dispatch = useDispatch()
  const changeDirection = (direction) => {
    localStorage.setItem('direction', direction)
    dispatch(directionFun(direction))
    document.documentElement.dir = direction
  }

  const DataTransform = (dateTime) => {
    const utcDateTime = new Date(dateTime + 'Z')
    const localDateTime = utcDateTime.toLocaleString(undefined, {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })
    return localDateTime
  }

  const searchWait = (e, setInputValue, setSearchValue, setFirst) => {
    setInputValue(e.target.value)
    const oldText = e.target.value
    x++
    const y = x
    setTimeout(() => {
      if (x === y) {
        setSearchValue(oldText)
        setFirst(0)
      }
    }, 1000)
  }

  function timeDifferenceFromNow(targetDate) {
    // Convert the targetDate parameter to a Date object if it is not already
    if (!(targetDate instanceof Date)) {
      targetDate = new Date(targetDate)
    }

    // Get the current date and time
    const currentDate = new Date()

    // Calculate the difference in milliseconds between the current date and the target date
    const timeDifferenceMillis = currentDate - targetDate

    // Calculate the difference in hours and minutes
    const hoursDifference = Math.floor(timeDifferenceMillis / (1000 * 60 * 60))
    const minutesDifference = Math.floor(
      (timeDifferenceMillis % (1000 * 60 * 60)) / (1000 * 60)
    )

    return { hours: hoursDifference, minutes: minutesDifference }
  }

  return {
    changeDirection,
    DataTransform,
    searchWait,
    timeDifferenceFromNow,
  }
}

export default useGlobal
