export const validateSpecifications = (
  specificationsArray,
  specificationValues,
  intl,
  setSpecValidationErrors
) => {
  const errors = {}

  specificationsArray &&
    specificationsArray.forEach((specification) => {
      let {
        id: specificationId,
        isRequired,
        regularExpression,
        validationFailureDescription,
      } = specification

      const value = specificationValues[specificationId] || ''
      if (regularExpression.startsWith('/')) {
        regularExpression = regularExpression.slice(1)
      }
      if (regularExpression.endsWith('/')) {
        regularExpression = regularExpression.slice(0, -1)
      }

      let flags = ''
      if (/[gimus]+$/.test(regularExpression)) {
        flags = regularExpression.slice(-1)
        regularExpression = regularExpression.slice(0, -1)
      }

      let pattern = regularExpression

      let regex = new RegExp(pattern, flags)

      if (isRequired && !value.trim()) {
        errors[specificationId] = intl.formatMessage({
          id: 'This-field-is-required',
        })
      } else if (regularExpression && value.trim() && !regex.test(value)) {
        errors[specificationId] =
          validationFailureDescription[intl.locale] ||
          (intl.locale === 'ar' && validationFailureDescription['en']) ||
          (intl.locale === 'en' && validationFailureDescription['ar'])
      }
    })

  setSpecValidationErrors(errors)
  return { errors }
}
