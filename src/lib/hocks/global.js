import { useDispatch } from 'react-redux'
import {
  directionFun,
  setCurrentCurrencyCodeAndId,
} from '../../store/slices/main'
let x = 0
const useGlobal = () => {
  const dispatch = useDispatch()
  const changeDirection = (direction) => {
    localStorage.setItem('direction', direction)
    dispatch(directionFun(direction))
    document.documentElement.dir = direction
  }
  const setCurrency = (currencyCode, currencyId) => {
    localStorage.setItem('currencyCode', currencyCode)
    localStorage.setItem('currencyId', currencyId)
    dispatch(
      setCurrentCurrencyCodeAndId({
        id: currencyId,
        currencyCode: currencyCode,
      })
    )
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

  return {
    changeDirection,
    searchWait,
    setCurrency,
  }
}

export default useGlobal
