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
export default useSharedFunctions
