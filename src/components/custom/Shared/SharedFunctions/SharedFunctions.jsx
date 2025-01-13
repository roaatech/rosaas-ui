import { useIntl } from 'react-intl'
import SafeFormatMessage from '../SafeFormatMessage/SafeFormatMessage'
const useSharedFunctions = () => {
  const locale = useIntl().locale
  const getLocalizedString = (localizations) => {
    switch (locale) {
      case 'en':
        return localizations?.en || localizations?.ar
      case 'ar':
        return localizations?.ar || localizations?.en
      default:
        throw new Error(`Cannot localize string for locale ${locale}`)
    }
  }
  return {
    getLocalizedString,
  }
}
export const getKeyByValueWithFormattedMessage = (obj, value, formatted) => {
  const entry = Object.entries(obj).find(([key, val]) => val === value)
  return entry
    ? formatted
      ? entry?.[0]
      : SafeFormatMessage({ id: entry?.[0] })
    : null
}
export const convertEnumToOptionsArray = (obj) => {
  return Object.entries(obj).map(([key, value]) => ({
    label: key && SafeFormatMessage({ id: key }),
    value: value,
  }))
}
export const convertObjectToCustomOptionsArray = (obj, label, value) => {
  return Object.entries(obj).map(([key, objValue]) => ({
    label: objValue[label],
    value: objValue[value],
  }))
}
export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              reject('User denied the request for Geolocation.')
              break
            case error.POSITION_UNAVAILABLE:
              reject('Location information is unavailable.')
              break
            case error.TIMEOUT:
              reject('The request to get user location timed out.')
              break
            default:
              reject('An unknown error occurred.')
              break
          }
        }
      )
    } else {
      reject('Geolocation is not supported by this browser.')
    }
  })
}

export default useSharedFunctions
