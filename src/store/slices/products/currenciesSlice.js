import { createSlice, current } from '@reduxjs/toolkit'

export const currenciesSlice = createSlice({
  name: 'currencies',
  initialState: {
    currencies: {},
  },
  reducers: {
    setAllCurrencies: (state, action) => {
      const allCurrencies = JSON.parse(
        JSON.stringify(current(state.currencies))
      )

      // Directly use action.payload as it is the array of currencies
      const currenciesArray = action.payload
      if (Array.isArray(currenciesArray)) {
        currenciesArray.forEach((item) => {
          if (!current(state.currencies)[item.id]) {
            allCurrencies[item.id] = item
          }
        })
      } else {
        console.error('Payload is not an array:', currenciesArray)
      }

      state.currencies = allCurrencies
    },
    currencyInfo: (state, action) => {
      const { id, data } = action.payload
      state.currencies[id] = data
    },
    removeCurrency: (state, action) => {
      const idToRemove = action.payload
      const updatedCurrencies = { ...state.currencies }
      delete updatedCurrencies[idToRemove]
      state.currencies = updatedCurrencies
    },
    currencyChangeAttr: (state, action) => {
      const { currencyId, attributes } = action.payload
      const { currencies } = state

      if (currencies[currencyId]) {
        Object.assign(currencies[currencyId], attributes)
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  setAllCurrencies,
  currencyInfo,
  removeCurrency,
  currencyChangeAttr,
} = currenciesSlice.actions

export default currenciesSlice.reducer
