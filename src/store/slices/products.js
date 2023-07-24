import { createSlice, current } from "@reduxjs/toolkit";
const _ = require("lodash");

export const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: {},
  },

  reducers: {
    setAllProduct: (state, action) => {
      const allProduct = {};
      action.payload.map((item) => {
        if (!{ ...current(state.products) }[item.id]) {
          allProduct[item.id] = item;
        } else {
          allProduct[item.id] = { ...current(state.products) }[item.id];
        }
      });
      state.products = allProduct;
    },
    productInfo: (state, action) => {
      console.log("ssssss", action.payload);

      const currentProducts = { ...current(state.products) };

      const mergedObject = _.mergeWith(
        {},
        currentProducts[action.payload.id],
        action.payload,
        (objValue, srcValue) => {
          if (_.isObject(objValue)) {
            return _.merge({}, objValue, srcValue);
          }
        }
      );

      currentProducts[action.payload.id] = mergedObject;
      state.products = currentProducts;
    },
    subscribe: (state, action) => {
      const currentProducts = { ...current(state.products) };
      const product = { ...currentProducts[action.payload.id] };
      product.subscribe = action.payload.data;
      const mergedObject = _.mergeWith(
        {},
        currentProducts[action.payload.id],
        product,
        (objValue, srcValue) => {
          if (_.isObject(objValue)) {
            return _.merge({}, objValue, srcValue);
          }
        }
      );

      currentProducts[action.payload.id] = mergedObject;
      state.products = currentProducts;
    },
    removeProduct: (state, action) => {
      const currentProducts = { ...current(state.products) };
      delete currentProducts[action.payload];
      state.products = currentProducts;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setAllProduct, subscribe, productInfo, removeProduct } =
  productsSlice.actions;
export default productsSlice.reducer;