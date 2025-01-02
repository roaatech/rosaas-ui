import { useIntl } from 'react-intl'
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
