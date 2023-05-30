import { configureStore } from "@reduxjs/toolkit";
import mainReducer from "./slices/main";

export default configureStore({
  reducer: {
    main: mainReducer,
  },
});
