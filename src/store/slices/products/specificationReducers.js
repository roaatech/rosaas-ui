import { current } from '@reduxjs/toolkit'

const setAllSpecifications = (state, action) => {
  const allProduct = JSON.parse(JSON.stringify(current(state.products)))
  const allSpecifications = {}
  action.payload.data.map((item) => {
    allSpecifications[item.id] = item
  })

  allProduct[action.payload.productId].specifications = allSpecifications
  state.products = allProduct
}

const specificationInfo = (state, action) => {
  const { productId, specificationId, data } = action.payload
  console.log('Payload received:', action.payload)

  const currentProducts = { ...state.products }

  const productToUpdate = currentProducts[productId]

  if (!productToUpdate.specifications) {
    productToUpdate.specifications = {}
  }

  productToUpdate.specifications[specificationId] = data
  console.log('Updated product:', productToUpdate)

  state.products = {
    ...currentProducts,
    [productId]: productToUpdate,
  }
}
const specificationChangeAttr = (state, action) => {
  const { productId, specificationId, attr, value } = action.payload
  state.products = {
    ...state.products,
    [productId]: {
      ...state.products[productId],
      specifications: {
        ...state.products[productId]?.specifications,
        [specificationId]: {
          ...state.products[productId]?.specifications?.[specificationId],
          [attr]: value,
        },
      },
    },
  }
}

const deleteSpecification = (state, action) => {
  const allProduct = JSON.parse(JSON.stringify(current(state.products)))
  delete allProduct[action.payload.productId].specifications[
    action.payload.specificationId
  ]
  state.products = allProduct
}

export {
  setAllSpecifications,
  specificationInfo,
  specificationChangeAttr,
  deleteSpecification,
}
